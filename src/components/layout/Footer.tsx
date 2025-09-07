export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-neutral-200)] bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-sm font-heading font-semibold text-[var(--color-neutral-900)] mb-3 tracking-brand">Better Being</h3>
          <p className="text-sm text-[var(--color-neutral-600)]">
            Premium, creator-led beauty & wellness for South Africa. Editorial storytelling meets frictionless commerce.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-[var(--color-neutral-700)]">
            <li><a href="/products" className="hover:text-[var(--bb-mahogany)]">All Products</a></li>
            <li><a href="/wishlist" className="hover:text-[var(--bb-mahogany)]">Wishlist</a></li>
            <li><a href="/help" className="hover:text-[var(--bb-mahogany)]">Help & FAQs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-[var(--color-neutral-700)]">
            <li><a href="/about" className="hover:text-[var(--bb-mahogany)]">About</a></li>
            <li><a href="/contact" className="hover:text-[var(--bb-mahogany)]">Contact</a></li>
            <li><a href="/policies" className="hover:text-[var(--bb-mahogany)]">Policies</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-3">Newsletter</h4>
          <p className="text-sm text-[var(--color-neutral-600)] mb-3">Join for editorials, product stories, and offers.</p>
          <form className="flex gap-2">
            <input type="email" aria-label="Email" placeholder="you@example.com" className="input flex-1" />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-[var(--color-neutral-200)]">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-[var(--color-neutral-600)] flex items-center justify-between">
          <span>© {new Date().getFullYear()} Better Being — All rights reserved.</span>
          <span>Made with care in South Africa</span>
        </div>
      </div>
    </footer>
  );
}

