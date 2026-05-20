const PIN_COLORS: Record<string, string> = {
  '1': '#ff9ebb',
  '2': '#8ecdf5',
  '3': '#e8c060',
};

/** 可爱大头针 SVG（底部尖对准坐标） */
export function cutePinSvg(userId: string, size = 16): string {
  const color = PIN_COLORS[userId] ?? '#ff9ebb';
  const h = Math.round(size * 1.28);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${h}" viewBox="0 0 20 26" aria-hidden="true">
    <path d="M10 25s-8-6.5-8-14a8 8 0 1 1 16 0c0 7.5-8 14-8 14z" fill="${color}" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="10" cy="11" r="3.2" fill="#fff" opacity="0.95"/>
  </svg>`;
}

export function avatarTooltipHtml(avatar: string, name: string, size = 22): string {
  const isImg =
    avatar.startsWith('/') || avatar.startsWith('data') || avatar.startsWith('http');
  const inner = isImg
    ? `<img src="${avatar}" alt="" width="${size}" height="${size}" style="border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.12)"/>`
    : `<span style="font-size:${size * 0.55}px">${name}</span>`;
  return `<div class="echo-pin-tooltip-inner">${inner}</div>`;
}

/** Leaflet：缩放越大，大头针越大（与地图同大同小） */
export function pinSizeForZoom(zoom: number, base = 14): number {
  return Math.round(base * Math.pow(1.22, zoom - 3));
}

/** 地球 Html 标记：相机越近越大（与球面透视一致，与原先相反） */
export function pinSizeForGlobeDistance(dist: number): number {
  const ref = 5.2;
  return Math.round(Math.min(26, Math.max(10, (14 * ref) / dist)));
}

export function globeDistanceFactor(dist: number): number {
  return Math.max(4, Math.min(12, 8 / (dist / 5.2)));
}
