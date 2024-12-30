import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import mapboxgl, { GeoJSONFeature, LngLatLike, Map } from "mapbox-gl";

// import { Feature, FeatureCollection, IconI } from "./types";
import { Popup } from "../Event/Popup";

export const Icons = ({
  mapRef,
  sourceId,
  layerId,
}: {
  mapRef: React.MutableRefObject<Map | null>;
  sourceId: string;
  layerId: string;
}) => {
  // const [iconData, setIconData] = useState<IconI[]>();
  // const elRef = useRef<HTMLDivElement[]>([]);
  // const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [hoveredMarker, setHoveredMarker] = useState<{
    hoveredElement: HTMLDivElement;
    iconURL: string;
    eventId: number;
  } | null>(null);

  const fetchGeoJsonData = async () => {
    const resp = await fetch(`/api/geojson`);
    if (!resp.ok) return null;

    return (await resp.json()) as Array<GeoJSONFeature>;
  };

  const fetchImageURL = async (eventId: number) => {
    const resp = await fetch(`/api/image/${eventId}/icon`);
    if (!resp.ok) return null;

    const blob = await resp.blob();
    return URL.createObjectURL(blob);
  };

  const displayMarkers = async (features: Array<GeoJSONFeature>) => {
    //Remove any existing markers before creating new ones
    const existingMarkers = document.querySelectorAll(".marker");
    existingMarkers.forEach((marker) => marker.remove());

    console.log(features);

    for (const marker of features) {
      console.log("lol");
      const eventId = marker.properties?.["eventId"];
      const imageURL = await fetchImageURL(eventId);
      if (!imageURL) continue;

      const coords =
        marker.geometry.type === "Point" &&
        (marker.geometry.coordinates as LngLatLike);

      const el = document.createElement("div");

      el.className = "marker";
      el.style.backgroundImage = `url(${imageURL})`;
      el.style.backgroundSize = "100%";
      el.style.display = "block";
      el.style.border = "1rem solid white";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.padding = "0";

      el.addEventListener("click", () => {
        window.alert(JSON.stringify(marker.properties, null, 2));
      });

      console.log(coords, mapRef.current);

      if (coords && mapRef.current) {
        new mapboxgl.Marker(el).setLngLat(coords).addTo(mapRef.current);
      }
    }
  };

  // useEffect(() => {
  //   const map = mapRef.current;
  //   if (!map || !iconData) return;

  //   const geojson: FeatureCollection = {
  //     type: "FeatureCollection",
  //     features: [],
  //   };

  //   for (const info of iconData) {
  //     const feature: Feature = {
  //       type: "Feature",
  //       properties: {
  //         message: info.event_name,
  //         imageId: info.id,
  //         url: info.url,
  //         iconSize: [60, 60],
  //       },
  //       geometry: {
  //         type: "Point",
  //         coordinates: [info.lng, info.lat],
  //       },
  //     };
  //     geojson.features.push(feature);
  //   }

  //   markersRef.current.forEach((marker) => marker.remove());
  //   markersRef.current = [];
  //   elRef.current = [];

  //   for (const marker of geojson.features) {
  //     const el = document.createElement("div");
  //     const properties = marker.properties;
  //     const [width, height] = properties.iconSize;

  //     // el.className = `marker w-[${width.toString()}px] h-[${height.toString()}px] border-2 rounded border-white`;
  //     el.style.backgroundImage = `url(${properties.url})`;
  //     el.style.width = `${width.toString()}px`;
  //     el.style.height = `${height.toString()}px`;
  //     el.style.backgroundSize = "100%";
  //     el.style.borderRadius = "2rem";
  //     el.style.border = "2px solid white"
  //     el.style.cursor = "pointer";

  //     el.addEventListener("mouseenter", () => {
  //       el.style.opacity = "0.7";
  //       setHoveredMarker({
  //         eventId: properties.imageId,
  //         iconURL: properties.url,
  //         hoveredElement: el,
  //       });
  //     });
  //     el.addEventListener("mouseleave", () => {
  //       el.style.opacity = "1";
  //       setHoveredMarker(null);
  //     });

  //     const markerInstance = new mapboxgl.Marker(el)
  //       .setLngLat(marker.geometry.coordinates as LngLatLike)
  //       .addTo(map);

  //     markersRef.current.push(markerInstance);
  //     elRef.current.push(el);
  //   }

  //   return () => {
  //     markersRef.current.forEach((marker) => marker.remove());
  //   };
  // }, [mapRef, iconData]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    const features = map.querySourceFeatures(sourceId);
    // const features = void fetchGeoJsonData();

    console.log("asdas")
    void displayMarkers(features);

    // map.source

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, []);

  return (
    <>
      {hoveredMarker &&
        createPortal(<Popup hoveredObj={hoveredMarker} />, document.body)}
    </>
  );
};
