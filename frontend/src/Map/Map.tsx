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

    mapRef.current.on('load', () => {
      setMapLoaded(true);
    })

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
