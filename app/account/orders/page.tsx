'use client';

// Add dynamic export to prevent SSG
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Download,
  RefreshCw,
  Calendar,
  CreditCard,
  MapPin,
  Eye,
  Star,
  Filter,
  Search
} from "lucide-react";

// Mock orders data - replace with actual API calls
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-03-15",
    status: "delivered" as const,
    total: 329.97,
    itemCount: 3,
    trackingNumber: "BB1234567890",
    estimatedDelivery: "2024-03-18",
    actualDelivery: "2024-03-17",
    shippingAddress: {
      name: "John Doe",
      street: "123 Wellness Street",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8001"
    },
    paymentMethod: "Card ending in 4242",
    items: [
      {
        id: 1,
        name: "Organic Ashwagandha Capsules",
        image: "/api/placeholder/100/100",
        price: 89.99,
        originalPrice: 119.99,
        quantity: 2,
        category: "Adaptogens"
      },
      {
        id: 2,
        name: "Himalayan Shilajit Resin",
        image: "/api/placeholder/100/100", 
        price: 149.99,
        quantity: 1,
        category: "Minerals"
      }
    ]
  },
  {
    id: "ORD-2024-002",
    date: "2024-03-10",
    status: "shipped" as const,
    total: 199.99,
    itemCount: 1,
    trackingNumber: "BB0987654321",
    estimatedDelivery: "2024-03-16",
    shippingAddress: {
      name: "John Doe",
      street: "123 Wellness Street", 
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8001"
    },
    paymentMethod: "Card ending in 4242",
    items: [
      {
        id: 3,
        name: "Turmeric Golden Milk Blend",
        image: "/api/placeholder/100/100",
        price: 199.99,
        quantity: 1,
        category: "Superfoods"
      }
    ]
  },
  {
    id: "ORD-2024-003", 
    date: "2024-03-05",
    status: "processing" as const,
    total: 89.99,
    itemCount: 1,
    estimatedDelivery: "2024-03-12",
    shippingAddress: {
      name: "John Doe",
      street: "123 Wellness Street",
      city: "Cape Town", 
      province: "Western Cape",
      postalCode: "8001"
    },
    paymentMethod: "Card ending in 4242",
    items: [
      {
        id: 4,
        name: "Organic Spirulina Powder",
        image: "/api/placeholder/100/100",
        price: 89.99,
        quantity: 1,
        category: "Superfoods"
      }
    ]
  },
  {
    id: "ORD-2024-004",
    date: "2024-02-28",
    status: "cancelled" as const,
    total: 149.99,
    itemCount: 1,
    estimatedDelivery: "2024-03-05",
    cancellationReason: "Out of stock",
    refundStatus: "processed",
    shippingAddress: {
      name: "John Doe", 
      street: "123 Wellness Street",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8001"
    },
    paymentMethod: "Card ending in 4242",
    items: [
      {
        id: 5,
        name: "Lion's Mane Mushroom Extract",
        image: "/api/placeholder/100/100",
        price: 149.99,
        quantity: 1,
        category: "Mushrooms"
      }
    ]
  }
];

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemCount: number;
  trackingNumber?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  cancellationReason?: string;
  refundStatus?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  paymentMethod: string;
  items: Array<{
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    category: string;
  }>;
}

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const statusConfig = {
    delivered: { color: "green", text: "Delivered", icon: CheckCircle },
    shipped: { color: "blue", text: "Shipped", icon: Truck },
    processing: { color: "orange", text: "Processing", icon: Clock },
    cancelled: { color: "red", text: "Cancelled", icon: X }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
      status === 'delivered' ? 'bg-green-100 text-green-800' :
      status === 'shipped' ? 'bg-blue-100 text-blue-800' :
      status === 'processing' ? 'bg-orange-100 text-orange-800' :
      'bg-red-100 text-red-800'
    }`}>
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
}

function OrderCard({ order, isExpanded, onToggle }: { 
  order: Order; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  const canTrack = order.status === 'shipped' || order.status === 'delivered';
  const hasDiscount = order.items.some(item => item.originalPrice && item.originalPrice > item.price);
  const totalSavings = order.items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  return (
    <div className="bg-gradient-to-br from-[var(--bb-champagne)]/60 to-white/80 border-2 border-[var(--bb-mahogany)]/20 hover:border-[var(--bb-mahogany)]/40 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[var(--bb-mahogany)]/10">
      {/* Order Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-[var(--bb-champagne)]/20 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--bb-mahogany)] to-[var(--bb-citron)] rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-heading text-lg font-bold text-[var(--bb-black-bean)]">
                  {order.id}
                </h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--bb-payne-gray)]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span>{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--bb-mahogany)]">
                R{order.total.toFixed(2)}
              </div>
              {hasDiscount && (
                <div className="text-sm text-green-600 font-medium">
                  Saved R{totalSavings.toFixed(2)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {canTrack && (
                <button className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
              )}
              <div className="transform transition-transform duration-200">
                {isExpanded ? <ChevronDown className="w-5 h-5 text-[var(--bb-payne-gray)]" /> : <ChevronRight className="w-5 h-5 text-[var(--bb-payne-gray)]" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-[var(--bb-mahogany)]/20 bg-[var(--bb-champagne)]/40">
          <div className="p-6 space-y-6">
            {/* Order Items */}
            <div>
              <h4 className="font-heading font-semibold text-[var(--bb-black-bean)] mb-4">
                Order Items
              </h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/60 rounded-lg border border-[var(--bb-mahogany)]/10">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--bb-citron)]/20 to-[var(--bb-mahogany)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-[var(--bb-mahogany)]" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-[var(--bb-black-bean)] mb-1">{item.name}</h5>
                      <div className="flex items-center gap-3 text-sm text-[var(--bb-payne-gray)]">
                        <span className="bg-[var(--bb-citron)]/20 px-2 py-1 rounded text-xs">
                          {item.category}
                        </span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[var(--bb-mahogany)]">
                        R{(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-sm text-[var(--bb-payne-gray)] line-through">
                          R{(item.originalPrice * item.quantity).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white/60 rounded-lg p-4 border border-[var(--bb-mahogany)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[var(--bb-mahogany)]" />
                  <h5 className="font-heading font-semibold text-[var(--bb-black-bean)]">
                    Shipping Address
                  </h5>
                </div>
                <div className="text-sm text-[var(--bb-payne-gray)] space-y-1">
                  <p className="font-medium text-[var(--bb-black-bean)]">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                  <p>{order.shippingAddress.postalCode}</p>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="bg-white/60 rounded-lg p-4 border border-[var(--bb-mahogany)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-[var(--bb-mahogany)]" />
                  <h5 className="font-heading font-semibold text-[var(--bb-black-bean)]">
                    Payment & Status
                  </h5>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--bb-payne-gray)]">Payment Method:</span>
                    <span className="text-[var(--bb-black-bean)] font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--bb-payne-gray)]">Status:</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-[var(--bb-payne-gray)]">
                        {order.status === 'delivered' ? 'Delivered:' : 'Est. Delivery:'}
                      </span>
                      <span className="text-[var(--bb-black-bean)] font-medium">
                        {new Date(order.actualDelivery || order.estimatedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {order.cancellationReason && (
                    <div className="flex justify-between">
                      <span className="text-[var(--bb-payne-gray)]">Reason:</span>
                      <span className="text-red-600 font-medium">{order.cancellationReason}</span>
                    </div>
                  )}
                  {order.refundStatus && (
                    <div className="flex justify-between">
                      <span className="text-[var(--bb-payne-gray)]">Refund:</span>
                      <span className="text-green-600 font-medium capitalize">{order.refundStatus}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[var(--bb-mahogany)]/20">
              {canTrack && (
                <button className="flex items-center gap-2 bg-[var(--bb-mahogany)] text-white px-6 py-3 rounded-lg hover:bg-[var(--bb-mahogany)]/90 transition-colors">
                  <Truck className="w-4 h-4" />
                  Track Package
                </button>
              )}
              
              <button className="flex items-center gap-2 bg-white border-2 border-[var(--bb-mahogany)]/20 text-[var(--bb-mahogany)] px-6 py-3 rounded-lg hover:bg-[var(--bb-champagne)]/40 transition-colors">
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
              
              {order.status === 'delivered' && (
                <button className="flex items-center gap-2 bg-[var(--bb-citron)] text-[var(--bb-black-bean)] px-6 py-3 rounded-lg hover:bg-[var(--bb-citron)]/90 transition-colors">
                  <Star className="w-4 h-4" />
                  Write Review
                </button>
              )}

              {order.status === 'processing' && (
                <button className="flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-lg hover:bg-red-200 transition-colors">
                  <X className="w-4 h-4" />
                  Cancel Order
                </button>
              )}

              <button className="flex items-center gap-2 bg-[var(--bb-citron)]/20 text-[var(--bb-black-bean)] px-6 py-3 rounded-lg hover:bg-[var(--bb-citron)]/30 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Reorder Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistoryPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [orders, _setOrders] = useState<Order[]>(mockOrders);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingOrders, _setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      const result = await logout();
      if (result.success) {
        router.push('/');
      } else {
        console.error('Sign out failed:', result.error);
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const filteredOrders = orders
    .filter(order => filterStatus === 'all' || order.status === filterStatus)
    .filter(order => 
      searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const orderStats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    processing: orders.filter(o => o.status === 'processing').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--bb-champagne)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bb-mahogany)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bb-champagne)] to-[var(--bb-champagne)]/90">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--color-neutral-200)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--bb-mahogany)] to-[var(--bb-citron)] rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-[var(--color-neutral-900)] tracking-brand">
                BETTER BEING
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/account" className="text-[var(--color-neutral-600)] hover:text-[var(--bb-mahogany)] transition-colors">
                Account
              </Link>
              <Link href="/products" className="text-[var(--color-neutral-600)] hover:text-[var(--bb-mahogany)] transition-colors">
                Products
              </Link>
              <Link href="/cart" className="text-[var(--color-neutral-600)] hover:text-[var(--bb-mahogany)] transition-colors">
                Cart
              </Link>
              <button 
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[var(--bb-payne-gray)] hover:text-[var(--bb-mahogany)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-[var(--bb-black-bean)] mb-2">
                Order History
              </h1>
              <p className="text-[var(--bb-payne-gray)] text-lg">
                Track and manage your wellness orders
              </p>
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white/80 to-[var(--bb-champagne)]/40 border-2 border-[var(--bb-mahogany)]/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--bb-mahogany)] mb-1">
              {orderStats.total}
            </div>
            <div className="text-sm text-[var(--bb-payne-gray)]">Total Orders</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100/40 border-2 border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {orderStats.delivered}
            </div>
            <div className="text-sm text-green-600">Delivered</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 border-2 border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {orderStats.shipped}
            </div>
            <div className="text-sm text-blue-600">Shipped</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/40 border-2 border-orange-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-700 mb-1">
              {orderStats.processing}
            </div>
            <div className="text-sm text-orange-600">Processing</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100/40 border-2 border-red-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-700 mb-1">
              {orderStats.cancelled}
            </div>
            <div className="text-sm text-red-600">Cancelled</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-[var(--bb-mahogany)]/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[var(--bb-payne-gray)]" />
                <span className="font-medium text-[var(--bb-black-bean)]">Filter:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === status
                        ? 'bg-[var(--bb-mahogany)] text-white'
                        : 'bg-[var(--bb-champagne)]/60 text-[var(--bb-payne-gray)] hover:bg-[var(--bb-champagne)] hover:text-[var(--bb-black-bean)]'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {status !== 'all' && (
                      <span className="ml-2">
                        ({orderStats[status as keyof typeof orderStats]})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-[var(--bb-payne-gray)] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-80"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bb-mahogany)]"></div>
              <span className="ml-3 text-[var(--bb-payne-gray)]">Loading orders...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-[var(--bb-payne-gray)] mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-[var(--bb-black-bean)] mb-2">
                No orders found
              </h3>
              <p className="text-[var(--bb-payne-gray)] mb-6">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start your wellness journey today!'
                }
              </p>
              <Link 
                href="/products" 
                className="bg-[var(--bb-mahogany)] text-white px-8 py-3 rounded-lg hover:bg-[var(--bb-mahogany)]/90 transition-colors inline-flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                Browse Products
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expandedOrders.has(order.id)}
                onToggle={() => toggleOrderExpanded(order.id)}
              />
            ))
          )}
        </div>

        {/* Pagination - if needed */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-[var(--bb-payne-gray)]">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
}