import { useEffect, useState } from "react";
import { Map } from "mapbox-gl";
import { FiMoon, FiSun, FiSunrise, FiSunset } from "react-icons/fi";
import { MdPlace } from "react-icons/md";
import { FaBuilding, FaBus, FaRoad } from "react-icons/fa";
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group";
import { Toggle } from "@/Components/ui/toggle";

export const Options = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<Map | null>;
}) => {
  type lightPresetT = "dawn" | "noon" | "dusk" | "night";

  const [lightPreset, setLightPreset] = useState<lightPresetT>(initLightPreset());
  const [showPlaceLabels, setShowPlaceLabels] = useState(true);
  const [showPOILabels, setShowPOILabels] = useState(true);
  const [showRoadLabels, setShowRoadLabels] = useState(true);
  const [showTransitLabels, setShowTransitLabels] = useState(true);
  const [styleLoaded, setStyleLoaded] = useState(false);

  function initLightPreset(): lightPresetT {
    const currTime = new Date().getHours().valueOf();
    let lightPreset: lightPresetT = "dawn";

    if (currTime > 12 && currTime <= 16) lightPreset = "noon";
    else if (currTime > 16 && currTime <= 21) lightPreset = "dusk";
    else if (currTime > 21 || currTime <= 6) lightPreset = "night";

    return lightPreset;
  }

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
    <div className="absolute right-1 top-1 flex flex-col gap-1">
      <ToggleGroup
        variant={"outline"}
        type="single"
        defaultValue={lightPreset}
        onValueChange={(value: lightPresetT) => {
          if (value) setLightPreset(value);
        }}
      >
        <ToggleGroupItem value="dawn">
          <FiSunrise color="orange" />
        </ToggleGroupItem>
        <ToggleGroupItem value="noon">
          <FiSun color="orange" />
        </ToggleGroupItem>
        <ToggleGroupItem value="dusk">
          <FiSunset color="orange" />
        </ToggleGroupItem>
        <ToggleGroupItem value="night">
          <FiMoon color="black" />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="flex gap-1">
        <Toggle
          variant={"outline"}
          aria-label="Toggle Place"
          defaultPressed={showPOILabels}
          onPressedChange={(press) => {
            setShowPOILabels(press);
          }}
        >
          <FaBuilding color="black" />
        </Toggle>
        <Toggle
          variant={"outline"}
          aria-label="Toggle Place"
          defaultPressed={showPlaceLabels}
          onPressedChange={(press) => {
            setShowPlaceLabels(press);
          }}
        >
          <MdPlace color="black" />
        </Toggle>
        <Toggle
          variant={"outline"}
          aria-label="Toggle Place"
          defaultPressed={showRoadLabels}
          onPressedChange={(press) => {
            setShowRoadLabels(press);
          }}
        >
          <FaRoad color="black" />
        </Toggle>
        <Toggle
          variant={"outline"}
          aria-label="Toggle Place"
          defaultPressed={showTransitLabels}
          onPressedChange={(press) => {
            setShowTransitLabels(press);
          }}
        >
          <FaBus color="black" />
        </Toggle>
      </div>
    </div>
  );
};
