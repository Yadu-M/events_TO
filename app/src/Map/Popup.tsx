import { useEffect, useState } from "react";

import { EventI, hoverT } from "./types";
import { useWindowDimensions } from "../Hooks/useWindowDimensions";
import { BiAccessibility } from "react-icons/bi";
import { Skeleton } from "@/Components/ui/skeleton";

export const Popup = ({ props }: { props: hoverT }) => {
  const wordLimit = 25;
  const { eventId, hoveredMarker } = props;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [event, setEvent] = useState<EventI | null>(null);
  const [elemCoordObj, setElemCoordObj] = useState(
    hoveredMarker.getBoundingClientRect()
  );
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const limitDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return description;
  };

  const fetchImageURL = async (eventId: number) => {
    try {
      const resp = await fetch(`/api/image/${eventId}/image`);
      if (!resp.ok) throw Error();

      const blob = await resp.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const setImage = async () => {
      const imageUrl = await fetchImageURL(eventId);
      imageUrl && setImageUrl(imageUrl);
    };

    setImage();
  }, []);

  useEffect(() => {
    setElemCoordObj(hoveredMarker.getBoundingClientRect());
  }, [hoveredMarker]);

  useEffect(() => {
    const getEventData = async () => {
      try {
        const res = await fetch(`/api/event/${eventId.toString()}`);
        const payload = (await res.json()) as EventI;

        if (res.ok) {
          setEvent(payload);
        }
      } catch (err) {
        // console.error(`Something went wrong: ${String(err)}`);
      }
    };

    void getEventData();
  }, [eventId]);

  const popupStyle: React.CSSProperties = {
    position: "absolute",
    top: Math.min(
      elemCoordObj.y + elemCoordObj.height + 10,
      windowHeight - 200
    ),
    left: Math.min(elemCoordObj.x + elemCoordObj.width + 10, windowWidth - 300),
    zIndex: 10,
    pointerEvents: "none",
  };

  return (
    <div
      style={popupStyle}
      className="rounded-md border-gray-700 border-2 bg-background p-3"
    >
      {!event || !imageUrl ? (
        <Skeleton className="w-[30rem]">
          <Skeleton className="h-3 w-auto"></Skeleton>
          <div className="flex gap-4 p-2">
            <Skeleton className="w-48 h-48"></Skeleton>
            <Skeleton className="h-20 wi-auto"></Skeleton>
          </div>
          <Skeleton className="h-20 wi-auto"></Skeleton>
        </Skeleton>
      ) : (
        <div className="w-[30rem]">
          <h2>{event.eventName}</h2>
          <div className="flex gap-4 p-2">
            <img className="w-48 h-48 object-cover rounded-md" src={imageUrl} />
            <p>{limitDescription(event.description)}</p>
          </div>
          <div className="flex flex-col">
            <p>
              {event.categoryString ? `Catgeory: ${event.categoryString}` : ""}
            </p>
            <p>{event.orgName ? `Org Name: ${event.orgName}` : ""}</p>
            <p>
              {event.partnerName ? `Partner Name: ${event.partnerName}` : ""}
            </p>
            <p>
              {event.accessibility === "full" ? (
                <BiAccessibility size={30} color="blue" />
              ) : (
                ""
              )}
            </p>
            {/* <p>
              {event. ? `Cost: ${event.other_cost_info}` : ""}
            </p> */}
          </div>
        </div>
      )}
    </div>
  );
};
