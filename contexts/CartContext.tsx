'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_description: string;
  product_image: string;
  product_price: string;
  product_original_price?: string;
  product_in_stock: boolean;
  product_stock_count: number;
  category_name?: string;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product_id === action.payload.product_id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartShipping: () => number;
  isItemInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('betterBeing_cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('betterBeing_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = (): number => {
    return state.items.reduce((total, item) => 
      total + (parseFloat(item.product_price) * item.quantity), 0
    );
  };

  const getCartTax = (): number => {
    return getCartSubtotal() * 0.15; // 15% tax
  };

  const getCartShipping = (): number => {
    const subtotal = getCartSubtotal();
    return subtotal >= 500 ? 0 : 50; // Free shipping over R500
  };

  const getCartTotal = (): number => {
    return getCartSubtotal() + getCartTax() + getCartShipping();
  };

  const isItemInCart = (productId: number): boolean => {
    return state.items.some(item => item.product_id === productId);
  };

  const getItemQuantity = (productId: number): number => {
    const item = state.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getCartShipping,
    isItemInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}