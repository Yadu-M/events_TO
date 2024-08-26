import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import { getMapsApi } from '../api/google'

export const MapC = () => {
  const [key, setKey] = useState<string>()

  useEffect(() => {
    const fetchMapsKey = async () => {
      try {
        const apiObj = await getMapsApi() 
        setKey(apiObj?.key)
      } catch (error) {
        console.error((error as Error).message)
      }

    } 

    void fetchMapsKey()
  }, [])


  return (
    <div style={{padding: '1rem'}}>
      {key &&
        <APIProvider apiKey={key}>
          <Map 
            style={{width: '100vw', height: '100vh'}}
            defaultCenter={{lat: 22.54992, lng: 0}}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}          
          />
      </APIProvider>
      }
    </div>    
  );
}
