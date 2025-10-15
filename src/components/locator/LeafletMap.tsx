"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
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

function MapViewUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center as LatLngExpression, Math.max(map.getZoom(), 6), {
        animate: true,
      });
    }
  }, [center, map]);
  return null;
}

export default function LeafletMap({ center, radiusKm = 50, markers, highlightId: _highlightId, onMarkerClick, height, className }: LeafletMapProps) {
  const centerLatLng = useMemo(() => ({ lat: center[0], lng: center[1] }), [center]);
  const containerHeight = typeof height === "number" ? `${height}px` : height || "500px";

  return (
    <div
      className={["rounded-2xl border border-[#E8E2DC] bg-white/80 shadow-md", className || ""].join(" ")}
      style={{ height: containerHeight, width: "100%", overflow: "hidden" }}
    >
      <MapContainer center={centerLatLng as unknown as LatLngExpression} zoom={7} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewUpdater center={center} />

        {radiusKm > 0 && (
          <Circle
            center={centerLatLng}
            radius={radiusKm * 1000}
            pathOptions={{ color: "#BB4500", fillColor: "#BB4500", fillOpacity: 0.08 }}
          />
        )}

        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.coordinates.lat, m.coordinates.lng] as LatLngExpression}
            icon={markerIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(m.id),
            }}
          >
            <Popup>
              <div style={{ minWidth: 200 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                  {m.type === "distributor" ? "Distribution Point" : "Retail Store"}
                </div>
                <div style={{ marginBottom: 4 }}>{m.address}</div>
                {m.vendor && (
                  <div style={{ fontSize: 13 }}>
                    <strong>Vendor:</strong> {m.vendor}
                  </div>
                )}
                {m.agent && (
                  <div style={{ fontSize: 13 }}>
                    <strong>Agent:</strong> {m.agent}
                  </div>
                )}
                {m.phone && (
                  <div style={{ marginTop: 6 }}>
                    <a href={`tel:${m.phone}`} style={{ color: "#BB4500" }}>
                      {m.phone}
                    </a>
                  </div>
                )}
                {m.website && (
                  <div>
                    <a href={m.website} target="_blank" rel="noopener noreferrer" style={{ color: "#BB4500" }}>
                      Website
                    </a>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
