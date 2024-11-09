import mapboxgl from "mapbox-gl";
import { useRef, useEffect, useState } from "react";

import "./style.css";
import { Options } from "./Options";
import { Icons } from "./Icons";

export const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const accessToken: string = import.meta.env.VITE_MAPBOX_TOKEN as string;
    if (!accessToken) alert("mapbox access token not initialized");
    mapboxgl.accessToken = accessToken;

    if (!mapContainerRef.current) {
      console.error("Map container not initialized");
      return;
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-79.347015, 43.65107],
      zoom: 15.1,
      pitch: 62,
      bearing: -20,
    });

    mapRef.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      {mapLoaded && <Options mapRef={mapRef} />}
      {mapLoaded && <Icons mapRef={mapRef} />}
    </>
  );
};
