import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-4">Better Being</h3>
            <p className="text-gray-300">
              Your trusted partner in wellness. Premium natural supplements, 
              superfoods, and wellness products.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-orange-500">All Products</Link></li>
              <li><Link href="/shop" className="text-gray-300 hover:text-orange-500">Shop</Link></li>
              <li><Link href="/products?category=supplements" className="text-gray-300 hover:text-orange-500">Supplements</Link></li>
              <li><Link href="/products?category=superfoods" className="text-gray-300 hover:text-orange-500">Superfoods</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-orange-500">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-orange-500">Contact</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500">Returns Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-gray-300 hover:text-orange-500">Login</Link></li>
              <li><Link href="/register" className="text-gray-300 hover:text-orange-500">Register</Link></li>
              <li><Link href="/account" className="text-gray-300 hover:text-orange-500">My Account</Link></li>
              <li><Link href="/cart" className="text-gray-300 hover:text-orange-500">Shopping Cart</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Better Being. All rights reserved. 
            Premium natural wellness products.
          </p>
        </div>
      </div>
    </footer>
  );
}