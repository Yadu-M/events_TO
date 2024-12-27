export interface IconI {
  id: number;
  eventId: number;
  altText: string;
  credit: string;
  url: string;
}

export interface Feature {
  type: "Feature";
  properties: {
    message: string;
    imageId: number;
    url: string;
    iconSize: [number, number];
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}
