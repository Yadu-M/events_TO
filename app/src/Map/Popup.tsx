import { useState, useEffect } from "react";
import { markerPropertiesT } from "./types";
import { Button } from "@/Components/ui/button";
import { BrowserRouter, NavLink } from "react-router";

type featureT =
  | "Public Washrooms"
  | "Free Parking"
  | "Paid Parking"
  | "Bike Racks"
  | "Onsite Food and Beverages";

export const Popup = ({ marker }: { marker: markerPropertiesT }) => {
  const feature: Record<featureT, JSX.Element> = {
    "Public Washrooms": (
      <img
        key={1}
        src="/feature_icons/toilet.png"
        className="w-10 h-10 object-cover"
        title="Public Washrooms"
      />
      // <a
      //   href="https://www.flaticon.com/free-icons/restroom"
      //   title="restroom icons"
      // >
      //   Restroom icons created by Freepik - Flaticon
      // </a>
    ),
    "Free Parking": (
      <img
        key={2}
        src="/feature_icons/free-parking.png"
        className="w-10 h-10 object-cover"
        title="Free Parking"
      />
      // <a
      //   href="https://www.flaticon.com/free-icons/free-parking"
      //   title="free parking icons"
      // >
      //   Free parking icons created by Freepik - Flaticon
      // </a>
    ),
    "Paid Parking": (
      <img
        key={3}
        src="/feature_icons/parking.png"
        className="w-10 h-10 object-cover"
        title="Paid Parking"
      />
      // <a href="https://www.flaticon.com/free-icons/paid" title="paid icons">
      //   Paid icons created by Freepik - Flaticon
      // </a>
    ),
    "Bike Racks": (
      <img
        key={4}
        src="/feature_icons/bicycle.png"
        className="w-10 h-10 object-cover"
        title="Bike Racks"
      />
      // <a
      //   href="https://www.flaticon.com/free-icons/bike-parking"
      //   title="bike parking icons"
      // >
      //   Bike parking icons created by pojok d - Flaticon
      // </a>
    ),
    "Onsite Food and Beverages": (
      <img
        key={5}
        src="/feature_icons/coffee.png"
        className="w-10 h-10 object-cover"
        title="Onsite Food and Beverages"
      />
      // <a
      //   href="https://www.flaticon.com/free-icons/beverage"
      //   title="beverage icons"
      // >
      //   Beverage icons created by wanicon - Flaticon
      // </a>
    ),
  };

  const wordLimit = 55;
  const eventId = marker.eventId;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

    void setImage();
  }, [eventId]);

  const dataJSX = (type: string, data: string | number | null) => {
    return data ? (
      <div className="inline text-xs">
        <strong>{type}:</strong> {data}
      </div>
    ) : null;
  };

  const costJSX = () => {
    const costObj = marker.cost;
    return costObj && Object.keys(costObj).length ? (
      <>
        <strong>Ticket Info</strong>
        {costObj._from && dataJSX("From", `$${costObj._from}`)}
        {costObj._to && dataJSX("To", `$${costObj._to}`)}
        {costObj.adult && dataJSX("Adult", `$${costObj.adult}`)}
        {costObj.child && dataJSX("Child", `$${costObj.child}`)}
        {costObj.generalAdmission &&
          dataJSX("General Admission", `$${costObj.generalAdmission}`)}
        {costObj.senior && dataJSX("Senior", `$${costObj.senior}`)}
        {costObj.student && dataJSX("Student", `$${costObj.student}`)}
        {costObj.youth && dataJSX("Youth", `$${costObj.youth}`)}
      </>
    ) : null;
  };

  return (
    <div className="rounded-md border-gray-700 border-2 bg-background p-3">
      <h2>{marker.eventName}</h2>
      <div className="gap-4 my-2 py-2 flex flex-row flex-wrap lg:flex-nowrap border-b-2">
        {imageUrl && (
          <img
            className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-md m-auto lg:m-0"
            src={imageUrl}
          />
        )}
        <div className="flex flex-col justify-between gap-2">
          <p className="min-w-10">{limitDescription(marker.description)}</p>
          <div className="flex gap-5">
            {marker.features
              .split(",")
              .map(
                (_feature, i) =>
                  feature[_feature as featureT] ?? (
                    <span key={i}>Unknown feature: {_feature}</span>
                  )
              )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-1 flex-wrap md:flex-nowrap h-auto">
        <div className="flex flex-col md:min-w-[65%]">
          {dataJSX("Category", marker.category)}
          {dataJSX("Start Date", new Date(marker.startDate).toDateString())}
          {dataJSX("End Date", new Date(marker.endDate).toDateString())}
          {dataJSX("Free Event", marker.freeEvent)}
          {dataJSX("Location Name", marker.locationName)}
          {dataJSX("Reservation Required", marker.reservationsRequired)}
          {dataJSX("Address", marker.address)}
        </div>
        <div className="md:block md:rounded-md md:w-[0.2rem] md:min-h-full md:bg-secondary hidden" />
        <div className="flex flex-col justify-around">
          {costJSX()}
          <div className="gap-1">
            {marker.eventWebsite && (
              <a
                href={marker.eventWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant={"link"}
                  size={"inline"}
                  type="submit"
                  className="p-0 m-0 text-orange-400"
                >
                  Visit event website
                </Button>
              </a>
            )}
            <BrowserRouter>
              <NavLink to={`/event/${eventId}`} target="_blank">
                <Button
                  variant={"link"}
                  size={"inline"}
                  className="p-0 m-0 text-orange-400"
                >
                  Learn More
                </Button>
              </NavLink>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </div>
  );
};
