export interface Info {
  data: [
    {
      id: number;
      event_id: number;
      event_name: string;
      lat: number;
      lng: number;
      url: string;
    }
  ];
  success: boolean;
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
