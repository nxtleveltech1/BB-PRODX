'use client';

import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowRight,
  Shield,
  Truck,
  Clock,
  X,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";

// Mock cart data - would be replaced with actual API calls
const _mockCartItems = [
  {
    id: 1,
    product_id: 1,
    quantity: 2,
    product_name: "Organic Ashwagandha Capsules",
    product_description: "Premium organic ashwagandha for stress relief and energy balance.",
    product_image: "/api/placeholder/400/400",
    product_price: "89.99",
    product_original_price: "119.99",
    product_in_stock: true,
    product_stock_count: 12,
    category_name: "Adaptogens"
  },
  {
    id: 2,
    product_id: 2,
    quantity: 1,
    product_name: "Himalayan Shilajit Resin",
    product_description: "Authentic Himalayan shilajit for vitality and mineral supplementation.",
    product_image: "/api/placeholder/400/400",
    product_price: "149.99",
    product_in_stock: true,
    product_stock_count: 5,
    category_name: "Minerals"
  }
];

interface CartPageItem {
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

interface CartSummary {
  subtotal: number;
  originalTotal: number;
  savings: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingEligible: boolean;
  freeShippingRemaining: number;
}

function CartItemComponent({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isUpdating 
}: { 
  item: CartPageItem;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating: boolean;
}) {
  const itemTotal = (parseFloat(item.product_price) * item.quantity).toFixed(2);
  const hasDiscount = item.product_original_price && 
    parseFloat(item.product_original_price) > parseFloat(item.product_price);

  return (
    <div className="group bg-gradient-to-br from-[var(--bb-champagne)]/40 to-white/80 border-2 border-[var(--bb-mahogany)]/20 hover:border-[var(--bb-mahogany)]/60 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--bb-mahogany)]/10">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[var(--bb-mahogany)]/20 bg-[var(--bb-champagne)]">
          {/* Fallback icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-[var(--bb-mahogany)] opacity-60" />
          </div>
          <img
            src={item.product_image}
            alt={item.product_name}
            className="relative z-10 w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Product Info */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-heading text-lg font-semibold text-[var(--bb-black-bean)] line-clamp-2 mb-1 group-hover:text-[var(--bb-mahogany)] transition-colors">
                {item.product_name}
              </h3>
              {item.category_name && (
                <span className="bg-[var(--bb-citron)]/20 text-[var(--bb-payne-gray)] px-2 py-1 rounded-md text-xs border border-[var(--bb-citron)]/30">
                  {item.category_name}
                </span>
              )}
            </div>
            
            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              disabled={isUpdating}
              className="w-8 h-8 bg-[var(--bb-champagne)] hover:bg-red-50 text-[var(--bb-payne-gray)] hover:text-red-600 rounded-full flex items-center justify-center transition-all duration-300 border border-[var(--bb-mahogany)]/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Price and Quantity Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--bb-mahogany)]">
                R{item.product_price}
              </span>
              {hasDiscount && (
                <span className="text-lg text-[var(--bb-payne-gray)] line-through">
                  R{item.product_original_price}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[var(--bb-champagne)] border-2 border-[var(--bb-mahogany)]/20 rounded-lg">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="px-3 py-1 text-sm font-semibold min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={isUpdating || item.quantity >= item.product_stock_count}
                  className="w-8 h-8 flex items-center justify-center text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <div className="text-sm text-[var(--bb-payne-gray)]">Total</div>
                <div className="text-lg font-bold text-[var(--bb-mahogany)]">R{itemTotal}</div>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          {!item.product_in_stock && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md">
              Out of stock
            </div>
          )}
          
          {item.product_stock_count < 5 && item.product_in_stock && (
            <div className="mt-3 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-md">
              Only {item.product_stock_count} left in stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const {
    state: { items: cartItems, isLoading },
    updateQuantity,
    removeItem,
    clearCart,
    getCartCount,
    getCartSubtotal,
    getCartTax,
    getCartShipping,
    getCartTotal
  } = useCart();

  // Calculate extended summary
  const calculateSummary = (): CartSummary => {
    const subtotal = getCartSubtotal();
    
    const originalTotal = cartItems.reduce((sum, item) => {
      const price = item.product_original_price ? 
        parseFloat(item.product_original_price) : parseFloat(item.product_price);
      return sum + (price * item.quantity);
    }, 0);
    
    const savings = originalTotal - subtotal;
    const tax = getCartTax();
    const shipping = getCartShipping();
    const total = getCartTotal();
    const itemCount = getCartCount();
    const freeShippingEligible = subtotal >= 500;
    const freeShippingRemaining = Math.max(0, 500 - subtotal);

    return {
      subtotal,
      originalTotal,
      savings,
      tax,
      shipping,
      total,
      itemCount,
      freeShippingEligible,
      freeShippingRemaining
    };
  };

  const summary = calculateSummary();

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: number) => {
    removeItem(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-[var(--bb-champagne)] to-[var(--bb-champagne)]/90">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-[var(--bb-citron)]/20 to-[var(--bb-mahogany)]/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-[var(--bb-mahogany)]/20">
              <ShoppingCart className="w-16 h-16 text-[var(--bb-mahogany)]" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-[var(--bb-black-bean)] mb-4">Your cart is empty</h1>
            <p className="text-lg text-[var(--bb-payne-gray)] mb-8 max-w-md mx-auto">Looks like you haven't added any wellness products yet. Start exploring our curated collection.</p>
            <Link href="/products" className="bg-[var(--bb-mahogany)] hover:bg-[var(--bb-mahogany)]/90 text-white px-8 py-3 rounded-lg font-heading font-semibold transition-all transform hover:scale-105 shadow-lg inline-flex items-center">
              Browse Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bb-champagne)] to-[var(--bb-champagne)]/90">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-heading font-bold text-[var(--bb-black-bean)]">
                Shopping Cart
              </h1>
              <span className="text-[var(--bb-payne-gray)]">
                {summary.itemCount} item{summary.itemCount !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  isUpdating={isLoading}
                />
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6 pt-6 border-t border-[var(--bb-mahogany)]/20">
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[var(--bb-champagne)]/80 to-white/60 border-2 border-[var(--bb-mahogany)]/20 rounded-xl p-6 shadow-xl sticky top-8">
              <h2 className="text-xl font-heading font-bold text-[var(--bb-black-bean)] mb-6">
                Order Summary
              </h2>

              {/* Free Shipping Progress */}
              {!summary.freeShippingEligible && summary.freeShippingRemaining > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-[var(--bb-citron)]/10 border-2 border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        Free shipping at R500
                      </span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      R{summary.freeShippingRemaining.toFixed(2)} to go
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(10, (500 - summary.freeShippingRemaining) / 500 * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[var(--bb-payne-gray)]">
                  <span>Subtotal</span>
                  <span>R{summary.subtotal.toFixed(2)}</span>
                </div>

                {summary.savings > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>You save</span>
                    <span>-R{summary.savings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--bb-payne-gray)]">
                  <span>Tax (15%)</span>
                  <span>R{summary.tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[var(--bb-payne-gray)]">
                  <span>Shipping</span>
                  <span className={summary.freeShippingEligible ? 'text-green-600 font-medium' : ''}>
                    {summary.freeShippingEligible ? 'FREE' : `R${summary.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-[var(--bb-mahogany)]/20 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-[var(--bb-black-bean)]">Total</span>
                    <span className="text-[var(--bb-mahogany)]">R{summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link 
                href="/checkout"
                className="bg-[var(--bb-mahogany)] hover:bg-[var(--bb-mahogany)]/90 text-white w-full h-12 text-lg font-semibold mb-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>

              {/* Trust Badges */}
              <div className="space-y-3 pt-4 border-t border-[var(--bb-mahogany)]/20">
                <div className="flex items-center gap-3 text-sm text-[var(--bb-payne-gray)]">
                  <Shield className="w-4 h-4 text-green-600" />
                  Secure checkout
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--bb-payne-gray)]">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Free shipping on orders over R500
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--bb-payne-gray)]">
                  <Clock className="w-4 h-4 text-orange-600" />
                  2-3 day delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
