'use client';

import { useUser } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, ArrowLeft, CreditCard, Truck } from 'lucide-react';
import AuthGuard from '../../components/AuthGuard';

// Add dynamic export to prevent SSG
export const dynamic = 'force-dynamic';

const products = [
  {
    id: 1,
    name: 'Organic Ashwagandha Capsules',
    price: 89.99,
    image: '/api/placeholder/200/200',
    description: 'Premium organic ashwagandha for stress relief and vitality',
    category: 'Supplements'
  },
  {
    id: 2,
    name: 'Turmeric Golden Milk Blend',
    price: 34.99,
    image: '/api/placeholder/200/200',
    description: 'Anti-inflammatory golden milk powder blend',
    category: 'Wellness Drinks'
  },
  {
    id: 3,
    name: 'Himalayan Shilajit Resin',
    price: 149.99,
    image: '/api/placeholder/200/200',
    description: 'Pure Himalayan shilajit for energy and vitality',
    category: 'Premium Supplements'
  },
  {
    id: 4,
    name: 'Wellness Care Package',
    price: 199.99,
    image: '/api/placeholder/200/200',
    description: 'Complete wellness starter kit with multiple products',
    category: 'Bundles'
  }
];

function OrderContent() {
  const { user } = useUser();
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    const existing = cart.find(item => item.id === productId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/account" className="flex items-center space-x-2 text-[#ba7500] hover:text-[#C4C240] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Account</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[#ba7500]">New Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <div className="bg-white/50 backdrop-blur-sm border border-[#ba7500]/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#ba7500] mb-6">Available Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white/30 rounded-lg p-4 border border-[#ba7500]/10">
                    <div className="w-full h-32 bg-gradient-to-br from-[#ba7500] to-[#C4C240] rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{product.category}</span>
                    </div>
                    <h3 className="font-semibold text-[#ba7500] mb-2">{product.name}</h3>
                    <p className="text-[#7A7771] text-sm mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#ba7500]">R{product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-[#ba7500] to-[#C4C240] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white/50 backdrop-blur-sm border border-[#ba7500]/20 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-[#ba7500] mb-6 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Your Cart ({cart.length})
              </h2>
              
              {cart.length === 0 ? (
                <p className="text-[#7A7771] text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white/30 rounded-lg p-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#ba7500] text-sm">{item.name}</h4>
                          <p className="text-[#7A7771] text-xs">R{item.price} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-[#ba7500]/20 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-[#ba7500]">Total:</span>
                      <span className="text-xl font-bold text-[#ba7500]">R{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-gradient-to-r from-[#ba7500] to-[#C4C240] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-[#ba7500] mb-4">Order Confirmation</h3>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setCart([]);
                    alert('Order placed successfully!');
                  }}
                  className="flex-1 bg-gradient-to-r from-[#ba7500] to-[#C4C240] text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 border border-[#ba7500] text-[#ba7500] py-2 rounded-lg hover:bg-[#ba7500]/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <AuthGuard requireAuth={true}>
      <OrderContent />
    </AuthGuard>
  );
}
