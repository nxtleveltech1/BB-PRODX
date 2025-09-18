export default function LocatorPage() {
  return (
    <main className="min-h-screen bg-[#F9E7C9]">
      <section className="space-section">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-light text-[#2C2B29] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Find your closest outlet
          </h1>
          <p className="text-[#7A7771] mb-8">Browse our growing list of stockists. This list will be grouped alphabetically by region once data is provided.</p>

          {/* Placeholder grouped list */}
          <div className="bg-white/70 border border-[#E8E2DC] rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-[#2C2B29] mb-4">A</h2>
            <ul className="space-y-2 text-[#2C2B29]">
              <li>• Awaiting store data…</li>
            </ul>
          </div>

          <div className="mt-6">
            <a href="/" className="btn btn-primary" style={{ backgroundColor: '#BB4500', borderColor: '#BB4500' }}>
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
