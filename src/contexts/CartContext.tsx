import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Types
interface ApiCartItem {
  cart_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  size?: string;
  in_stock: boolean;
  stock_count: number;
}

interface ApiCartSummary {
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
}

interface AddToCartData {
  productId: number;
  quantity?: number;
  size?: string;
}

// Legacy/UI cart types (used by app/cart + app/checkout)
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

interface CartContextType {
  // Newer server-backed API
  cartItems: ApiCartItem[];
  cartSummary: ApiCartSummary;
  isLoading: boolean;
  getCartCount: () => number;
  addToCart: (data: AddToCartData) => void;
  updateCartItem: (cartItemId: number, quantity: number) => void;
  removeFromCart: (cartItemId: number) => void;
  clearCart: () => void;
  isAddingToCart: boolean;
  isItemInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;

  // Legacy UI API (kept for existing pages/components)
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartShipping: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// API functions
// Always use same-origin `/api` so Next.js rewrites proxy to the backend.
// This avoids cross-origin cookie issues and keeps auth working reliably.
const API_BASE = '/api';

type EnhancedCartSummary = {
  itemCount?: number;
  quantity?: number;
  total?: string | number;
};

type EnhancedCartItem = {
  id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_image: string;
  product_price: string;
  product_in_stock: boolean;
  product_stock_count: number;
};

type EnhancedCartResponse = {
  success: boolean;
  message?: string;
  error?: string;
  cart?: {
    items: EnhancedCartItem[];
    summary: EnhancedCartSummary;
    isEmpty: boolean;
  };
  summary?: EnhancedCartSummary;
  errors?: Array<{ msg?: string; message?: string }>;
};

const parseMoney = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json().catch(() => null)) as EnhancedCartResponse | null;
    const message =
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.msg ||
      data?.errors?.[0]?.message;

    if (response.status === 401) {
      return message || 'Please sign in to add items to your cart.';
    }

    return message || `Request failed (HTTP ${response.status})`;
  } catch {
    if (response.status === 401) return 'Please sign in to add items to your cart.';
    return `Request failed (HTTP ${response.status})`;
  }
};

const mapEnhancedItemToApiItem = (item: EnhancedCartItem): ApiCartItem => ({
  cart_id: item.id,
  product_id: item.product_id,
  name: item.product_name ?? '',
  price: String(item.product_price ?? '0'),
  image_url: item.product_image ?? '/placeholder.svg',
  quantity: Number(item.quantity) || 0,
  size: undefined,
  in_stock: Boolean(item.product_in_stock),
  stock_count: Number(item.product_stock_count) || 0,
});

const mapEnhancedSummaryToApiSummary = (summary: EnhancedCartSummary | undefined): ApiCartSummary => ({
  totalItems: Number(summary?.itemCount) || 0,
  totalQuantity: Number(summary?.quantity) || 0,
  totalPrice: parseMoney(summary?.total),
});

const cartApi = {
  getCart: async (): Promise<ApiCartItem[]> => {
    const response = await fetch(`${API_BASE}/cart`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 401) return [];
    if (!response.ok) throw new Error(await getErrorMessage(response));

    const data = (await response.json()) as EnhancedCartResponse;
    const items = data?.cart?.items ?? [];
    return items.map(mapEnhancedItemToApiItem);
  },

  getCartSummary: async (): Promise<ApiCartSummary> => {
    const response = await fetch(`${API_BASE}/cart/summary`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 401) return { totalItems: 0, totalQuantity: 0, totalPrice: 0 };
    if (!response.ok) throw new Error(await getErrorMessage(response));

    const data = (await response.json()) as EnhancedCartResponse;
    const summary = data?.summary;
    return mapEnhancedSummaryToApiSummary(summary);
  },

  addToCart: async (data: AddToCartData): Promise<any> => {
    const response = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: data.productId, quantity: data.quantity ?? 1 }),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return response.json();
  },

  updateCartItem: async (cartItemId: number, quantity: number): Promise<any> => {
    const response = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return response.json();
  },

  removeFromCart: async (cartItemId: number): Promise<any> => {
    const response = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return response.json();
  },

  clearCart: async (): Promise<any> => {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return response.json();
  },
};

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

// Hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: true,
    retry: false,
  });

  // Fetch cart summary
  const { data: cartSummary = { totalItems: 0, totalQuantity: 0, totalPrice: 0 } } = useQuery({
    queryKey: ['cart-summary'],
    queryFn: cartApi.getCartSummary,
    enabled: true,
    retry: false,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-summary'] });
      toast.success(data.message || 'Item added to cart!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add item to cart');
    },
  });

  // Update cart item mutation
  const updateCartMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartApi.updateCartItem(cartItemId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-summary'] });
      toast.success(data.message || 'Cart updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-summary'] });
      toast.success(data.message || 'Item removed from cart!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove item from cart');
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-summary'] });
      toast.success(data.message || 'Cart cleared!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to clear cart');
    },
  });

  // Map server items to legacy UI items expected by existing pages
  const legacyItems: CartItem[] = useMemo(() => {
    return (Array.isArray(cartItems) ? cartItems : []).map((i) => ({
      id: i.cart_id,
      product_id: i.product_id,
      quantity: Number(i.quantity) || 0,
      product_name: i.name ?? '',
      product_description: '',
      product_image: i.image_url ?? '/placeholder.svg',
      product_price: String(i.price ?? '0'),
      product_original_price: undefined,
      product_in_stock: Boolean(i.in_stock),
      product_stock_count: Number(i.stock_count) || 0,
      category_name: undefined,
    }));
  }, [cartItems]);

  const getCartSubtotal = (): number =>
    legacyItems.reduce((total, item) => total + (parseFloat(item.product_price) * item.quantity), 0);

  const getCartTax = (): number => getCartSubtotal() * 0.15; // 15% VAT

  const getCartShipping = (): number => {
    const subtotal = getCartSubtotal();
    return subtotal >= 500 ? 0 : 50; // Free shipping over R500
  };

  const getCartTotal = (): number => getCartSubtotal() + getCartTax() + getCartShipping();

  const contextValue: CartContextType = {
    cartItems,
    cartSummary,
    isLoading,
    getCartCount: () => {
      if (typeof cartSummary?.totalQuantity === 'number') return cartSummary.totalQuantity;
      try {
        return Array.isArray(cartItems) ? cartItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0) : 0;
      } catch {
        return 0;
      }
    },
    addToCart: addToCartMutation.mutate,
    updateCartItem: (cartItemId: number, quantity: number) =>
      updateCartMutation.mutate({ cartItemId, quantity }),
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isItemInCart: (productId: number) => {
      return Array.isArray(cartItems) && cartItems.some(item => item.product_id === productId);
    },
    getItemQuantity: (productId: number) => {
      const item = Array.isArray(cartItems) ? cartItems.find(item => item.product_id === productId) : undefined;
      return item ? Number(item.quantity) || 0 : 0;
    },

    // Legacy API
    state: {
      items: legacyItems,
      isLoading,
      error: null,
    },
    addItem: (item: CartItem) => {
      addToCartMutation.mutate({
        productId: item.product_id,
        quantity: item.quantity,
      });
    },
    removeItem: (id: number) => removeFromCartMutation.mutate(id),
    updateQuantity: (id: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCartMutation.mutate(id);
        return;
      }
      updateCartMutation.mutate({ cartItemId: id, quantity });
    },
    getCartSubtotal,
    getCartTax,
    getCartShipping,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};


// Hook for non-authenticated users (guest cart functionality)
export const useGuestCart = () => {
  const [guestCartItems, setGuestCartItems] = React.useState<any[]>([]);
  
  const addToGuestCart = (item: AddToCartData) => {
    setGuestCartItems(prev => {
      const existingIndex = prev.findIndex(
        p => p.productId === item.productId && p.size === item.size
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity || 1;
        return updated;
      }
      
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    
    toast.success('Item added to cart! Sign in to save your cart.');
  };

  const removeFromGuestCart = (productId: number, size?: string) => {
    setGuestCartItems(prev => 
      prev.filter(item => !(item.productId === productId && item.size === size))
    );
  };

  const clearGuestCart = () => {
    setGuestCartItems([]);
  };

  return {
    guestCartItems,
    addToGuestCart,
    removeFromGuestCart,
    clearGuestCart,
    guestCartCount: guestCartItems.reduce((sum, item) => sum + item.quantity, 0),
  };
};
