import { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import { Info } from "../api/info";
import { createPortal } from "react-dom";
import { Popup } from "./Popup";

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
  const elRef = useRef<HTMLDivElement[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mountedMarkers, setMountedMarkers] = useState<HTMLDivElement[]>([]);

  useEffect(() => {
    const getEventIcons = async () => {
      try {
        const res = await fetch("api/info");
        const payload: Info = await res.json();
        setInfos(payload);
      } catch (err) {
        console.error(`Something went wrong: ${String(err)}`);
      }
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

    // Cleanup existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    elRef.current = [];
    setMountedMarkers([]);

    const newElRefs: HTMLDivElement[] = [];
    for (const marker of geojson.features) {
      const el = document.createElement("div");
      const [width, height] = marker.properties.iconSize;
      el.className = "marker";
      el.style.backgroundImage = `url(${marker.properties.url})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";

      el.addEventListener("click", () => {
        window.alert(marker.properties.message);
      });

      const markerInstance = new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates as LngLatLike)
        .addTo(map);

      markersRef.current.push(markerInstance);
      newElRefs.push(el);
    }

    elRef.current = newElRefs;
    setMountedMarkers(newElRefs);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
    };
  }, [mapRef, infos]);

  return <>{mountedMarkers.map((el) => createPortal(<Popup />, el))}</>;
};
