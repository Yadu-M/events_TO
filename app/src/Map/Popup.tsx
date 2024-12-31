import { Skeleton } from "@/Components/ui/skeleton";
import { useState, useEffect } from "react";
import { FaAccessibleIcon } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { EventI } from "./types";

export const Popup = ({ eventId }: { eventId: number }) => {
  const wordLimit = 40;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [event, setEvent] = useState<EventI | null>(null);

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

    const setImage = async () => {
      const imageUrl = await fetchImageURL(eventId);
      imageUrl && setImageUrl(imageUrl);
    };

    void setImage();
    void getEventData();
  }, [eventId]);

  return (
    <div className="rounded-md border-gray-700 border-2 bg-background p-3 max-w-[40rem]">
      {!event || !imageUrl ? (
        <Skeleton className="">
          <Skeleton className="h-3 w-auto"></Skeleton>
          <div className="flex gap-4 p-2">
            <Skeleton className="w-48 h-48"></Skeleton>
            <Skeleton className="h-20 wi-auto"></Skeleton>
          </div>
          <Skeleton className="h-20 wi-auto"></Skeleton>
        </Skeleton>
      ) : (
        <div className="">
          <h2>{event.eventName}</h2>
          <div className="flex gap-4 pt-2 pr-2 pb-2">
            <img className="w-48 h-48 object-cover rounded-md" src={imageUrl} />
            <p>{limitDescription(event.description)}</p>
          </div>
          <div className="flex">
            <div className="flex flex-col pr-2 mr-2 border-r-2">
              {event.categoryString ? (<div className=""><strong>Catgeory: </strong>{`${event.categoryString}`}</div>) : ""}
              <strong>{event.eventPhone ? `Event Phone: ${event.eventPhone}` : ""}</strong>
              <strong>{event.expectedAvg ? 
                (<div className="flex flex-row gap-1 items-center">{`Expected Average attendance: ${event.expectedAvg}`}<FaPerson /></div>)
              : ""}</strong>
              <strong>{event.frequency ? `Frequency: ${event.frequency}` : ""}</strong>
              <strong>{event.startDate ? `Start Date: ${new Date(event.startDate).toDateString()}` : ""}</strong>
              <strong>{event.endDate ? `End Date: ${new Date(event.endDate).toDateString()}` : ""}</strong>
              <strong>{event.timeInfo ? `Time Info: ${event.timeInfo}` : ""}</strong>
              <strong>{event.freeEvent ? `Free Event: ${event.freeEvent}` : ""}</strong>
              <strong>{event.contactName ? `Contact: ${event.contactName}` : ""}</strong>         
            </div>
            <div className="flex flex-col pl-2 ml-2 border-l-2">
              <strong>{event.orgName ? `Org Name: ${event.orgName}` : ""}</strong>
              <strong>{event.partnerName ? `Partner Name: ${event.partnerName}` : ""}</strong>
            </div>
          </div>
          <strong>
            {event.accessibility === "full" ? (
              <FaAccessibleIcon size={30} color="blue" />
            ) : (
              ""
            )}
          </strong>          
        </div>
      )}
    </div>
  );
};
