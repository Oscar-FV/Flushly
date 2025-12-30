import type { LatLng, Toilet, ToiletBadge, ToiletKind, ToiletTags } from '../types/toilet';

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
    // filters.access ? '["access"~"^(public|customers)$"]' : null,
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
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch toilets from Overpass.');
  }
  return (await response.json()) as OverpassResponse;
}

export function normalizeOverpassToToilets(response: OverpassResponse): Toilet[] {
  return response.elements
    .map((element) => {
      const location = getElementLocation(element);
      if (!location) {
        return null;
      }

      const rawTags = element.tags ?? {};
      const tags: ToiletTags = {
        access: rawTags.access,
        fee: rawTags.fee,
        wheelchair: rawTags.wheelchair,
        amenity: rawTags.amenity,
        name: rawTags.name,
        operator: rawTags.operator,
      };

      const kind: ToiletKind = rawTags.access === 'customers' ? 'business' : 'public';
      const title = rawTags.name ?? 'Bano publico';
      const badges = getToiletBadges(kind, tags);

      const toilet: Toilet = {
        id: `osm:${element.type}:${element.id}`,
        source: 'osm',
        location,
        title,
        kind,
        badges,
        tags,
        meta: {
          osm: {
            osmType: element.type,
            osmId: element.id,
            rawTags,
          },
        },
      };

      return toilet;
    })
    .filter((toilet): toilet is Toilet => Boolean(toilet));
}

function getElementLocation(element: OverpassElement): LatLng | null {
  if (typeof element.lat === 'number' && typeof element.lon === 'number') {
    return { latitude: element.lat, longitude: element.lon };
  }

  if (element.center && typeof element.center.lat === 'number' && typeof element.center.lon === 'number') {
    return { latitude: element.center.lat, longitude: element.center.lon };
  }

  return null;
}

function getToiletBadges(kind: ToiletKind, tags: ToiletTags): ToiletBadge[] {
  const variants: ToiletBadge[] = [];
  const access = tags.access?.toLowerCase();
  const fee = tags.fee?.toLowerCase();
  const wheelchair = tags.wheelchair?.toLowerCase();

  if (access) {
    if (['public', 'yes', 'permissive'].includes(access)) {
      variants.push('public');
    }
    if (['private', 'customers', 'no'].includes(access)) {
      variants.push('private');
    }
  } else {
    if (kind === 'public') {
      variants.push('public');
    } else if (kind === 'business') {
      variants.push('private');
    }
  }

  if (fee) {
    if (['yes', 'true', 'paid'].includes(fee)) {
      variants.push('paid');
    }
    if (['no', 'false', 'free'].includes(fee)) {
      variants.push('free');
    }
  }

  if (wheelchair && ['yes', 'limited', 'designated'].includes(wheelchair)) {
    variants.push('wheelchair');
  }

  return Array.from(new Set(variants));
}
