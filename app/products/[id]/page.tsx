'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Shield,
  Truck,
  Award,
  Clock,
  Package,
  Info,
  CheckCircle,
  AlertCircle,
  Leaf,
  Share2
} from "lucide-react";
import { useCart } from "../../../contexts/CartContext";
import { getProductById, getRelatedProducts } from "@/data/products";

// Mock product data - replace with actual API calls
const mockProducts = [
  {
    id: 1,
    name: "Organic Ashwagandha Capsules",
    description: "Premium organic ashwagandha for stress relief and energy balance. Sustainably sourced and lab-tested for purity.",
    longDescription: "Our premium Ashwagandha capsules are crafted from organically grown Withania somnifera root, harvested at peak potency from sustainable farms. Each capsule contains 500mg of pure ashwagandha extract, standardized to contain 5% withanolides - the active compounds responsible for ashwagandha's adaptogenic properties.\n\nAshwagandha has been used for over 3,000 years in Ayurvedic medicine to help the body manage stress, improve energy levels, and support overall vitality. Our rigorous extraction process preserves the full spectrum of beneficial compounds while ensuring maximum bioavailability.\n\nEach batch is third-party tested for purity, potency, and safety. Free from fillers, artificial colors, and preservatives.",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviewCount: 124,
    images: [
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600"
    ],
    category: "Adaptogens",
    tags: ["Organic", "Stress Relief", "Energy", "Vegan", "Third-Party Tested"],
    inStock: true,
    stockCount: 15,
    featured: true,
    benefits: [
      "Reduces stress and anxiety",
      "Supports healthy energy levels", 
      "Promotes restful sleep",
      "Enhances cognitive function",
      "Supports immune system"
    ],
    ingredients: [
      "Organic Ashwagandha Root Extract (500mg)",
      "Vegetarian Capsule (Hydroxypropyl Methylcellulose)",
      "Organic Rice Flour"
    ],
    usage: "Take 1-2 capsules daily with meals, or as directed by your healthcare practitioner. For optimal results, use consistently for 2-3 months.",
    warnings: [
      "Consult your healthcare provider before use if pregnant or nursing",
      "May cause drowsiness in some individuals",
      "Discontinue use if adverse reactions occur"
    ],
    certifications: ["Organic", "Non-GMO", "Vegan", "Gluten-Free"],
    servingsPerContainer: 60,
    relatedProducts: [2, 3, 4]
  },
  // Add more mock products as needed
];

interface ReviewProps {
  rating: number;
  author: string;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

function ReviewCard({ rating, author, date, title, content, verified }: ReviewProps) {
  return (
    <div className="bg-gradient-to-br from-bb-champagne/40 to-white/80 border-2 border-bb-mahogany/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'text-bb-citron fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          {verified && (
            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
              <CheckCircle className="w-3 h-3" />
              Verified Purchase
            </div>
          )}
        </div>
        <span className="text-sm text-bb-payne-gray">{date}</span>
      </div>
      <h4 className="font-heading font-semibold text-bb-black-bean mb-2">{title}</h4>
      <p className="text-bb-payne-gray text-sm mb-3">{content}</p>
      <p className="text-sm font-medium text-bb-mahogany">- {author}</p>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem, isItemInCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const idParam = params?.id;
  const productId = Number(idParam ?? NaN);

  const catalogProduct = Number.isNaN(productId) ? undefined : getProductById(productId);
  const normalized = (p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    longDescription: p.longDescription || p.description,
    price: typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : p.price,
    originalPrice: p.originalPrice ? (typeof p.originalPrice === 'string' ? parseFloat(p.originalPrice.replace(/[^0-9.]/g, '')) : p.originalPrice) : undefined,
    rating: p.rating || 0,
    reviewCount: p.reviews ?? p.reviewCount ?? 0,
    images: [p.image, ...(p.additionalImages || p.images || [])],
    category: p.categoryId || p.category || '',
    tags: p.tags || [],
    inStock: p.inStock !== false,
    stockCount: p.stockCount || 1,
    featured: !!p.featured,
    benefits: p.benefits || [],
    ingredients: p.ingredients || [],
    usage: p.usage || '',
    warnings: Array.isArray(p.warnings) ? p.warnings : (p.warnings ? [p.warnings] : []),
    certifications: p.certifications || [],
    servingsPerContainer: p.servingsPerContainer || 0,
  });

  const product = catalogProduct ? normalized(catalogProduct) : (Number.isNaN(productId) ? undefined : mockProducts.find(p => p.id === productId));

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bb-champagne to-bb-champagne/90 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-bb-payne-gray mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-bb-black-bean mb-4">Product Not Found</h1>
          <p className="text-bb-payne-gray mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/products"
            className="bg-bb-mahogany text-white px-6 py-3 rounded-lg hover:bg-bb-mahogany/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? 
    Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
  const isInCart = isItemInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    const cartItem = {
      id: Date.now(),
      product_id: product.id,
      quantity: quantity,
      product_name: product.name,
      product_description: product.description,
      product_image: product.images[0],
      product_price: product.price.toString(),
      product_original_price: product.originalPrice?.toString(),
      product_in_stock: product.inStock,
      product_stock_count: product.stockCount,
      category_name: product.category,
    };
    
    addItem(cartItem);
  };

  const reviews = [
    {
      rating: 5,
      author: "Sarah M.",
      date: "2 weeks ago",
      title: "Amazing stress relief!",
      content: "I've been using this ashwagandha for 2 months now and the difference in my stress levels is incredible. I sleep better and feel more balanced throughout the day.",
      verified: true
    },
    {
      rating: 4,
      author: "James K.",
      date: "1 month ago", 
      title: "High quality product",
      content: "Great quality and potency. I can feel the effects within the first week. Only giving 4 stars because the capsules are a bit large.",
      verified: true
    },
    {
      rating: 5,
      author: "Maria L.",
      date: "3 weeks ago",
      title: "Perfect for my wellness routine",
      content: "This fits perfectly into my daily wellness routine. No side effects and I love that it's organic and third-party tested.",
      verified: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bb-champagne to-bb-champagne/90">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-bb-mahogany/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-bb-payne-gray hover:text-bb-mahogany transition-colors">
              Home
            </Link>
            <span className="text-bb-payne-gray">/</span>
            <Link href="/products" className="text-bb-payne-gray hover:text-bb-mahogany transition-colors">
              Products
            </Link>
            <span className="text-bb-payne-gray">/</span>
            <span className="text-bb-mahogany font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-bb-payne-gray hover:text-bb-mahogany transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-[var(--bb-champagne)] border-2 border-bb-mahogany/20 rounded-xl overflow-hidden aspect-square">
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold z-10">
                  -{discountPercent}% OFF
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 right-4 bg-bb-citron text-bb-black-bean px-3 py-2 rounded-lg text-sm font-bold z-10">
                  Featured
                </div>
              )}
              
              <div className="w-full h-full flex items-center justify-center">
                {/* Replace placeholder with image if available */}
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain p-6"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <Package className="w-32 h-32 text-bb-mahogany" />
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br from-white/80 to-bb-champagne/40 border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'border-bb-mahogany shadow-lg' 
                      : 'border-bb-mahogany/20 hover:border-bb-mahogany/60'
                  }`}
                >
                  <div className="w-full h-full bg-[var(--bb-champagne)] flex items-center justify-center">
                    <img
                      src={product.images[index]}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-bb-citron/20 text-bb-payne-gray px-3 py-1 rounded-lg text-sm border border-bb-citron/30">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="bg-bb-mahogany/10 text-bb-mahogany px-3 py-1 rounded-lg text-sm border border-bb-mahogany/30">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-heading font-bold text-bb-black-bean mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-bb-citron fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-bb-payne-gray">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-bb-mahogany">
                  R{product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-2xl text-bb-payne-gray line-through">
                      R{product.originalPrice!.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm font-bold">
                      Save R{(product.originalPrice! - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="text-bb-payne-gray text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="bg-bb-champagne/60 text-bb-black-bean px-3 py-1 rounded-lg text-sm border border-bb-mahogany/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-gradient-to-r from-white/60 to-bb-champagne/40 backdrop-blur-sm border-2 border-bb-mahogany/20 rounded-xl p-6">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-bb-black-bean font-medium">Quantity:</span>
                <div className="flex items-center bg-white border-2 border-bb-mahogany/20 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-bb-payne-gray hover:text-bb-mahogany transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-lg font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                    className="w-10 h-10 flex items-center justify-center text-bb-payne-gray hover:text-bb-mahogany transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {cartQuantity > 0 && (
                  <span className="text-sm text-green-600">
                    {cartQuantity} in cart
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 rounded-lg font-heading font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                    product.inStock
                      ? 'bg-[var(--bb-black-bean)] hover:bg-[var(--bb-black-bean)]/90 text-white transform hover:scale-105 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {product.inStock ? (isInCart ? 'Update Cart' : 'Add to Cart') : 'Out of Stock'}
                </button>
                
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all ${
                    isWishlisted 
                      ? 'bg-red-100 text-red-600 border-2 border-red-200' 
                      : 'bg-white border-2 border-bb-mahogany/20 text-bb-payne-gray hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button className="w-16 h-16 bg-white border-2 border-bb-mahogany/20 text-bb-payne-gray hover:text-bb-mahogany rounded-lg flex items-center justify-center transition-all hover:bg-bb-champagne/40">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Stock Status */}
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">In Stock</span>
                  {product.stockCount < 10 && (
                    <span className="text-orange-600 ml-2">
                      Only {product.stockCount} left!
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl border border-bb-mahogany/20">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-bb-black-bean">Lab Tested</p>
                  <p className="text-sm text-bb-payne-gray">Third-party verified</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl border border-bb-mahogany/20">
                <Truck className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-bb-black-bean">Free Shipping</p>
                  <p className="text-sm text-bb-payne-gray">On orders over R500</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl border border-bb-mahogany/20">
                <Award className="w-6 h-6 text-bb-citron" />
                <div>
                  <p className="font-medium text-bb-black-bean">Premium Quality</p>
                  <p className="text-sm text-bb-payne-gray">Ethically sourced</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl border border-bb-mahogany/20">
                <Clock className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-bb-black-bean">2-3 Day Delivery</p>
                  <p className="text-sm text-bb-payne-gray">Fast & reliable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white/60 backdrop-blur-sm border-2 border-bb-mahogany/20 rounded-xl overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-bb-mahogany/20">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-8 py-4 font-heading font-semibold transition-all ${
                  activeTab === 'description' 
                    ? 'bg-bb-mahogany text-white border-b-2 border-bb-mahogany' 
                    : 'text-bb-payne-gray hover:text-bb-mahogany hover:bg-bb-champagne/40'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`px-8 py-4 font-heading font-semibold transition-all ${
                  activeTab === 'ingredients' 
                    ? 'bg-bb-mahogany text-white border-b-2 border-bb-mahogany' 
                    : 'text-bb-payne-gray hover:text-bb-mahogany hover:bg-bb-champagne/40'
                }`}
              >
                Ingredients & Usage
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-8 py-4 font-heading font-semibold transition-all ${
                  activeTab === 'reviews' 
                    ? 'bg-bb-mahogany text-white border-b-2 border-bb-mahogany' 
                    : 'text-bb-payne-gray hover:text-bb-mahogany hover:bg-bb-champagne/40'
                }`}
              >
                Reviews ({product.reviewCount})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-bb-payne-gray text-lg leading-relaxed whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-bb-black-bean mb-4">
                      Key Benefits
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {product.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-bb-black-bean">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-bb-black-bean mb-4">
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.certifications.map((cert: string) => (
                        <div key={cert} className="flex items-center gap-2 bg-bb-citron/20 text-bb-black-bean px-4 py-2 rounded-lg border border-bb-citron/30">
                          <Award className="w-4 h-4" />
                          <span className="font-medium">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-8">
                  {/* Ingredients */}
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-bb-black-bean mb-4">
                      Ingredients
                    </h3>
                    <div className="bg-bb-champagne/40 rounded-lg p-6 border-2 border-bb-mahogany/20">
                      <ul className="space-y-3">
                        {product.ingredients.map((ingredient: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-bb-black-bean">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Usage */}
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-bb-black-bean mb-4">
                      How to Use
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                      <div className="flex gap-4">
                        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-bb-black-bean mb-2 font-medium">Recommended Usage:</p>
                          <p className="text-bb-payne-gray">{product.usage}</p>
                          <p className="text-sm text-bb-payne-gray mt-3">
                            <strong>Servings per container:</strong> {product.servingsPerContainer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-bb-black-bean mb-4">
                      Important Information
                    </h3>
                    <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                      <ul className="space-y-2">
                        {product.warnings.map((warning: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-bb-black-bean text-sm">{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews Summary */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl font-bold text-bb-mahogany">{product.rating}</span>
                        <div>
                          <div className="flex items-center mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-bb-citron fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-bb-payne-gray">Based on {product.reviewCount} reviews</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[5,4,3,2,1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm text-bb-payne-gray w-8">{stars}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-bb-citron h-2 rounded-full" 
                              style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }}
                            />
                          </div>
                          <span className="text-sm text-bb-payne-gray w-8">{stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <ReviewCard key={index} {...review} />
                    ))}
                  </div>

                  {/* Load More Reviews */}
                  <div className="text-center pt-6">
                    <button className="bg-bb-mahogany text-white px-8 py-3 rounded-lg hover:bg-bb-mahogany/90 transition-colors">
                      Load More Reviews
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-heading font-bold text-bb-black-bean mb-8">You Might Also Like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {getRelatedProducts(product.id, 3).map((rp) => {
              const rpImages = [rp.image, ...(rp.additionalImages || [])];
              const rpPrice = typeof rp.price === 'string' ? rp.price : `R${rp.price}`;
              return (
                <Link
                  key={rp.id}
                  href={`/products/${rp.id}`}
                  className="group bg-[var(--bb-champagne)] border-2 border-bb-mahogany/20 hover:border-bb-mahogany/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-bb-mahogany/10 hover:scale-105"
                >
                  <div className="h-48 bg-[var(--bb-champagne)] flex items-center justify-center">
                    {rpImages.length > 0 ? (
                      <img src={rpImages[0]} alt={rp.name} className="w-full h-full object-contain p-4" />
                    ) : (
                      <Package className="w-16 h-16 text-bb-mahogany" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-semibold uppercase tracking-wide text-bb-black-bean mb-2 group-hover:text-bb-mahogany transition-colors" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                      {rp.name}
                    </h3>
                    <p className="text-bb-payne-gray text-sm mb-3 line-clamp-2">
                      {rp.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-bb-mahogany">
                        {rpPrice}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-bb-citron fill-current" />
                        <span className="text-sm text-bb-payne-gray ml-1">
                          {rp.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-bb-mahogany/20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 p-4 lg:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-bb-mahogany">R{product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-bb-payne-gray line-through">R{product.originalPrice!.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-[var(--bb-black-bean)] text-white px-5 py-3 rounded-lg font-heading font-semibold disabled:opacity-50"
          >
            {product.inStock ? (isInCart ? 'Update Cart' : 'Add to Cart') : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
