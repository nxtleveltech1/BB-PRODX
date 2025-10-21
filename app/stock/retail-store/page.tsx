import { useState } from 'react'

export default function RetailStorePage() {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/portal-applications/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || 'Submit failed')
      setDone(true)
      form.reset()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Hero Section */}
      <section className="relative min-h-[var(--hero-min-h-tablet)] bg-[var(--bb-hero-surround)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/Platform Graphics/outlet hero banner.png" alt="Retail Store hero" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
        <div className="relative z-20 w-full px-6 max-w-7xl mx-auto">
          <div className="min-h-[var(--hero-min-h-tablet)] flex flex-col items-center justify-center text-center py-24">
            <h1 className="u-hero-title text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6">RETAIL STORE</h1>
            <p className="text-subhero text-white/90">Application Form</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F9E7C9]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-[var(--bb-mahogany)]/10">
            <h2 className="text-2xl md:text-3xl font-light text-[var(--bb-black-bean)] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Store Registration
            </h2>

            {done && <div className="mb-6 rounded-lg border border-green-300 bg-green-50 text-green-700 p-4">Thanks! Your application has been submitted.</div>}
            {error && <div className="mb-6 rounded-lg border border-red-300 bg-red-50 text-red-700 p-4">{error}</div>}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Store Name</label>
                  <input name="storeName" className="input w-full" required />
                </div>
                <div>
                  <label className="label">Contact Person (Name & Surname)</label>
                  <input name="contactPerson" className="input w-full" required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Cellphone Number</label>
                  <input name="cellphone" className="input w-full" required />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" name="email" className="input w-full" required />
                </div>
              </div>

              <div>
                <label className="label">Full Address</label>
                <textarea name="address" className="input w-full h-28" required />
              </div>

              <div>
                <label className="label">How many products will your store be stocking at a time?</label>
                <input name="stockingCount" className="input w-full" />
              </div>

              <div>
                <label className="label">Can your store commit to the minimum of 10 products per order?</label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2"><input type="radio" name="minCommit" value="Yes" required /> Yes</label>
                  <label className="flex items-center gap-2"><input type="radio" name="minCommit" value="No" /> No</label>
                </div>
              </div>

              <div>
                <label className="label">Which products are of interest to your store?</label>
                <textarea name="interestedProducts" className="input w-full h-24" />
              </div>

              <div>
                <label className="label">How much shelf space do you plan to dedicate to Better Being products?</label>
                <textarea name="shelfSpace" className="input w-full h-20" />
              </div>

              <div>
                <label className="label">Type of Store (e.g., Wellness store)</label>
                <input name="storeType" className="input w-full" />
              </div>

              <div>
                <label className="label">Do you have any product specific questions?</label>
                <textarea name="questions" className="input w-full h-24" />
              </div>

              <div className="flex gap-4 justify-end pt-2">
                <a href="/portal-access" className="btn btn-outline">Back</a>
                <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Application'}</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
