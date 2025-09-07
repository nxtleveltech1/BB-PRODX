"use client";

import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Desktop/Landscape Image */}
      <div className="hidden md:block w-full h-full relative">
        <Image
          src="/Landing Page/WhatsApp Image 2025-08-31 at 19.43.08.jpeg"
          alt="Better Being Landing - Desktop"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
      </div>
      
      {/* Mobile Image */}
      <div className="block md:hidden w-full h-full relative">
        <Image
          src="/Landing Page/WhatsApp Image 2025-08-31 at 19.47.52.jpeg"
          alt="Better Being Landing - Mobile"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
      </div>
    </div>
  );
}
