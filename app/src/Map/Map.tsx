import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import { Options } from "../Header/Options";
import { createRoot, Root } from "react-dom/client";
import { Popup } from "./Popup";
import { markerPropertiesT } from "./types";
import { generateImageURL } from "@/utils";

export const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const popUpRef = useRef<Root[] | null>(null);
  const imageBlobURLs = useRef<string[] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const fetchGeoJsonData = async () => {
    try {
      const resp = await fetch(`/api/geojson`);
      if (!resp.ok) return null;
      return (await resp.json()) as GeoJSON.FeatureCollection;
    } catch (error) {
      return null;
    }
  };

  const displayMarkers = async (features: GeoJSON.FeatureCollection) => {
    //Remove any existing markers before creating new ones
    const existingMarkers = document.querySelectorAll(".marker");
    existingMarkers.forEach((marker) => marker.remove());
    const map = mapRef.current;
    if (!map) return;

    for (const feature of features.features) {
      const eventId = feature.properties?.["eventId"];
      const iconURL = await generateImageURL(eventId, "icon");

      const coords =
        feature.geometry.type === "Point" &&
        (feature.geometry.coordinates as LngLatLike);

      if (!coords) continue;

      const el = document.createElement("div");
      el.className = "marker";

      if (iconURL) {
        imageBlobURLs.current?.push(iconURL)
        el.style.backgroundImage = `url(${iconURL})`;
        el.style.border = "0.1rem solid white";
      } else {
        el.style.backgroundImage = `url("/map-marker-question.png")`;
      }

      el.style.width = "70px";
      el.style.height = "70px";
      el.style.backgroundSize = "100%";
      el.style.display = "block";
      // el.style.objectFit = "fill";

      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.padding = "0";

      // Marker obj
      const marker = new mapboxgl.Marker(el);
      marker.setLngLat(coords).addTo(map);

      // Instantiate a popup container to draw the popup
      const popupContainer = document.createElement("div");
      const root = createRoot(popupContainer);
      root.render(
        <Popup marker={feature.properties as markerPropertiesT} key={eventId} />
      ); // render popup

      popUpRef.current?.push(root); // store the popups to unmount them during cleanup
      marker.setPopup(
        new mapboxgl.Popup().setDOMContent(popupContainer).setMaxWidth("75vw")
      );
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
      popUpRef.current?.forEach((popup) => popup.unmount());
      imageBlobURLs.current?.forEach((url) => URL.revokeObjectURL(url));
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div id="map" ref={mapContainerRef} className="absolute inset-0" />
      <header className="absolute top-0 left-0 z-10 pointer-events-none">
        <h1>TO Events</h1>
      </header>
      {mapLoaded && <Options mapRef={mapRef} />}
    </>
  );
};
