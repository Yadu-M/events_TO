import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import { Options } from "../Header/Options";

export const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

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

    const map = mapRef.current;

    map.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const sourceId = "toronto-event-dataset";

    if (!mapLoaded || !map) return;

    map.addSource(sourceId, {
      type: "geojson",
      data: "/api/geojson"
    });

    map.on("sourcedata", () => {
      const features = map.querySourceFeatures(sourceId);
      console.log(features);
      for (const marker of features) {
        const eventId: number = marker.properties?.["eventId"];
        const coords =
          marker.geometry.type === "Point" && marker.geometry.coordinates;

        console.log(features);
        if (!coords) continue;

        console.log("we here ?");

        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundImage = `url(/api/image/${eventId}/icon)`;
        el.style.backgroundSize = "100%";
        el.style.display = "block";
        el.style.border = "none";
        el.style.borderRadius = "50%";
        el.style.cursor = "pointer";
        el.style.padding = "0";

        new mapboxgl.Marker(el).setLngLat(coords as LngLatLike).addTo(map);
      }
    });
  }, [mapLoaded]);

  return (
    <>
      <div id="map" ref={mapContainerRef} className="absolute inset-0" />
      {mapLoaded && (
        <>
          <Options mapRef={mapRef} />
          {/* <Icons mapRef={mapRef} /> */}
        </>
      )}
    </>
  );
};
