'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Echo } from '@/lib/types';
import { spreadEchoMarkers } from '@/lib/markerSpread';
import { cutePinSvg, avatarTooltipHtml, pinSizeForZoom } from '@/lib/pinMarker';

interface FlatMapProps {
  echoes: Echo[];
  onSelectEcho: (echo: Echo) => void;
}

type SpreadEcho = Echo & { markerLat: number; markerLng: number };

export default function FlatMap({ echoes, onSelectEcho }: FlatMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const spreadRef = useRef<SpreadEcho[]>([]);
  const onSelectRef = useRef(onSelectEcho);
  onSelectRef.current = onSelectEcho;

  const rebuildMarkers = useCallback(() => {
    const map = mapInstance.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const zoom = map.getZoom();
    const pinW = pinSizeForZoom(zoom);
    const pinH = Math.round(pinW * 1.28);

    spreadRef.current.forEach((echo) => {
      const html = `<div class="echo-leaflet-pin">${cutePinSvg(echo.userId, pinW)}</div>`;
      const icon = L.divIcon({
        html,
        className: 'echo-pin-icon',
        iconSize: [pinW, pinH],
        iconAnchor: [pinW / 2, pinH],
      });

      const marker = L.marker([echo.markerLat, echo.markerLng], { icon }).addTo(map);
      marker.bindTooltip(avatarTooltipHtml(echo.userAvatar, echo.userName, 20), {
        permanent: false,
        direction: 'top',
        offset: [0, -6],
        className: 'echo-pin-tooltip',
        opacity: 1,
      });
      marker.on('click', () => onSelectRef.current(echo));
      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current, { zoomControl: false }).setView([30, 110], 3);
    mapInstance.current = map;

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { attribution: '&copy; OSM &copy; CARTO', subdomains: 'abcd', maxZoom: 20 }
    ).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    map.on('zoomend', rebuildMarkers);

    return () => {
      map.off('zoomend', rebuildMarkers);
      map.remove();
      mapInstance.current = null;
      markersRef.current = [];
    };
  }, [rebuildMarkers]);

  useEffect(() => {
    spreadRef.current = spreadEchoMarkers(echoes);
    rebuildMarkers();
  }, [echoes, rebuildMarkers]);

  return (
    <div className="relative h-full w-full">
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,245,249,0.3) 0%, transparent 12%, transparent 88%, rgba(243,248,255,0.35) 100%)',
        }}
        aria-hidden
      />
      <div ref={mapContainer} className="h-full w-full" style={{ zIndex: 0 }} />
    </div>
  );
}
