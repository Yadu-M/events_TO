import mapboxgl from "mapbox-gl";
import { useRef, useState, useEffect } from "react";

import "./style.css"

export const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [lightPreset, setLightPreset] = useState("day");
  const [showPlaceLabels, setShowPlaceLabels] = useState(true);
  const [showPOILabels, setShowPOILabels] = useState(true);
  const [showRoadLabels, setShowRoadLabels] = useState(true);
  const [showTransitLabels, setShowTransitLabels] = useState(true);
  const [styleLoaded, setStyleLoaded] = useState(false);

  useEffect(() => {
    const accessToken =
      import.meta.env.VITE_MAPBOX_TOKEN ??
      "pk.eyJ1IjoieWFkaWkiLCJhIjoiY20xOGIzZzRsMDlkdDJqcTI2bzNhaXg5biJ9.UDf1_cs8fXdorZl3x4qgWg";
    if (accessToken == null) alert("mapbox access token not initialized");
    else mapboxgl.accessToken = accessToken;

    // [43.6532, 79.3832],
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      center: [-79.347015, 43.65107],
      zoom: 15.1,
      pitch: 62,
      bearing: -20,
    });

    mapRef.current.on("style.load", () => {
      setStyleLoaded(true);

      mapRef.current?.addSource("line", {
        type: "geojson",
        lineMetrics: true,
        data: {
          type: "LineString",
          coordinates: [
            [2.293389857555951, 48.85896319631851],
            [2.2890810326441624, 48.86174223718291],
          ],
        },
      });

      mapRef.current?.addLayer({
        id: "line",
        source: "line",
        type: "line",
        paint: {
          "line-width": 12,
          "line-emissive-strength": 0.8,
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            "red",
            1,
            "blue",
          ],
        },
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!styleLoaded) return;

    mapRef.current?.setConfigProperty("basemap", "lightPreset", lightPreset);
    mapRef.current?.setConfigProperty(
      "basemap",
      "showPlaceLabels",
      showPlaceLabels
    );
    mapRef.current?.setConfigProperty(
      "basemap",
      "showPointOfInterestLabels",
      showPOILabels
    );
    mapRef.current?.setConfigProperty(
      "basemap",
      "showRoadLabels",
      showRoadLabels
    );
    mapRef.current?.setConfigProperty(
      "basemap",
      "showTransitLabels",
      showTransitLabels
    );
  }, [
    lightPreset,
    showPlaceLabels,
    showPOILabels,
    showRoadLabels,
    showTransitLabels,
  ]);

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      <div className="map-overlay">
        <div className="map-overlay-inner">
          <fieldset>
            <label>
              Select light preset
              <select
                id="lightPreset"
                name="lightPreset"
                value={lightPreset}
                onChange={(e) => setLightPreset(e.target.value)}
              >
                <option value="dawn">Dawn</option>
                <option value="day">Day</option>
                <option value="dusk">Dusk</option>
                <option value="night">Night</option>
              </select>
            </label>
          </fieldset>
          <fieldset>
            <label>
              Show place labels
              <input
                type="checkbox"
                id="showPlaceLabels"
                checked={showPlaceLabels}
                onChange={(e) => setShowPlaceLabels(e.target.checked)}
              />
            </label>
          </fieldset>
          <fieldset>
            <label>
              Show POI labels
              <input
                type="checkbox"
                id="showPointOfInterestLabels"
                checked={showPOILabels}
                onChange={(e) => setShowPOILabels(e.target.checked)}
              />
            </label>
          </fieldset>
          <fieldset>
            <label>
              Show road labels
              <input
                type="checkbox"
                id="showRoadLabels"
                checked={showRoadLabels}
                onChange={(e) => setShowRoadLabels(e.target.checked)}
              />
            </label>
          </fieldset>
          <fieldset>
            <label>
              Show transit labels
              <input
                type="checkbox"
                id="showTransitLabels"
                checked={showTransitLabels}
                onChange={(e) => setShowTransitLabels(e.target.checked)}
              />
            </label>
          </fieldset>
        </div>
      </div>
    </>
  );
};
