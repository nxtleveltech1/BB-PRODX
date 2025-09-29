"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { LocatorLocation } from "./LeafletMap";

const DynamicLeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

type TypeFilter = "all" | "retail" | "distributor";

type GeoPoint = [number, number];

function haversineKm(a: GeoPoint, b: GeoPoint) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
  return R * c;
}

type StoreLocatorProps = {
  compact?: boolean;
  initialCenter?: GeoPoint;
  initialRadius?: number;
  initialType?: TypeFilter;
  initialHighlightId?: string | null;
  initialQuery?: string;
};

export default function StoreLocator({
  compact = false,
  initialCenter,
  initialRadius,
  initialType,
  initialHighlightId,
  initialQuery,
}: StoreLocatorProps) {
  const [locations, setLocations] = useState<LocatorLocation[]>([]);
  const [query, setQuery] = useState(initialQuery ?? "");
  const [radiusKm, setRadiusKm] = useState<number>(initialRadius ?? 50);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(initialType ?? "all");
  const [center, setCenter] = useState<GeoPoint>(initialCenter ?? [-33.9249, 18.4241]); // Default: Cape Town
  const [highlightId, setHighlightId] = useState<string | null>(initialHighlightId ?? null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/locations.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load locations: ${res.status}`);
        const data = (await res.json()) as LocatorLocation[];
        setLocations(data);
      } catch (e: any) {
        console.error(e);
        setError("Unable to load locations data.");
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const byType = typeFilter === "all" ? locations : locations.filter((l) => l.type === typeFilter);
    return byType
      .map((l) => {
        const d = haversineKm(center, [l.coordinates.lat, l.coordinates.lng]);
        return { ...l, distanceKm: d } as LocatorLocation & { distanceKm: number };
      })
      .filter((l) => l.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [locations, typeFilter, center, radiusKm]);

  const geocode = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setLoadingGeo(true);
    setError(null);
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("format", "json");
      url.searchParams.set("q", text);
      url.searchParams.set("limit", "1");
      const res = await fetch(url.toString(), {
        headers: {
          "Accept-Language": "en",
        },
      });
      if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
      const data = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (data.length) {
        const { lat, lon } = data[0];
        const point: GeoPoint = [parseFloat(lat), parseFloat(lon)];
        setCenter(point);
      } else {
        setError("No results found for that search.");
      }
    } catch (e: any) {
      console.error(e);
      setError("Could not complete the search. Please try again.");
    } finally {
      setLoadingGeo(false);
    }
  }, []);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingGeo(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: GeoPoint = [pos.coords.latitude, pos.coords.longitude];
        setCenter(p);
        setLoadingGeo(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to fetch your location.");
        setLoadingGeo(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <div className="space-section">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl lg:text-5xl font-light text-[#2C2B29] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Find your closest outlet
        </h1>
        <p className="text-[#7A7771] mb-6">Search by area, use your current location{compact ? '' : ', then filter by distance and type'}.</p>

        <div className={`grid grid-cols-1 ${compact ? '' : 'lg:grid-cols-12'} gap-6`}>
          {/* Controls + Results */}
          <div className={`col-span-1 ${compact ? 'lg:col-span-12' : 'lg:col-span-5'}`}>
            <div className="card rounded-2xl border border-[#E8E2DC] bg-white/80 shadow-md p-4 sm:p-6">
              <div className="flex gap-2 mb-3">
                <input
                  className="input flex-1"
                  placeholder="Search an area or address..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') geocode(query); }}
                />
                <button className="btn btn-primary" onClick={() => geocode(query)} disabled={loadingGeo}>
                  {loadingGeo ? "Searching..." : "Search"}
                </button>
              </div>
              <div className="flex gap-2 mb-4">
                <button className="btn btn-secondary" onClick={useMyLocation} disabled={loadingGeo}>
                  Use my location
                </button>
                {compact && (
                  <Link href="/outlets" className="btn btn-outline">Open full map</Link>
                )}
              </div>

              {!compact && (
                <div className="mb-4">
                  <label className="text-sm text-[#7A7771]">Radius: {radiusKm} km</label>
                  <input
                    type="range"
                    min={5}
                    max={500}
                    step={5}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                </div>
              )}

              {!compact && (
                <div className="mb-4">
                  <label className="text-sm text-[#7A7771]">Type</label>
                  <select className="input w-full" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}>
                    <option value="all">All</option>
                    <option value="retail">Retail stores</option>
                    <option value="distributor">Distribution points</option>
                  </select>
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm mb-2">{error}</div>
              )}

              <div className="border-t border-[#E8E2DC] pt-3 max-h-[58vh] overflow-auto">
                {filtered.length === 0 ? (
                  <div className="text-[#7A7771]">No locations found within {radiusKm} km.</div>
                ) : (
                  <ul className="space-y-3">
                    {filtered.map((l) => (
                      <li key={l.id} className="p-3 rounded-lg border border-[#E8E2DC] bg-white/80">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-semibold text-[#2C2B29]">{l.name}</div>
                            <div className="text-xs uppercase tracking-wide text-[#7A7771] mb-1">
                              {l.type === 'distributor' ? 'Distribution point' : 'Retail store'}
                            </div>
                          </div>
                          <div className="text-sm text-[#7A7771] whitespace-nowrap">{(l as any).distanceKm.toFixed(1)} km</div>
                        </div>
                        <div className="text-sm mt-1">{l.address}</div>
                        {l.vendor && <div className="text-sm"><span className="font-medium">Vendor:</span> {l.vendor}</div>}
                        {l.agent && <div className="text-sm"><span className="font-medium">Agent:</span> {l.agent}</div>}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {l.phone && (
                            <a className="btn btn-outline" href={`tel:${l.phone}`}>Call</a>
                          )}
                          {l.website && (
                            <a className="btn btn-outline" href={l.website} target="_blank" rel="noopener noreferrer">Website</a>
                          )}
                          {compact ? (
                            <Link
                              className="btn btn-primary"
                              href={{
                                pathname: "/outlets",
                                query: {
                                  lat: String(l.coordinates.lat),
                                  lng: String(l.coordinates.lng),
                                  id: l.id,
                                  q: query || undefined,
                                  radius: String(radiusKm),
                                  type: typeFilter,
                                },
                              }}
                            >
                              View on map
                            </Link>
                          ) : (
                            <button className="btn btn-primary" onClick={() => { setCenter([l.coordinates.lat, l.coordinates.lng]); setHighlightId(l.id); }}>
                              View on map
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          {!compact && (
            <div className="lg:col-span-7 lg:sticky lg:top-24">
              <DynamicLeafletMap
                center={center}
                radiusKm={radiusKm}
                markers={filtered}
                highlightId={highlightId}
                onMarkerClick={(id) => setHighlightId(id)}
                height="65vh"
              />
              <div className="text-xs text-[#7A7771] mt-2">Map data © OpenStreetMap contributors</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
