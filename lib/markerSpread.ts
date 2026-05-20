import { Echo } from './types';

const SPREAD_STEP = 0.35;

/** 同一区域多条 Echo 时轻微偏移，减少地球标记重叠 */
export function spreadEchoMarkers(
  echoes: Echo[]
): (Echo & { markerLat: number; markerLng: number })[] {
  const buckets = new Map<string, Echo[]>();

  echoes.forEach((echo) => {
    const key = `${echo.latitude.toFixed(1)}_${echo.longitude.toFixed(1)}`;
    const list = buckets.get(key) ?? [];
    list.push(echo);
    buckets.set(key, list);
  });

  const result: (Echo & { markerLat: number; markerLng: number })[] = [];

  buckets.forEach((group) => {
    group.forEach((echo, i) => {
      if (group.length === 1) {
        result.push({ ...echo, markerLat: echo.latitude, markerLng: echo.longitude });
        return;
      }
      const angle = (i / group.length) * Math.PI * 2;
      const r = SPREAD_STEP * (0.6 + i * 0.15);
      result.push({
        ...echo,
        markerLat: echo.latitude + Math.cos(angle) * r,
        markerLng: echo.longitude + Math.sin(angle) * r * 1.2,
      });
    });
  });

  return result;
}
