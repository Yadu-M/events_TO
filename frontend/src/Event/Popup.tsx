import { useEffect, useState } from "react";

import { Event } from "./types";
import { useWindowDimensions } from "../Hooks/useWindowDimensions";

export const Popup = ({
  hoveredObj,
}: {
  hoveredObj: {
    hoveredElement: HTMLDivElement;
    iconURL: string;
    eventId: number;
  };
}) => {
  const wordLimit = 25;
  const [event, setEvent] = useState<Event | null>(null);
  const [elemCoordObj, setElemCoordObj] = useState(
    hoveredObj.hoveredElement.getBoundingClientRect()
  );
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const { eventId, iconURL } = hoveredObj;

  function limitDescription(description: string): string {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return description;
  }

  useEffect(() => {
    setElemCoordObj(hoveredObj.hoveredElement.getBoundingClientRect());
  }, [hoveredObj]);

  useEffect(() => {
    const getEventData = async () => {
      try {
        const res = await fetch(`/api/event/${eventId}`);
        const payload = (await res.json()) as {
          data: Event;
          success: boolean;
        };

        if (res.ok) {
          setEvent(payload.data);
        }
      } catch (err) {
        console.error(`Something went wrong: ${String(err)}`);
      }
    };

    getEventData();
  }, []);

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
      {!event ? (
        <p>Loading...</p>
      ) : (
        <div className="w-[30rem]">
          <h2>{event.event_name}</h2>
          <div className="flex gap-4 p-2">
            <img className="w-48 h-48 object-cover rounded-md" src={iconURL} />
            <p>{limitDescription(event.description)}</p>
          </div>
          <div className="flex flex-col">
            <p>{event.category ? `Catgeory: ${event.category}` : ""}</p>
            <p>{event.org_name ? `Org Name: ${event.org_name}` : ""}</p>
            <p>{event.partner_name ? `Partner Name: ${event.partner_name}` : ""}</p>
            <p>
              {event.accessibility ? `Accessibility: ${event.accessibility}` : ""}
            </p>
            <p>
              {event.other_cost_info
                ? `Cost: ${event.other_cost_info}`
                : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
