import { useEffect, useState } from "react";
import { Map } from "mapbox-gl";
import { Button } from "@/Components/ui/button";
import { FiMoon, FiSun, FiSunrise, FiSunset } from "react-icons/fi";
import { MdPlace } from "react-icons/md";
import { FaBuilding, FaBus, FaRoad } from "react-icons/fa";

export const Options = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<Map | null>;
}) => {
  type lightPresetType = "dawn" | "noon" | "dusk" | "night";

  const [lightPreset, setLightPreset] = useState<lightPresetType>("noon");
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

      if (map.getSource("line")) {
        map.removeLayer("line");
        map.removeSource("line");
      }

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

    if (map.isStyleLoaded()) {
      handleStyleLoad();
    } else {
      map.on("style.load", handleStyleLoad);
    }

    return () => {
      map.off("style.load", handleStyleLoad);
      if (map.getSource("line")) {
        map.removeLayer("line");
        map.removeSource("line");
      }
    };
  }, [mapRef]);

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
    styleLoaded,
    mapRef,
  ]);

  return (
    <div className="absolute right-10 top-4 flex flex-col gap-1">
      <div className="flex gap-1">
        <Button
          size={"icon"}
          className={lightPreset === "dawn" ? "bg-gray-600" : ""}
          onClick={() => {
            setLightPreset("dawn");
          }}
        >
          <FiSunrise color="orange" />
        </Button>
        <Button
          size={"icon"}
          className={lightPreset === "noon" ? "bg-gray-600" : ""}
          onClick={() => {
            setLightPreset("noon");
          }}
        >
          <FiSun color="yellow" />
        </Button>
        <Button
          size={"icon"}
          className={lightPreset === "dusk" ? "bg-gray-600" : ""}
          onClick={() => {
            setLightPreset("dusk");
          }}
        >
          <FiSunset color="orange" />
        </Button>
        <Button
          size={"icon"}
          className={lightPreset === "night" ? "bg-gray-600" : ""}
          onClick={() => {
            setLightPreset("night");
          }}
        >
          <FiMoon color="white" />
        </Button>
      </div>
      <div className="flex gap-1">
        <Button
          size={"icon"}
          className={showPlaceLabels ? "bg-gray-600" : ""}
          onClick={() => {
            setShowPlaceLabels((currState) => !currState);
          }}
        >
          <FaBuilding color="white" />
        </Button>
        <Button
          size={"icon"}
          className={showPOILabels ? "bg-gray-600" : ""}
          onClick={() => {
            setShowPOILabels((currState) => !currState);
          }}
        >
          <MdPlace color="white" />
        </Button>
        <Button
          size={"icon"}
          className={showRoadLabels ? "bg-gray-600" : ""}
          onClick={() => {
            setShowRoadLabels((currState) => !currState);
          }}
        >
          <FaRoad color="white" />
        </Button>
        <Button
          size={"icon"}
          className={showTransitLabels ? "bg-gray-600" : ""}
          onClick={() => {
            setShowTransitLabels((currState) => !currState);
          }}
        >
          <FaBus color="white" />
        </Button>
      </div>
    </div>
  );
};
