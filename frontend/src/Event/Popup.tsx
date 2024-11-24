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
  const [event, setEvent] = useState<Event | null>(null);
  const { height: windowY, width: windowX } = useWindowDimensions();

  const { hoveredElement: elem, eventId, iconURL } = hoveredObj;
  const elemCoordObj = elem.getBoundingClientRect();
  const y = elemCoordObj.y;
  const x = elemCoordObj.x;
  let style: React.CSSProperties | null = {
    left: x,
    top: y,
  };

  // TODO: Fix the style
  if (windowX - x > x) {
    // style = { ...style, position: "absolute", left: 0 };
  } else {
    // style = { ...style, left: x };
  }

  if (windowY - y > y) {
    // style = { ...style, bottom: 0 };
  } else {
    // style = { ...style, top: y };
  }

  useEffect(() => {
    const getEventData = async () => {
      try {
        const res = await fetch(`api/event/${eventId}`);
        const payload = (await res.json()) as {
          data: Event;
          success: boolean;
        };
        setEvent(payload.data);
      } catch (err) {
        console.error(`Something went wrong: ${String(err)}`);
      }
    };

    void getEventData();
  }, []);

  return (
    <>
      {event && (
        <div className={`absolute bg-background border-black p-1 border-r-2 pointer-events-none max-w-65 z-10 left-96 top-96`}>
          <h2>{event.event_name}</h2>
          <img className="w-48 h-48 object-cover" src={iconURL} />
        </div>
      )}
    </>
  );
};
