'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Check,
  AlertCircle,
  Truck,
  Lock
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface CheckoutForm {
  // Shipping Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  
  // Payment Information
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  
  // Order Options
  shippingMethod: 'standard' | 'express';
  billingAddressSame: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    state: { items: cartItems }, 
    getCartSubtotal, 
    getCartTax, 
    getCartShipping, 
    /* getCartTotal, */
    getCartCount,
    clearCart 
  } = useCart();

  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    shippingMethod: 'standard',
    billingAddressSame: true,
  });

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bb-champagne)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[var(--bb-mahogany)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--bb-mahogany)] mb-4">Cart is Empty</h1>
          <p className="text-[var(--bb-payne-gray)] mb-6">Add some items to your cart before checkout.</p>
          <Link 
            href="/products"
            className="btn btn-primary rounded-lg"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const validateStep = (step: string): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 'shipping') {
      if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!form.email.trim()) newErrors.email = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!form.address.trim()) newErrors.address = 'Address is required';
      if (!form.city.trim()) newErrors.city = 'City is required';
      if (!form.province.trim()) newErrors.province = 'Province is required';
      if (!form.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    }
    
    if (step === 'payment') {
      if (!form.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!form.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!form.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!form.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'shipping' && validateStep('shipping')) {
      setCurrentStep('payment');
    } else if (currentStep === 'payment' && validateStep('payment')) {
      setCurrentStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep('payment')) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      router.push('/checkout/success');
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Compute order summary with dynamic shipping method
  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const baseShipping = getCartShipping();
  const shipping = baseShipping + (form.shippingMethod === 'express' ? 75 : 0);
  const total = subtotal + tax + shipping;
  const itemCount = getCartCount();

  // Mobile CTA wiring
  const mobileCtaLabel = currentStep === 'shipping'
    ? 'Continue to Payment'
    : currentStep === 'payment'
      ? 'Review Order'
      : `Place Order - R${total.toFixed(2)}`;
  const mobileCtaAction = () => {
    if (currentStep === 'shipping') return handleNextStep();
    if (currentStep === 'payment') return handleNextStep();
    return handlePlaceOrder();
  };

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-[var(--bb-champagne)] py-8 pb-28 md:pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/cart"
            className="flex items-center gap-2 text-[var(--bb-mahogany)] hover:text-[var(--bb-mahogany)]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
          
          <div className="flex items-center gap-8">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const StepIcon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive ? 'bg-[var(--bb-mahogany)] border-[var(--bb-mahogany)] text-white' : 
                    isCompleted ? 'bg-[var(--bb-citron)] border-[var(--bb-citron)] text-[var(--bb-black-bean)]' :
                    'bg-white border-[var(--bb-payne-gray)]/40 text-[var(--bb-payne-gray)]'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`font-medium ${
                    isActive ? 'text-[var(--bb-mahogany)]' : 
                    isCompleted ? 'text-[var(--bb-citron)]' : 
                    'text-[var(--bb-payne-gray)]'
                  }`}>
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-px ml-3 ${
                      isCompleted ? 'bg-[var(--bb-citron)]' : 'bg-[var(--bb-payne-gray)]/40'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile summary strip */}
        <div className="md:hidden mb-4 text-sm text-[var(--bb-black-bean)] flex items-center justify-between">
          <span>
            Subtotal R{subtotal.toFixed(2)} • Shipping {shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`}
          </span>
          <span className="font-semibold">Total R{total.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Shipping Information */}
              {currentStep === 'shipping' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="w-6 h-6 text-[var(--bb-mahogany)]" />
                    <h2 className="text-xl font-bold text-[var(--bb-black-bean)]">Shipping Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.firstName ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.lastName ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.email ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.phone ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                          placeholder="+27 71 234 5678"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                          errors.address ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                        }`}
                        placeholder="Enter your street address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.city ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          Province *
                        </label>
                        <select
                          value={form.province}
                          onChange={(e) => handleInputChange('province', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.province ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                        >
                          <option value="">Select Province</option>
                          <option value="Western Cape">Western Cape</option>
                          <option value="Eastern Cape">Eastern Cape</option>
                          <option value="Northern Cape">Northern Cape</option>
                          <option value="Free State">Free State</option>
                          <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                          <option value="North West">North West</option>
                          <option value="Gauteng">Gauteng</option>
                          <option value="Mpumalanga">Mpumalanga</option>
                          <option value="Limpopo">Limpopo</option>
                        </select>
                        {errors.province && (
                          <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          value={form.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.postalCode ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                          placeholder="Postal Code"
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Method */}
                  <div className="space-y-3">
                    <h3 className="text-md font-semibold text-gray-900">Shipping Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${form.shippingMethod === 'standard' ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}`}>
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={form.shippingMethod === 'standard'}
                          onChange={() => setForm(prev => ({ ...prev, shippingMethod: 'standard' }))}
                        />
                        <span className="text-sm text-gray-800">Standard (2-3 days)</span>
                      </label>
                      <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${form.shippingMethod === 'express' ? 'border-[var(--bb-mahogany)] bg-[var(--bb-champagne)]/60' : 'border-gray-300 bg-white'}`}>
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={form.shippingMethod === 'express'}
                          onChange={() => setForm(prev => ({ ...prev, shippingMethod: 'express' }))}
                        />
                        <span className="text-sm text-gray-800">Express (1-2 days) + R75</span>
                      </label>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.billingAddressSame}
                        onChange={(e) => setForm(prev => ({ ...prev, billingAddressSame: e.target.checked }))}
                      />
                      <span className="text-sm text-gray-700">Billing address is the same as shipping</span>
                    </label>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleNextStep}
                      className="bg-[var(--bb-mahogany)] text-white px-6 py-3 rounded-lg hover:bg-[var(--bb-mahogany)]/90 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              {currentStep === 'payment' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-[var(--bb-mahogany)]" />
                    <h2 className="text-xl font-bold text-[var(--bb-black-bean)]">Payment Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={form.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                          errors.cardNumber ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                        }`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={form.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.expiryDate ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={form.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                            errors.cvv ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                          }`}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--bb-black-bean)] mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={form.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--bb-mahogany)] ${
                          errors.cardholderName ? 'border-red-500' : 'border-[var(--bb-payne-gray)]/40'
                        }`}
                        placeholder="Name as it appears on card"
                      />
                      {errors.cardholderName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-black-bean)] transition-colors"
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="bg-[var(--bb-mahogany)] text-white px-6 py-3 rounded-lg hover:bg-[var(--bb-mahogany)]/90 transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Order Review */}
              {currentStep === 'review' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Check className="w-6 h-6 text-[var(--bb-mahogany)]" />
                    <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Order Items ({itemCount})</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-3 border-b border-[var(--bb-payne-gray)]/30">
                            <div className="flex-1">
                              <h4 className="font-medium text-[var(--bb-black-bean)]">{item.product_name}</h4>
                              <p className="text-[var(--bb-payne-gray)] text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-[var(--bb-black-bean)]">R{(parseFloat(item.product_price) * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
                      <div className="bg-[var(--bb-champagne)]/40 p-4 rounded-lg border border-[var(--bb-mahogany)]/20">
                        <p className="font-medium text-[var(--bb-black-bean)]">{form.firstName} {form.lastName}</p>
                        <p className="text-[var(--bb-black-bean)]">{form.address}</p>
                        <p className="text-[var(--bb-black-bean)]">{form.city}, {form.province} {form.postalCode}</p>
                        <p className="text-[var(--bb-black-bean)]">{form.country}</p>
                        <p className="text-[var(--bb-payne-gray)] mt-2">{form.email}</p>
                        <p className="text-[var(--bb-payne-gray)]">{form.phone}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                      <div className="bg-[var(--bb-champagne)]/40 p-4 rounded-lg border border-[var(--bb-mahogany)]/20">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[var(--bb-payne-gray)]" />
                          <p className="text-[var(--bb-black-bean)]">Card ending in {form.cardNumber.slice(-4)}</p>
                        </div>
                        <p className="text-[var(--bb-payne-gray)]">{form.cardholderName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="text-[var(--bb-payne-gray)] hover:text-[var(--bb-black-bean)] transition-colors"
                    >
                      Back to Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-[var(--bb-mahogany)] text-white px-8 py-3 rounded-lg hover:bg-[var(--bb-mahogany)]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/80 border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Place Order - R{total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (15%)</span>
                  <span>R{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[var(--bb-mahogany)]">R{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure SSL checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>2-3 day delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--bb-mahogany)]/20 bg-[var(--bb-black-bean)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-sm">Total <span className="font-bold">R{total.toFixed(2)}</span></div>
          <button onClick={mobileCtaAction} className="px-4 py-2 rounded-lg bg-[var(--bb-mahogany)] hover:bg-[var(--bb-mahogany)]/90 text-white text-sm font-semibold">
            {mobileCtaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
