export interface Info {
  id: number;
  event_id: number;
  event_name: string;
  lat: number;
  lng: number;
  thumbNail_url: string;
}

export const getInfo = async () => {
  try {
    const res = await fetch("api/info");
    if (!res.ok) throw Error("Something went wrong with the backend");
    const data = await res.json();
    return data.data as Info[];
  } catch (err) {
    console.error("Something went wrong with Info api call: ", err);
    return null;
  }
};
