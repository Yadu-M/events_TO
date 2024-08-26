import './App.css'
import { MapC } from './Components/MapC'
import Layout from './Layout'

function App() {
  return (
    <>
      <Layout>
        <main>
          <h1 style={{
            paddingLeft: "1rem"
          }}>Realtime mapping of Festivals across TO</h1>
          <MapC />
        </main>
      </Layout>
    </>
  )
}

export default App
