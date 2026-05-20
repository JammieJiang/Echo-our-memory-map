import { PlaceSuggestion } from './types';

type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
};

function formatLabel(item: NominatimResult): string {
  const a = item.address;
  const name =
    a?.city || a?.town || a?.village || item.display_name.split(',')[0]?.trim() || '';
  const region = a?.state;
  const country = a?.country;
  const parts = [name, region, country].filter(Boolean);
  if (parts.length >= 2) return parts.join(', ');
  return item.display_name.split(',').slice(0, 3).join(', ');
}

function formatPlaceName(item: NominatimResult): string {
  const a = item.address;
  const name =
    a?.city || a?.town || a?.village || item.display_name.split(',')[0]?.trim() || '';
  const country = a?.country;
  if (country && name) return `${name} · ${country}`;
  return formatLabel(item);
}

/** 模糊搜索地点（Nominatim） */
export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8&addressdetails=1`,
      { headers: { 'Accept-Language': 'zh-CN,en' } }
    );
    if (!res.ok) return [];

    const data = (await res.json()) as NominatimResult[];
    return data.map((item, index) => ({
      id: String(item.place_id ?? `${item.lat}-${item.lon}-${index}`),
      label: formatLabel(item),
      placeName: formatPlaceName(item),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
}
