import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OccurrenceData } from "./Occurrence";

interface Props {
    occurrences: OccurrenceData[];
    focusedOccurrence?: OccurrenceData | null;
    mapFocusKey?: number;
}

const urgencyColor = (urg?: string) => {
    switch (urg) {
        case "critica":
            return "#ef4444"; // red
        case "alta":
            return "#f97316"; // orange
        case "media":
            return "#f59e0b"; // yellow
        case "baixa":
        default:
            return "#10b981"; // green
    }
};

function FitBounds({ points }: { points: [number, number][] }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        if (!points || points.length === 0) return;
        try {
            map.fitBounds(points as any, { padding: [40, 40] });
        } catch (e) {
            // ignore
        }
    }, [map, points]);

    return null;
}

function FlyTo({ lat, lng, focusKey }: { lat: number; lng: number; focusKey?: number }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        try {
            map.flyTo([lat, lng], 16, { duration: 0.8 });
        } catch (e) {
            // ignore
        }
    }, [map, lat, lng, focusKey]);

    return null;
}

const OccurrenceMap: React.FC<Props> = ({ occurrences, focusedOccurrence, mapFocusKey }) => {
    const points = occurrences
        .map((o) => (o.lat != null && o.lng != null ? [o.lat as number, o.lng as number] as [number, number] : null))
        .filter(Boolean) as [number, number][];

    const center: [number, number] = points.length > 0 ? points[0] : [-15.7801, -47.9292];

    return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 mb-6">
            {/* @ts-ignore */}
            <MapContainer center={center as any} zoom={13} scrollWheelZoom={false} style={{ height: 420, width: "100%" } as any}>
                {/* @ts-ignore */}
                <TileLayer 
                    // @ts-ignore
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // @ts-ignore
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {points.length > 0 && !focusedOccurrence && <FitBounds points={points} />}

                {focusedOccurrence?.lat != null && focusedOccurrence?.lng != null && (
                    <FlyTo
                        lat={focusedOccurrence.lat}
                        lng={focusedOccurrence.lng}
                        focusKey={mapFocusKey}
                    />
                )}

                {occurrences.map((occ) =>
                    occ.lat != null && occ.lng != null ? (
                        // @ts-ignore
                        <Marker
                            key={occ.id ?? `${occ.lat}-${occ.lng}`}
                            position={[occ.lat as number, occ.lng as number] as any}
                            // @ts-ignore
                            icon={L.divIcon({
                                html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:${urgencyColor(occ.urgency)};border:2px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.18);"><span style="width:12px;height:12px;border-radius:50%;background:white;"></span></div>`,
                                className: "",
                                iconSize: [30, 30],
                                iconAnchor: [15, 30],
                                popupAnchor: [0, -30],
                            }) as any}
                        >
                            <Popup>
                                <div style={{ maxWidth: 260 }}>
                                    <h3 style={{ fontWeight: 700 }}>{occ.title ?? "Sem título"}</h3>
                                    {occ.image_url && (
                                        <div style={{ margin: "8px 0" }}>
                                            <img src={occ.image_url} alt={occ.title} style={{ width: "100%", borderRadius: 8 }} />
                                        </div>
                                    )}
                                    <div style={{ fontSize: 13, color: "#e5e7eb" }}>{occ.description}</div>
                                    <div style={{ marginTop: 8, fontSize: 13 }}>
                                        <strong>Tipo:</strong> {occ.category}
                                    </div>
                                    <div style={{ fontSize: 13 }}>
                                        <strong>Urgência:</strong> {occ.urgency}
                                    </div>
                                    <div style={{ fontSize: 13 }}>
                                        <strong>Bairro:</strong> {occ.neighborhood ?? occ.bairroNome ?? "—"}
                                    </div>
                                    <div style={{ fontSize: 13 }}>
                                        <strong>Rua:</strong> {occ.rua ?? "—"}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                )}
            </MapContainer>
        </div>
    );
};

export default OccurrenceMap;
