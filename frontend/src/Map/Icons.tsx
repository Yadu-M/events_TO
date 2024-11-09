import { useEffect, useState } from "react";

import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import { getInfo, Info } from "../api/info";

interface Feature {
  type: "Feature";
  properties: {
    message: string;
    imageId: number;
    url:  string,
    iconSize: [number, number];
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

export const Icons = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<Map | null>;
}) => {
  const [infos, setInfos] = useState<Info[] | null>();

  useEffect(() => {
    const getEventIcons = async () => {
      const data = await getInfo();
      setInfos(data);
    };

    getEventIcons();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !infos) return; 

    const geojson: FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };

    for (const info of infos) {
      const feature: Feature = {
        type: "Feature",
        properties: {
          message: info.event_name,
          imageId: info.id,
          url: info.url,
          iconSize: [60, 60],
        },
        geometry: {
          type: "Point",
          coordinates: [info.lng, info.lat],
        },
      };
      geojson.features.push(feature);
    }

    for (const marker of geojson.features) {
      const el = document.createElement("div");
      const width = marker.properties.iconSize[0];
      const height = marker.properties.iconSize[1];
      el.className = "marker";
      el.style.backgroundImage = `url(${marker.properties.url})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";
      el.style.display = "block";
      el.style.border = "none";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.padding = "0";

      el.addEventListener("click", () => {
        window.alert(marker.properties.message);
      });

      if (map) {
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates as LngLatLike)
          .addTo(map);
      }
    }
  }, [mapRef, infos]);

  return <></>
};
