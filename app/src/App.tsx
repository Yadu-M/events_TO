import { Map } from "./Map/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";
import Layout from "./Layout";

export const App = () => {
  return (
    <>
      <Layout>{<Map  />}</Layout>
    </>
  );
};

export default App;
