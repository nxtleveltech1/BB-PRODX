'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowRight, Calendar } from 'lucide-react';

// Mock order data - would come from API/database
const mockOrder = {
  orderNumber: 'ORD-' + Math.random().toString().substr(2, 6),
  orderDate: new Date().toLocaleDateString('en-ZA'),
  expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA'),
  email: 'customer@example.com',
  total: 299.97,
  items: [
    { name: 'Organic Ashwagandha Capsules', quantity: 2, price: 89.99 },
    { name: 'Himalayan Shilajit Resin', quantity: 1, price: 149.99 }
  ]
};

export default function CheckoutSuccessPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F9E7C9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ba7500]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bb-champagne to-bb-champagne/90 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500 shadow-xl animate-scale-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-bb-black-bean mb-4">Order Confirmed!</h1>
          <p className="text-bb-payne-gray text-xl">Thank you for choosing Better Being. Your wellness journey continues with premium products on the way.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gradient-to-br from-white/80 to-bb-champagne/40 backdrop-blur-sm border-2 border-bb-mahogany/20 rounded-xl shadow-xl overflow-hidden mb-8">
          {/* Order Summary Header */}
          <div className="bg-gradient-to-r from-bb-mahogany to-bb-mahogany/90 text-white p-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2">Order #{mockOrder.orderNumber}</h2>
                <p className="opacity-90 text-bb-champagne">Placed on {mockOrder.orderDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 text-bb-champagne">Total Paid</p>
                <p className="text-3xl font-bold text-bb-citron">R{mockOrder.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Order Details Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Items */}
              <div>
                <h3 className="font-heading font-semibold text-bb-black-bean mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-bb-mahogany" />
                  Items Ordered
                </h3>
                <div className="space-y-4">
                  {mockOrder.items.map((item, index) => (
                    <div key={index} className="bg-bb-champagne/40 rounded-lg p-4 border border-bb-mahogany/20">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-heading font-semibold text-bb-black-bean mb-1">{item.name}</p>
                          <p className="text-sm text-bb-payne-gray">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-bb-mahogany text-lg">R{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h3 className="font-heading font-semibold text-bb-black-bean mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-bb-mahogany" />
                  Delivery Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-xl p-6">
                    <p className="text-sm text-green-800 font-medium mb-2">Expected Delivery</p>
                    <p className="text-2xl font-heading font-bold text-green-900 mb-1">{mockOrder.expectedDelivery}</p>
                    <p className="text-sm text-green-700">2-3 business days via courier</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-800 font-medium">Confirmation Email Sent</p>
                    </div>
                    <p className="text-sm text-blue-700">
                      Order confirmation and tracking details sent to<br />
                      <span className="font-medium">{mockOrder.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-white/80 to-bb-champagne/40 backdrop-blur-sm border-2 border-bb-mahogany/20 rounded-xl shadow-xl p-8 mb-8">
          <h3 className="font-heading font-semibold text-bb-black-bean mb-6 text-xl">What happens next?</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-bb-mahogany to-bb-mahogany/80 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold shadow-lg">
                1
              </div>
              <div>
                <p className="font-heading font-semibold text-bb-black-bean mb-2">Order Processing</p>
                <p className="text-bb-payne-gray">We're preparing your wellness products with care and attention to detail.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-bb-mahogany to-bb-mahogany/80 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold shadow-lg">
                2
              </div>
              <div>
                <p className="font-heading font-semibold text-bb-black-bean mb-2">Quality Check & Packaging</p>
                <p className="text-bb-payne-gray">Each item is carefully inspected and securely packaged for safe shipping.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-bb-mahogany to-bb-mahogany/80 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold shadow-lg">
                3
              </div>
              <div>
                <p className="font-heading font-semibold text-bb-black-bean mb-2">Shipping & Tracking</p>
                <p className="text-bb-payne-gray">You'll receive tracking information via email once your order ships.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold shadow-lg">
                4
              </div>
              <div>
                <p className="font-heading font-semibold text-bb-black-bean mb-2">Delivery & Wellness Journey</p>
                <p className="text-bb-payne-gray">Your wellness journey continues with premium products delivered to your door.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/account"
            className="bg-gradient-to-r from-bb-mahogany to-bb-mahogany/90 text-white px-8 py-4 rounded-lg hover:from-bb-mahogany/90 hover:to-bb-mahogany transition-all text-center flex items-center justify-center gap-3 font-heading font-semibold text-lg shadow-lg transform hover:scale-105"
          >
            <Package className="w-6 h-6" />
            View Order History
          </Link>
          
          <Link
            href="/products"
            className="border-2 border-bb-mahogany text-bb-mahogany px-8 py-4 rounded-lg hover:bg-bb-mahogany hover:text-white transition-all text-center flex items-center justify-center gap-3 font-heading font-semibold text-lg shadow-lg transform hover:scale-105"
          >
            Continue Shopping
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-bb-champagne/60 to-white/80 rounded-xl border-2 border-bb-mahogany/20">
          <p className="text-bb-payne-gray text-lg mb-4">
            Need help with your order? Have questions about our products?
          </p>
          <Link
            href="/contact"
            className="text-bb-mahogany hover:text-bb-mahogany/80 font-heading font-semibold text-lg transition-colors"
          >
            Contact Our Wellness Support Team
          </Link>
        </div>
      </div>
    </div>
  );
}