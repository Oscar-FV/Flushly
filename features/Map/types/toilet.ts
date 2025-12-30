export type ToiletId = string;

export type ToiletSource = 'osm';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type ToiletKind = 'public' | 'business';

export type ToiletTags = {
  access?: string;
  fee?: string;
  wheelchair?: string;
  amenity?: string;
  name?: string;
  operator?: string;
};

export type ToiletRatingSummary = {
  average: number;
  count: number;
};

export type ToiletMyState = {
  favorite?: boolean;
  rating?: number;
};

export type Toilet = {
  /** ID unico global para poder unir ratings/favs */
  id: ToiletId;

  /** De donde viene */
  source: ToiletSource;

  /** Coordenadas para pintar en mapa */
  location: LatLng;

  /** UI */
  title: string;
  subtitle?: string;
  kind: ToiletKind;

  /** filtros/atributos */
  tags: ToiletTags;

  /** social */
  rating?: ToiletRatingSummary;
  mine?: ToiletMyState;

  /** timestamps (si aplica) */
  createdAt?: string;
  updatedAt?: string;

  /**
   * Escape hatch: datos especificos por fuente sin romper el modelo.
   * Util para debug o features futuras.
   */
  meta?: {
    osm?: {
      osmType: 'node' | 'way' | 'relation';
      osmId: number;
      rawTags?: Record<string, string>;
    };
    db?: {
      createdBy?: string;
      isHidden?: boolean;
    };
  };
};
