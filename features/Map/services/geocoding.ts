import { LatLng } from '../types/toilet';

const key = process.env.EXPO_PUBLIC_MAPTILER_KEY;

interface ReverseGeocodeResponse {
  features: Array<{
    place_name: string;
  }>;
}

export async function reverseGeocoding(query: LatLng): Promise<string> {
  const url = `https://api.maptiler.com/geocoding/${query.longitude},${query.latitude}.json?key=${key}&limit=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to reverse geocode location');
  }

  const result: ReverseGeocodeResponse = await response.json();

  return result.features[0].place_name || '';
}
