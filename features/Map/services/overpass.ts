export type OverpassElement = {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

export type OverpassResponse = {
  elements: OverpassElement[];
};

export type ToiletsQueryFilters = {
  access?: boolean;
  fee?: boolean;
  wheelchair?: boolean;
};

export function buildToiletsQuery(
  latitude: number,
  longitude: number,
  radiusMeters: number,
  filters: Required<ToiletsQueryFilters>
) {
  const filterLines = [
    '["amenity"="toilets"]',
    filters.access ? '["access"~"^(public|customers)$"]' : null,
    filters.fee ? '["fee"!~"^yes$"]' : null,
    filters.wheelchair ? '["wheelchair"!~"^no$"]' : null,
  ].filter(Boolean);

  const filterBlock = filterLines.join('\n    ');

  return `[out:json][timeout:25];
(
  node${filterBlock}(around:${radiusMeters},${latitude},${longitude});
  way${filterBlock}(around:${radiusMeters},${latitude},${longitude});
  relation${filterBlock}(around:${radiusMeters},${latitude},${longitude});
);
out center tags;`;
}

export async function fetchToilets(query: string) {
  const url = `https://overpass-turbo.eu/?Q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch toilets from Overpass.');
  }
  return (await response.json()) as OverpassResponse;
}
