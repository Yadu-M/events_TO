import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import mapboxgl, { LngLatLike, Map } from "mapbox-gl";

import { Feature, FeatureCollection, Info } from "./types";
import { Popup } from "../Event/Popup";

export const Icons = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<Map | null>;
}) => {
  const [infos, setInfos] = useState<Info>();
  const elRef = useRef<HTMLDivElement[]>([]);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [hoveredMarker, setHoveredMarker] = useState<{
    hoveredElement: HTMLDivElement;
    iconURL: string;
    eventId: number;
  } | null>(null);

  useEffect(() => {
    const getEventIcons = async () => {
      try {
        const res = await fetch("api/info");
        const payload: Info = (await res.json()) as Info;
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

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    elRef.current = [];

    for (const marker of geojson.features) {
      const el = document.createElement("div");
      const properties = marker.properties;
      const [width, height] = properties.iconSize;

      el.className = "marker";
      el.style.backgroundImage = `url(${properties.url})`;
      el.style.width = `${width.toString()}px`;
      el.style.height = `${height.toString()}px`;
      el.style.backgroundSize = "100%";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";

      el.addEventListener("mouseenter", () => {
        el.style.opacity = "0.7";
        setHoveredMarker({
          eventId: properties.imageId,
          iconURL: properties.url,
          hoveredElement: el,
        });
      });
      el.addEventListener("mouseleave", () => {
        el.style.opacity = "1";
        setHoveredMarker(null);
      });

      const markerInstance = new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates as LngLatLike)
        .addTo(map);

      markersRef.current.push(markerInstance);
      elRef.current.push(el);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
    };
  }, [mapRef, infos]);

  return (
    <>
      {hoveredMarker &&
        createPortal(<Popup hoveredObj={hoveredMarker} />, document.body)}
    </>
  );
};
