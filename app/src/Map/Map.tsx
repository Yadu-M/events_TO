import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import { Options } from "../Header/Options";
import { Popup } from "./Popup";
import { hoverT } from "./types";

export const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<hoverT | null>(null);

  const fetchGeoJsonData = async () => {
    const resp = await fetch(`/api/geojson`);
    if (!resp.ok) return null;

    return (await resp.json()) as GeoJSON.FeatureCollection;
  };

  const fetchIconURL = async (eventId: number) => {
    try {
      const resp = await fetch(`/api/image/${eventId}/icon`);
      if (!resp.ok) throw Error();

      const blob = await resp.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      return null;
    }
  };

  const displayMarkers = async (features: GeoJSON.FeatureCollection) => {
    //Remove any existing markers before creating new ones
    const existingMarkers = document.querySelectorAll(".marker");
    existingMarkers.forEach((marker) => marker.remove());

    for (const marker of features.features) {
      const eventId = marker.properties?.["eventId"];
      const imageURL = await fetchIconURL(eventId);
      if (!imageURL) continue;

      const coords =
        marker.geometry.type === "Point" &&
        (marker.geometry.coordinates as LngLatLike);

      const el = document.createElement("div");

      el.className = "marker";
      el.style.backgroundImage = `url(${imageURL})`;
      el.style.width = "70px";
      el.style.height = "70px";
      el.style.backgroundSize = "100%";
      el.style.display = "block";
      el.style.border = "0.1rem solid white";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.padding = "0";

      el.addEventListener("click", () => {
        window.alert(JSON.stringify(marker.properties, null, 2));
      });

      el.addEventListener("mouseenter", () => {
        el.style.opacity = "0.7";
        setHoveredMarker({
          eventId: eventId,
          hoveredMarker: el,
        });
      });

      el.addEventListener("mouseleave", () => {
        el.style.opacity = "1";
        setHoveredMarker(null);
      });

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

    mapRef.current.on("load", async () => {
      setMapLoaded(true);

      const features = await fetchGeoJsonData();
      if (features) {
        await displayMarkers(features);
      }
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div id="map" ref={mapContainerRef} className="absolute inset-0" />
      {mapLoaded && <Options mapRef={mapRef} />}
      {hoveredMarker && <Popup props={hoveredMarker} />}
    </>
  );
};
