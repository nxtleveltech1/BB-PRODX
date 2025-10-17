'use client';

export const dynamic = 'force-dynamic';

import { useUser, useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import AuthGuard from '../components/AuthGuard';
import {
  User,
  Edit3,
  Save,
  X,
  Shield,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle,
  Truck
} from "lucide-react";

// Mock user data - updated to use Stack Auth user data
const mockUser = {
  id: 1,
  name: "Better Being User",
  email: "user@betterbeing.com",
  phone: "+27 71 234 5678",
  avatar: "/api/placeholder/200/200",
  joinDate: "2024-01-15",
  address: {
    street: "123 Wellness Street",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "8001",
    country: "South Africa"
  },
  preferences: {
    newsletter: true,
    marketing: false,
    notifications: true
  }
};

// Mock order history
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-03-15",
    status: "delivered",
    total: 239.97,
    items: [
      { name: "Organic Ashwagandha Capsules", quantity: 2, price: 89.99 },
      { name: "Turmeric Golden Milk Blend", quantity: 1, price: 34.99 }
    ]
  },
  {
    id: "ORD-002", 
    date: "2024-02-28",
    status: "processing",
    total: 149.99,
    items: [
      { name: "Himalayan Shilajit Resin", quantity: 1, price: 149.99 }
    ]
  }
];

function AccountSection({ title, icon: Icon, children }: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#8B4513] to-[#B5A642] rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-[var(--color-neutral-900)]">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    delivered: { color: "green", text: "Delivered", icon: CheckCircle },
    processing: { color: "blue", text: "Processing", icon: Package },
    shipped: { color: "orange", text: "Shipped", icon: Truck },
    cancelled: { color: "red", text: "Cancelled", icon: X }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}

function AccountPageContent() {
  const { user } = useUser();
  const { logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [originalUserData, setOriginalUserData] = useState(mockUser);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSignOut = async () => {
    try {
      await logout().catch(() => {});
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleSave = () => {
    // In a real app, you would save to a backend API here
    // For now, we'll just save the changes locally
    console.log('Saving user data:', userData);
    setOriginalUserData({...userData});
    setIsEditing(false);
    // You could add a success message here
  };

  const handleCancel = () => {
    // Reset to original data and exit edit mode
    setUserData({...originalUserData});
    setIsEditing(false);
  };

  const handleEdit = () => {
    // Save current data as backup before editing
    setOriginalUserData({...userData});
    setIsEditing(true);
  };


  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[var(--bb-champagne)]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--color-neutral-200)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--bb-mahogany)] to-[var(--bb-citron)] rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-[var(--color-neutral-900)] tracking-brand">
                BETTER BEING
              </span>
            </Link>

            <nav className="flex items-center gap-6">
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
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              {/* User Summary */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8B4513] to-[#B5A642] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-xl font-heading font-bold text-[var(--color-neutral-900)] mb-1">
                  {user?.name || user?.email || 'Guest User'}
                </h1>
                <p className="text-[var(--color-neutral-600)] text-sm">
                  {user?.email || 'No email available'}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === id
                        ? "bg-gradient-to-r from-[#8B4513] to-[#B5A642] text-white"
                        : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <AccountSection title="Profile Information" icon={User}>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          Member Since
                        </label>
                        <input
                          type="text"
                          value={new Date(userData.joinDate).toLocaleDateString()}
                          disabled
                          className="input w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={userData.address.street}
                          onChange={(e) => setUserData({...userData, address: {...userData.address, street: e.target.value}})}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={userData.address.city}
                          onChange={(e) => setUserData({...userData, address: {...userData.address, city: e.target.value}})}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          Province
                        </label>
                        <input
                          type="text"
                          value={userData.address.province}
                          onChange={(e) => setUserData({...userData, address: {...userData.address, province: e.target.value}})}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={userData.address.postalCode}
                          onChange={(e) => setUserData({...userData, address: {...userData.address, postalCode: e.target.value}})}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={userData.address.country}
                          onChange={(e) => setUserData({...userData, address: {...userData.address, country: e.target.value}})}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-[var(--color-neutral-200)]">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </AccountSection>
            )}

            {activeTab === "orders" && (
              <AccountSection title="Order History" icon={Package}>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border-2 border-[var(--color-neutral-200)] rounded-xl p-6 hover:border-[var(--bb-mahogany)]/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-[var(--color-neutral-900)]">
                            Order #{order.id}
                          </h3>
                          <p className="text-[var(--color-neutral-600)] text-sm">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <OrderStatusBadge status={order.status} />
                          <div className="text-lg font-bold text-[var(--bb-mahogany)] mt-1">
                            R{order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[var(--color-neutral-200)] pt-4">
                        <h4 className="font-medium text-[var(--color-neutral-700)] mb-2">
                          Items:
                        </h4>
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span className="text-[var(--color-neutral-600)]">
                                {item.quantity} × {item.name}
                              </span>
                              <span className="text-[var(--color-neutral-700)] font-medium">
                                R{item.price.toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-[var(--color-neutral-200)] pt-4 mt-4">
                        <button className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] text-sm font-medium transition-colors">
                          View Order Details
                        </button>
                      </div>
                    </div>
                  ))}

                  {mockOrders.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-[var(--color-neutral-400)] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-2">
                        No orders yet
                      </h3>
                      <p className="text-[var(--color-neutral-600)] mb-6">
                        Start your wellness journey with our premium products
                      </p>
                      <Link href="/products" className="btn-primary">
                        Browse Products
                      </Link>
                    </div>
                  )}
                </div>
              </AccountSection>
            )}

            {activeTab === "wishlist" && (
              <AccountSection title="Wishlist" icon={Heart}>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-[var(--color-neutral-400)] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-[var(--color-neutral-600)] mb-6">
                    Save your favorite products for later
                  </p>
                  <Link href="/products" className="btn-primary">
                    Start Shopping
                  </Link>
                </div>
              </AccountSection>
            )}

            {activeTab === "security" && (
              <AccountSection title="Security Settings" icon={Shield}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                      Password & Security
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-lg">
                        <div>
                          <h4 className="font-medium text-[var(--color-neutral-900)]">
                            Change Password
                          </h4>
                          <p className="text-[var(--color-neutral-600)] text-sm">
                            Update your account password
                          </p>
                        </div>
                        <button className="btn-secondary">
                          Change Password
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-lg">
                        <div>
                          <h4 className="font-medium text-[var(--color-neutral-900)]">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-[var(--color-neutral-600)] text-sm">
                            Add an extra layer of security
                          </p>
                        </div>
                        <button className="btn-secondary">
                          Enable 2FA
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-lg">
                        <div>
                          <h4 className="font-medium text-[var(--color-neutral-900)]">
                            Active Sessions
                          </h4>
                          <p className="text-[var(--color-neutral-600)] text-sm">
                            Manage your active login sessions
                          </p>
                        </div>
                        <button className="btn-secondary">
                          View Sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </AccountSection>
            )}

            {activeTab === "preferences" && (
              <AccountSection title="Preferences" icon={Settings}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                      Communication Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-lg">
                        <div>
                          <h4 className="font-medium text-[var(--color-neutral-900)]">
                            Email Newsletter
                          </h4>
                          <p className="text-[var(--color-neutral-600)] text-sm">
                            Receive product updates and wellness tips
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={userData.preferences.newsletter} />
                          <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--bb-mahogany)]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-lg">
                        <div>
                          <h4 className="font-medium text-[var(--color-neutral-900)]">
                            Marketing Communications
                          </h4>
                          <p className="text-[var(--color-neutral-600)] text-sm">
                            Receive promotional offers and discounts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={userData.preferences.marketing} />
                          <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--bb-mahogany)]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-lg">
                        <div>
                          <h4 className="font-medium text-[var(--color-neutral-700)] mb-2">
                            Push Notifications
                          </h4>
                          <p className="text-[var(--color-neutral-600)] text-sm">
                            Receive order updates and reminders
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={userData.preferences.notifications} />
                          <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--bb-mahogany)]"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--color-neutral-200)]">
                    <button className="btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </AccountSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AccountPageContent />
    </AuthGuard>
  );
}
