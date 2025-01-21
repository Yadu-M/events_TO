import Layout from "@/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  costT,
  dateT,
  eventT,
  image,
  locationT,
  reservationT,
  TableToTypeMap,
  weeklyDateT,
} from "./types";
import { generateImageURL } from "@/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/Components/ui/card";
import { eventInfo, dateInfo, reservationInfo, costInfo } from "./data";

type DataType = {
  event: eventT | null;
  date: dateT | null;
  weeklyDate: weeklyDateT | null;
  location: locationT | null;
  cost: costT | null;
  imageMetadata: image | null;
  reservation: reservationT | null;
};

const CardComponent = ({
  title,
  content,
}: {
  title: string;
  description: string;
  content: JSX.Element;
}) => {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export const EventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [imageURL, setImageURL] = useState<string | null>(null);

  const [data, setData] = useState<DataType>({
    event: null,
    date: null,
    weeklyDate: null,
    location: null,
    cost: null,
    imageMetadata: null,
    reservation: null,
  });

  const fetchData = async <T extends keyof TableToTypeMap>(
    dataT: T,
    eventId: number
  ) => {
    const resp = await fetch(`/api/${dataT}/${eventId}`);
    if (resp.ok) return (await resp.json()) as TableToTypeMap[T];
    return null;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const [
        eventData,
        dateData,
        weeklyDateData,
        locationData,
        costData,
        imageData,
        reservationData,
      ] = await Promise.all([
        fetchData("event", Number(eventId)),
        fetchData("date", Number(eventId)),
        fetchData("weeklyDate", Number(eventId)),
        fetchData("location", Number(eventId)),
        fetchData("cost", Number(eventId)),
        fetchData("image", Number(eventId)),
        fetchData("reservation", Number(eventId)),
      ]);

      setData({
        event: eventData,
        date: dateData,
        weeklyDate: weeklyDateData,
        location: locationData,
        cost: costData,
        imageMetadata: imageData,
        reservation: reservationData,
      });

      setImageURL(await generateImageURL(Number(eventId), "image"));
    };

    fetchAllData();

    return () => {
      if (imageURL) URL.revokeObjectURL(imageURL);
    };
  }, [eventId]);

  const changePageTitle = () => {
    const title = document.getElementsByTagName("title");
    const eventName = data.event?.eventName;
    if (eventName) title[0].innerText = `TO Events - ${eventName}`;
  };

  changePageTitle();

  const title = () => {
    return <h2>{data.event?.eventName}</h2>;
  };

  const image = () => {
    return (
      imageURL && (
        <img
          src={imageURL}
          alt={data.imageMetadata?.altText}
          className="mx-auto"
        ></img>
      )
    );
  };

  const description = () => {
    return <p>{data.event?.description}</p>;
  };

  const CalendarComponent = () => {
    return "";
  };

  const address = () => {
    const location = data.location;
    if (location) {
      return (
        <div className="flex flex-col">
          <div>
            <strong>Location Name: </strong>
            {location.locationName}
          </div>
          {location.address && (
            <div>
              <strong>Address: </strong>
              {location.address}
            </div>
          )}
          {location.displayAddress && (
            <div>
              <strong>Addition Info: </strong>
              {location.displayAddress}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Layout>
      <div className="flex flex-col mt-4 mx-auto px-4 sm:max-w-[80%] md:max-w-[60%] gap-6">
        {title()}
        {image()}
        {description()}
        {address()}
        <div className="flex flex-wrap gap-7 justify-center md:justify-normal">
          {(data.date || data.weeklyDate) && (
            <CardComponent
              title="Date"
              description="Date Info"
              content={dateInfo(data.date, data.weeklyDate)}
            />
          )}
          {data.reservation ? (
            <CardComponent
              title="Reservation"
              description="Reservation Info"
              content={reservationInfo(data.reservation)}
            />
          ) : data.event ? (
            <CardComponent
              title="Reservation"
              description="Reservation Info"
              content={eventInfo(data.event)}
            />
          ) : (
            ""
          )}

          {data.cost && (
            <CardComponent
              title="Cost"
              description="Cost related Info"
              content={costInfo(data.cost)}
            />
          )}
          {(data.date || data.weeklyDate) && CalendarComponent()}
        </div>
      </div>
    </Layout>
  );
};
