import { useEffect, useState } from "react";

import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import { Info } from "../api/info";

interface Feature {
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

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

export const Icons = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<Map | null>;
}) => {
  const [infos, setInfos] = useState<Info>();

  useEffect(() => {
    const getEventIcons = async () => {
      await fetch("api/info")
        .then((res) => res.json())
        .then((payload: Info) => {
          setInfos(payload);
        })
        .catch((err: unknown) => {
          console.error(`Something went wrong: ${String(err)}`);
        });
    };

    void getEventIcons();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !infos) return;

    const geojson: FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };

    for (const info of infos.data) {
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
      el.style.width = `${width.toString()}px`;
      el.style.height = `${height.toString()}px`;
      el.style.backgroundSize = "100%";
      el.style.display = "block";
      el.style.border = "none";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.padding = "0";

      el.addEventListener("click", () => {
        window.alert(marker.properties.message);
      });

      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates as LngLatLike)
        .addTo(map);
    }
  }, [mapRef, infos]);

  return <></>;
};
