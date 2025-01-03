import { useParams } from "react-router";

export const Event = () => {
  const params = useParams<{ eventId: string }>();
  return (
    <div>
      <h1>Event: {params.eventId}</h1>
    </div>
  );
};
