import { SearchItem } from '../types/search-item';


type GeocodeSearchOptions = {
  limit?: number;
  language?: string;
  proximity?: { latitude: number; longitude: number };
};

type ForwardGeocodeResponse = {
  features: Array<{
    properties?: {
      name?: string;
      street?: string;
      housenumber?: string;
      city?: string;
      state?: string;
      country?: string;
      postcode?: string;
      osm_id?: number;
    };
    geometry?: {
      coordinates?: [number, number];
    };
  }>;
};

export async function geocodeSearch(
  query: string,
  { limit = 5, language, proximity }: GeocodeSearchOptions = {}
): Promise<SearchItem[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const params = new URLSearchParams({ limit: String(limit) });
  if (language) {
    params.set('lang', language);
  }
  if (proximity) {
    params.set('lat', `${proximity.latitude}`);
    params.set('lon', `${proximity.longitude}`);
  }
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
    trimmed
  )}&${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to geocode search');
  }

  const result: ForwardGeocodeResponse = await response.json();

  return (result.features || [])
    .filter(
      (feature) =>
        Array.isArray(feature.geometry?.coordinates) &&
        feature.geometry?.coordinates?.length === 2
    )
    .map((feature, index) => {
      const [longitude, latitude] = feature.geometry?.coordinates as [number, number];
      const title = feature.properties?.name || feature.properties?.city || 'Unknown place';
      return {
        id: feature.properties?.osm_id?.toString() || `${latitude}-${longitude}-${index}`,
        tittle: title,
        details: formatPhotonDetails(feature.properties),
        coords: { latitude, longitude },
      };
    });
}

function formatPhotonDetails(
  properties: ForwardGeocodeResponse['features'][number]['properties']
) {
  if (!properties) {
    return '';
  }

  const street = [properties.street, properties.housenumber].filter(Boolean).join(' ');
  const locality = [properties.city, properties.state].filter(Boolean).join(', ');
  const country = properties.country ? `, ${properties.country}` : '';
  const postcode = properties.postcode ? ` ${properties.postcode}` : '';

  return [street, locality + postcode + country].filter(Boolean).join(', ');
}
