"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type TrustBadgesVariant = "light" | "dark";

export interface TrustBadgesProps {
  variant?: TrustBadgesVariant;
  className?: string;
  items?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const defaultItems = [
  { icon: <span>✓</span>, title: "100% Natural", description: "Pure ingredients" },
  { icon: <span>★</span>, title: "5-Star Rating", description: "1000+ reviews" },
  { icon: <span>⚡</span>, title: "Fast Shipping", description: "Next day delivery" },
  { icon: <span>🌱</span>, title: "Made in SA", description: "Locally sourced" },
];

export default function TrustBadges({ variant = "light", className, items = defaultItems }: TrustBadgesProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "grid grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
      aria-label="trust-badges"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "rounded-xl p-4 transition-all duration-300",
            "border",
            isDark
              ? "bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10"
              : "bg-white border-[var(--bb-mahogany)]/10 hover:bg-[var(--bb-champagne)]/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "text-2xl",
              isDark ? "text-[var(--bb-citron)]" : "text-[var(--bb-mahogany)]"
            )}>
              {item.icon}
            </div>
            <div>
              <div
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  isDark ? "text-white/90" : "text-[var(--bb-black-bean)]"
                )}
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                {item.title}
              </div>
              <div className={cn(
                "text-xs mt-0.5",
                isDark ? "text-white/70" : "text-[var(--bb-payne-gray)]"
              )}>
                {item.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
