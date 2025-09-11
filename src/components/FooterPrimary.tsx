import React from "react";
import {
  Leaf,
  Mail,
  Send,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FooterPrimary = () => {
  return (
    <footer className="relative overflow-hidden bg-[#4a4a4a]">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1024' height='576' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23555555'/%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Texture Overlay to match the image */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(85, 85, 85, 0.9) 0%, rgba(74, 74, 74, 0.95) 50%, rgba(68, 68, 68, 0.9) 100%),
            radial-gradient(circle at 30% 40%, rgba(90, 90, 90, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, rgba(80, 80, 80, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* Better Being Logo positioned like in the image */}
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <div className="flex items-center gap-3 opacity-60">
          {/* Logo Circle */}
          <div className="w-12 h-12 rounded-full border-2 border-[#CD853F] flex items-center justify-center bg-transparent">
            <span className="text-[#CD853F] font-bold text-lg">BB</span>
          </div>
          {/* Better Being Text */}
          <div className="text-[#CD853F] font-bold text-xl tracking-wide">
            Better Being
          </div>
        </div>
      </div>

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-multiply"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.03) 1px,
              rgba(0, 0, 0, 0.03) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.03) 1px,
              rgba(0, 0, 0, 0.03) 2px
            )
          `,
        }}
      />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#e5c287] rounded-full blur-3xl animate-gentle-float"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-[#d4b8a1] rounded-full blur-3xl animate-gentle-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#f0e9d2] rounded-full blur-2xl animate-gentle-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-r from-[#3a3a3a]/80 to-[#2f2f2f]/80 border-b border-[#CD853F]/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-[#CD853F]/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 text-[#F5DEB3]" />
              <span className="text-[#F5DEB3] font-semibold text-sm uppercase tracking-wider">
                Join Our Wellness Community
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-heading">
              Stay Connected to Your
              <span className="block text-[#F5DEB3]">Wellness Journey</span>
            </h3>

            <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed font-body">
              Get exclusive wellness tips, early access to new products, and
              special offers delivered straight to your inbox. Join thousands on
              their path to better being.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F5DEB3]/60 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10 pr-3 py-2 bg-[#2a2a2a]/90 backdrop-blur-sm border border-[#CD853F]/30 focus:border-[#F5DEB3] text-white placeholder-[#F5DEB3]/60 rounded-lg text-sm font-body shadow-gentle focus:shadow-warm transition-all duration-300"
                />
              </div>
              <Button className="bg-[#CD853F] hover:bg-[#B8860B] text-white px-5 py-3 rounded-lg font-bold uppercase tracking-wide shadow-soft hover:shadow-warm transition-all duration-300 group">
                Subscribe
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            <p className="text-[#F5DEB3]/70 text-xs mt-2">
              ✨ No spam, just wellness. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content - links removed per request */}
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-center py-8">
          <div className="text-center text-white/80">
            {/* Minimal brand mark only */}
            <div className="inline-flex items-center gap-3 opacity-80">
              <div className="w-10 h-10 bg-gradient-to-br from-[#CD853F] to-[#B8860B] rounded-xl flex items-center justify-center shadow-soft">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold font-heading">Better Being</div>
                <div className="text-[#F5DEB3] text-xs font-body -mt-1">Natural Wellness</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative border-t border-[#CD853F]/20 bg-[#2a2a2a]/90 backdrop-blur-sm overflow-hidden">
        {/* Subtle dark texture */}
        <div
          className="absolute inset-0 opacity-[0.20]"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(205, 133, 63, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(245, 222, 179, 0.1) 0%, transparent 40%)
            `,
          }}
        />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-white/90 font-body text-lg">
              Copyright © Better Being 2024. All rights reserved.
            </p>
            <p className="text-[#F5DEB3] font-semibold">
              Crafted with ❤️ for Natural Wellness
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPrimary;
export { FooterPrimary };
