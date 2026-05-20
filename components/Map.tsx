'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Echo } from '@/lib/types';

interface MapComponentProps {
  echoes: Echo[];
  onSelectEcho: (echo: Echo) => void;
  onBack: () => void;
}

const MARKER_RING: Record<string, string> = {
  '1': '#ffb8d0',
  '2': '#8ecdf5',
  '3': '#ffe9a8',
};

function isImageAvatar(avatar: string): boolean {
  return avatar.startsWith('/') || avatar.startsWith('data:') || avatar.startsWith('http');
}

function markerHtml(echo: Echo): string {
  const ring = MARKER_RING[echo.userId] ?? '#ffb8d0';
  const inner = isImageAvatar(echo.userAvatar)
    ? `<img src="${echo.userAvatar}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%" />`
    : `<span style="font-size:1.25rem">${echo.userName}</span>`;

  return `
    <div style="
      width:48px;height:48px;border-radius:50%;overflow:hidden;
      border:3px solid #fff;box-shadow:0 6px 20px rgba(255,158,187,0.45);
      background:linear-gradient(145deg,${ring},#fff);
      display:flex;align-items:center;justify-content:center;cursor:pointer;
    ">${inner}</div>
  `;
}

export default function MapComponent({
  echoes,
  onSelectEcho,
  onBack,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapInstance.current = L.map(mapContainer.current, { zoomControl: false }).setView([30, 110], 4);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    ).addTo(mapInstance.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) layer.remove();
    });

    echoes.forEach((echo) => {
      const icon = L.divIcon({
        html: markerHtml(echo),
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        className: 'custom-marker',
      });
      const marker = L.marker([echo.latitude, echo.longitude], { icon }).addTo(
        mapInstance.current!
      );
      marker.on('click', () => onSelectEcho(echo));
    });
  }, [echoes, onSelectEcho]);

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,245,249,0.35) 0%, transparent 15%, transparent 85%, rgba(243,248,255,0.4) 100%)',
        }}
        aria-hidden
      />
      <div ref={mapContainer} className="w-full h-full" style={{ zIndex: 0 }} />

      <button
        type="button"
        onClick={onBack}
        className="absolute top-5 left-5 z-10 echo-btn echo-btn-soft px-5 py-2.5 text-[14px] font-bold"
      >
        ← 回去看看
      </button>

      <div className="absolute bottom-6 right-6 z-10 echo-card px-4 py-3 text-[13px] text-[var(--echo-text-soft)] max-w-[200px]">
        <span className="font-extrabold text-[#ff9ebb]">{echoes.length}</span> 颗小足迹
        <br />
        <span className="text-[11px]">点点头像，翻开回忆</span>
      </div>
    </div>
  );
}
