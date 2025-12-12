interface GradientCardProps {
  icon: string;
  title: string;
  subtitle: string;
  ctaText: string;
  href: string;
}

export default function GradientCard({ icon, title, subtitle, ctaText, href }: GradientCardProps) {
  return (
    <div className="bg-gradient-to-br from-[var(--bb-black-bean)] to-[var(--bb-mahogany)] text-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-10 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
          <img
            src={icon}
            alt={`${title} icon`}
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-2xl font-semibold uppercase tracking-wide mb-4 text-white" style={{ fontFamily: 'League Spartan, sans-serif' }}>
          {title}
        </h2>
        <p className="text-white leading-relaxed mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          {subtitle}
        </p>
        <a
          href={href}
          className="inline-block bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-8 py-3 font-medium uppercase tracking-wider transition-all duration-300 rounded-lg"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}
