export interface Info {
  data: [
    {
      id: number;
      event_id: number;
      event_name: string;
      lat: number;
      lng: number;
      url: string;
    }
  ];
  success: boolean;
}

export const infoApiURL = "api/info";
// export const getInfo = async () => {
//   try {
//     const res = await fetch("api/info");
//     if (!res.ok) throw Error("Something went wrong with the backend");
//     const data = await res.json();
//     return data.data as Info[];
//   } catch (err) {
//     console.error("Something went wrong with Info api call: ", err);
//     return null;
//   }
// };
