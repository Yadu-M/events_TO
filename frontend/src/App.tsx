import { useEffect, useState } from "react";

import { Map } from "./Map/Map";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import Layout from "./Layout";
import { getInfo, Info } from "./api/info";


export const App = () => {
  const [data, setData] = useState<Info[] | null>();

  useEffect(() => {
    const getEventIcons = async () => { 
      const data = await getInfo()
      setData(data)
    };

    getEventIcons();
  }, []);

  return (
    <>
      <Layout>
        {data && <Map info={data}/>}
      </Layout>
    </>
  );
};

export default App;
