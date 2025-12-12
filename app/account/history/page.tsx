'use client';

import { useUser } from '@/lib/useAuth';
import Link from 'next/link';
import { ArrowLeft, Package, CheckCircle, Clock, Truck, X, Eye } from 'lucide-react';
import AuthGuard from '../../components/AuthGuard';

// Add dynamic export to prevent SSG
export const dynamic = 'force-dynamic';

const mockOrders = [
  {
    id: "BB-2024-001",
    date: "2024-03-15",
    status: "delivered",
    total: 239.97,
    items: [
      { name: "Organic Ashwagandha Capsules", quantity: 2, price: 89.99 },
      { name: "Turmeric Golden Milk Blend", quantity: 1, price: 34.99 },
      { name: "Shipping", quantity: 1, price: 25.00 }
    ],
    deliveryAddress: "123 Wellness Street, Cape Town, 8001",
    trackingNumber: "BB1234567890"
  },
  {
    id: "BB-2024-002",
    date: "2024-03-01",
    status: "shipped",
    total: 149.99,
    items: [
      { name: "Himalayan Shilajit Resin", quantity: 1, price: 149.99 }
    ],
    deliveryAddress: "123 Wellness Street, Cape Town, 8001",
    trackingNumber: "BB0987654321"
  },
  {
    id: "BB-2024-003",
    date: "2024-02-14",
    status: "processing",
    total: 199.99,
    items: [
      { name: "Wellness Care Package", quantity: 1, price: 199.99 }
    ],
    deliveryAddress: "123 Wellness Street, Cape Town, 8001",
    trackingNumber: null
  },
  {
    id: "BB-2024-004",
    date: "2024-01-28",
    status: "delivered",
    total: 89.99,
    items: [
      { name: "Organic Ashwagandha Capsules", quantity: 1, price: 89.99 }
    ],
    deliveryAddress: "123 Wellness Street, Cape Town, 8001",
    trackingNumber: "BB1122334455"
  }
];

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    delivered: { color: "bg-green-100 text-green-800", text: "Delivered", icon: CheckCircle },
    processing: { color: "bg-blue-100 text-blue-800", text: "Processing", icon: Clock },
    shipped: { color: "bg-orange-100 text-orange-800", text: "Shipped", icon: Truck },
    cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled", icon: X }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}

function OrderHistoryContent() {
  const { user: _user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-bb-champagne to-bb-champagne/90 pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/account" className="flex items-center space-x-2 text-bb-payne-gray hover:text-bb-mahogany transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Account</span>
            </Link>
          </div>
          <h1 className="text-3xl font-heading font-bold text-bb-black-bean">Order History</h1>
        </div>

        <div className="bg-white/50 backdrop-blur-sm border border-[#ba7500]/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#ba7500] flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Your Orders ({mockOrders.length})
            </h2>
            <Link 
              href="/products"
              className="bg-gradient-to-r from-[#ba7500] to-[#C4C240] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Place New Order
            </Link>
          </div>

          {mockOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-[#7A7771]/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#ba7500] mb-2">
                No orders yet
              </h3>
              <p className="text-[#7A7771] mb-6">
                Start your wellness journey with our premium products
              </p>
              <Link 
                href="/products" 
                className="bg-gradient-to-r from-[#ba7500] to-[#C4C240] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {mockOrders.map((order) => (
                <div key={order.id} className="bg-white/50 border border-[#ba7500]/10 rounded-lg p-6 hover:bg-white/70 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-[#ba7500]">
                          Order #{order.id}
                        </h3>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-[#7A7771] text-sm">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#ba7500] mb-1">
                        R{order.total.toFixed(2)}
                      </div>
                      {order.trackingNumber && (
                        <p className="text-[#7A7771] text-sm">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-[#ba7500]/20 pt-4 mb-4">
                    <h4 className="font-medium text-[#ba7500] mb-3">Items:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-[#F9E7C9]/50 rounded-lg p-3">
                          <div className="flex-1">
                            <span className="font-medium text-[#ba7500] text-sm">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                          <span className="text-[#7A7771] font-medium text-sm">
                            R{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#ba7500]/20 pt-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="mb-3 lg:mb-0">
                        <p className="text-[#7A7771] text-sm">
                          <strong>Delivery Address:</strong> {order.deliveryAddress}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 text-[#ba7500] hover:text-[#C4C240] transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        {order.status === 'delivered' && (
                          <button className="text-[#ba7500] hover:text-[#C4C240] transition-colors">
                            Reorder
                          </button>
                        )}
                        {order.trackingNumber && (
                          <button className="text-[#ba7500] hover:text-[#C4C240] transition-colors">
                            Track Package
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <AuthGuard requireAuth={true}>
      <OrderHistoryContent />
    </AuthGuard>
  );
}
