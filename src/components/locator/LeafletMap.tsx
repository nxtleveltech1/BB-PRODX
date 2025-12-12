"use client";

import { useEffect, useMemo, useRef } from "react";
import L, { LatLngExpression } from "leaflet";

export type LocatorLocation = {
  id: string;
  type: "retail" | "distributor";
  name: string;
  address: string;
  phone?: string;
  website?: string;
  vendor?: string;
  agent?: string;
  coordinates: { lat: number; lng: number };
};

export interface LeafletMapProps {
  center: [number, number];
  radiusKm?: number;
  markers: LocatorLocation[];
  highlightId?: string | null;
  onMarkerClick?: (id: string) => void;
  height?: number | string;
  className?: string;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LeafletMap({ center, radiusKm = 50, markers, highlightId: _highlightId, onMarkerClick, height, className }: LeafletMapProps) {
  const centerLatLng = useMemo(() => ({ lat: center[0], lng: center[1] }), [center]);
  const containerHeight = typeof height === "number" ? `${height}px` : height || "500px";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Init map once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (mapRef.current) return;

    // Critical: if React/Next fast-refresh/strict mode reused this DOM node, clear Leaflet's guard.
    if ((container as any)._leaflet_id) {
      try {
        delete (container as any)._leaflet_id;
      } catch {
        // ignore
      }
    }

    const map = L.map(container, {
      scrollWheelZoom: true,
    }).setView(centerLatLng as unknown as LatLngExpression, 7);

    tileLayerRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Ensure sizing is correct after first paint
    queueMicrotask(() => {
      try {
        map.invalidateSize();
      } catch {
        // ignore
      }
    });

    return () => {
      try {
        map.remove();
      } catch {
        // ignore
      }
      mapRef.current = null;
      markersLayerRef.current = null;
      circleRef.current = null;
      tileLayerRef.current = null;

      // Also clear Leaflet's container ID so the same node can be reused safely.
      if ((container as any)._leaflet_id) {
        try {
          delete (container as any)._leaflet_id;
        } catch {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep view in sync
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView(centerLatLng as unknown as LatLngExpression, Math.max(map.getZoom(), 6), {
      animate: true,
    });
  }, [centerLatLng]);

  // Keep radius circle in sync
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (radiusKm > 0) {
      if (!circleRef.current) {
        circleRef.current = L.circle(centerLatLng as unknown as LatLngExpression, {
          radius: radiusKm * 1000,
          color: "#BB4500",
          fillColor: "#BB4500",
          fillOpacity: 0.08,
        }).addTo(map);
      } else {
        circleRef.current.setLatLng(centerLatLng as unknown as LatLngExpression);
        circleRef.current.setRadius(radiusKm * 1000);
      }
    } else if (circleRef.current) {
      try {
        circleRef.current.remove();
      } catch {
        // ignore
      }
      circleRef.current = null;
    }
  }, [centerLatLng, radiusKm]);

  // Keep markers in sync
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    for (const m of markers) {
      const lat = m.coordinates?.lat ?? centerLatLng.lat;
      const lng = m.coordinates?.lng ?? centerLatLng.lng;

      const marker = L.marker([lat, lng] as unknown as LatLngExpression, { icon: markerIcon });

      const html = `
        <div style="min-width: 200px">
          <div style="font-weight: 700; margin-bottom: 4px">${m.name}</div>
          <div style="font-size: 12px; opacity: 0.8; margin-bottom: 6px">
            ${m.type === "distributor" ? "Distribution Point" : "Retail Store"}
          </div>
          <div style="margin-bottom: 4px">${m.address}</div>
          ${m.vendor ? `<div style="font-size: 13px"><strong>Vendor:</strong> ${m.vendor}</div>` : ""}
          ${m.agent ? `<div style="font-size: 13px"><strong>Agent:</strong> ${m.agent}</div>` : ""}
          ${
            m.phone
              ? `<div style="margin-top: 6px"><a href="tel:${m.phone}" style="color: #BB4500">${m.phone}</a></div>`
              : ""
          }
          ${
            m.website
              ? `<div><a href="${m.website}" target="_blank" rel="noopener noreferrer" style="color: #BB4500">Website</a></div>`
              : ""
          }
        </div>
      `;

      marker.bindPopup(html, { closeButton: true });

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(m.id));
      }

      marker.addTo(layer);
    }
  }, [centerLatLng.lat, centerLatLng.lng, markers, onMarkerClick]);

  return (
    <div
      ref={containerRef}
      className={["rounded-2xl border border-[#E8E2DC] bg-white/80 shadow-md", className || ""].join(" ")}
      style={{ height: containerHeight, width: "100%", overflow: "hidden" }}
    />
  );
}
