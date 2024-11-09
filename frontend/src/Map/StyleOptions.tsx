import { useEffect, useState } from "react";
import { Map } from "mapbox-gl";

export const StyleOptions = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<Map | null>;
}) => {
  const [lightPreset, setLightPreset] = useState("day");
  const [showPlaceLabels, setShowPlaceLabels] = useState(true);
  const [showPOILabels, setShowPOILabels] = useState(true);
  const [showRoadLabels, setShowRoadLabels] = useState(true);
  const [showTransitLabels, setShowTransitLabels] = useState(true);
  const [styleLoaded, setStyleLoaded] = useState(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleStyleLoad = () => {
      setStyleLoaded(true);

      // Check if source already exists and remove it if it does
      if (map.getSource('line')) {
        map.removeLayer('line');
        map.removeSource('line');
      }

      // Add source and layer
      map.addSource("line", {
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

      map.addLayer({
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
    };

    // Add event listener
    map.on("style.load", handleStyleLoad);

    // Cleanup function
    return () => {
      if (map) {
        map.off("style.load", handleStyleLoad);
        if (map.getSource('line')) {
          map.removeLayer('line');
          map.removeSource('line');
        }
      }
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
    styleLoaded
  ]);

  return (
    <>
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