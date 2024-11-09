import mapboxgl from "mapbox-gl";
import { useRef, useEffect } from "react";

import "./style.css";
import { Info } from "../api/info";
import { StyleOptions } from "./StyleOptions";

export const Map = ({ info }: { info: Info[] }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? null;
    if (accessToken == null) alert("mapbox access token not initialized");
    else mapboxgl.accessToken = accessToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      center: [-79.347015, 43.65107],
      zoom: 15.1,
      pitch: 62,
      bearing: -20,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      {mapRef.current && <StyleOptions mapRef={mapRef} />}
    </>
  );
};
