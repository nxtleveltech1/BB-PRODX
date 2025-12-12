"use client";

import { useSearchParams } from "next/navigation";
import StoreLocator from "@/components/locator/StoreLocator";

export default function OutletPage() {
  const sp = useSearchParams();
  const lat = Number.parseFloat(sp?.get("lat") ?? "");
  const lng = Number.parseFloat(sp?.get("lng") ?? "");
  const hasCenter = Number.isFinite(lat) && Number.isFinite(lng);
  const initialCenter = hasCenter
    ? ([lat, lng] as [number, number])
    : undefined;
  const radiusParam = Number.parseInt(sp?.get("radius") ?? "");
  const initialRadius = Number.isFinite(radiusParam) ? radiusParam : undefined;
  const t = sp?.get("type") ?? "";
  const initialType = t === "retail" || t === "distributor" ? t : "all";
  const initialHighlightId = sp?.get("id") ?? undefined;
  const initialQuery = sp?.get("q") || undefined;

  return (
    <div className="bg-[#F9E7C9] pt-24 md:pt-28">
      <StoreLocator
        compact={false}
        initialCenter={initialCenter}
        initialRadius={initialRadius}
        initialType={initialType}
        initialHighlightId={initialHighlightId}
        initialQuery={initialQuery}
        edgeToEdge
      />
    </div>
  );
}
