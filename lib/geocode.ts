/** 常见城市坐标（离线优先） */
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  北京: { lat: 39.9042, lng: 116.4074 },
  上海: { lat: 31.2304, lng: 121.4737 },
  广州: { lat: 23.1291, lng: 113.2644 },
  深圳: { lat: 22.5431, lng: 114.0579 },
  杭州: { lat: 30.2741, lng: 120.1551 },
  南京: { lat: 32.0603, lng: 118.7969 },
  成都: { lat: 30.5728, lng: 104.0668 },
  重庆: { lat: 29.563, lng: 106.5516 },
  武汉: { lat: 30.5928, lng: 114.3055 },
  西安: { lat: 34.3416, lng: 108.9398 },
  长沙: { lat: 28.2282, lng: 112.9388 },
  厦门: { lat: 24.4798, lng: 118.0894 },
  青岛: { lat: 36.0671, lng: 120.3826 },
  大连: { lat: 38.914, lng: 121.6147 },
  天津: { lat: 39.3434, lng: 117.3616 },
  苏州: { lat: 31.2989, lng: 120.5853 },
  香港: { lat: 22.3193, lng: 114.1694 },
  台北: { lat: 25.033, lng: 121.5654 },
  温哥华: { lat: 49.2827, lng: -123.1207 },
  Vancouver: { lat: 49.2827, lng: -123.1207 },
};

/** 从地点文案提取城市名，如「北京 · 798艺术区」→ 北京 */
export function extractCityFromPlace(placeName: string): string {
  const trimmed = placeName.trim();
  if (!trimmed) return '';

  const parts = trimmed.split(/[·•|,\-—]/).map((p) => p.trim());
  const first = parts[0] ?? trimmed;

  for (const city of Object.keys(CITY_COORDS)) {
    if (first.includes(city) || trimmed.includes(city)) {
      return city;
    }
  }

  return first.replace(/\s+/g, '').slice(0, 8);
}

function lookupLocal(city: string): { lat: number; lng: number } | null {
  if (CITY_COORDS[city]) return CITY_COORDS[city];

  for (const [name, coords] of Object.entries(CITY_COORDS)) {
    if (city.includes(name) || name.includes(city)) {
      return coords;
    }
  }

  return null;
}

/** 已选模糊搜索结果时直接使用坐标 */
export function resolveFromSelection(
  placeName: string,
  lat: number,
  lng: number
): { lat: number; lng: number; city: string } {
  return { lat, lng, city: extractCityFromPlace(placeName) };
}

/** 根据城市/地点文案解析经纬度 */
export async function resolveCoordinates(
  placeName: string,
  coords?: { lat: number; lng: number }
): Promise<{ lat: number; lng: number; city: string } | null> {
  if (coords) return resolveFromSelection(placeName, coords.lat, coords.lng);

  const city = extractCityFromPlace(placeName);
  if (!city) return null;

  const local = lookupLocal(city);
  if (local) return { ...local, city };

  try {
    const query =
      placeName.includes(',') || placeName.includes('，')
        ? placeName.replace(/，/g, ',')
        : city === '温哥华' || city === 'Vancouver'
          ? 'Vancouver, British Columbia, Canada'
          : /[\u4e00-\u9fff]/.test(city)
            ? `${city}, 中国`
            : placeName.trim();

    const q = encodeURIComponent(query);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'zh-CN,zh' } }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data?.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      city,
    };
  } catch {
    return null;
  }
}

export function getCitySuggestions(): string[] {
  return Object.keys(CITY_COORDS);
}

/** 记录 Echo 表单快速选城（含西安、温哥华） */
export function getQuickCitySuggestions(): string[] {
  return ['北京', '上海', '广州', '深圳', '成都', '长沙', '西安', '温哥华'];
}
