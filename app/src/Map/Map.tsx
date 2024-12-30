import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import { Options } from "../Header/Options";
import { Icons } from "./Icons";

export const Map = () => {
  const sourceId = "toronto-event-dataset";
  const layerId = "icon-layer";

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersInitializedRef = useRef(false);

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

    mapRef.current.on("load", () => {
      // setMapLoaded(true);
      map.addSource(sourceId, {
        type: "geojson",
        data: "/api/geojson",
      });

      map.addLayer({
        id: layerId,
        source: sourceId,
        type: "symbol",
      });

      void displayMarkers(map.querySourceFeatures(sourceId));
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div id="map" ref={mapContainerRef} className="absolute inset-0" />
      {/* {mapLoaded && (
        <>
          <Options mapRef={mapRef} />
          <Icons mapRef={mapRef} sourceId={sourceId} layerId={layerId} />
        </>
      )} */}
    </>
  );
};
