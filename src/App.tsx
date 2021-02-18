import { useEffect, useState } from "react";
import { MapContainer, Marker, Polygon, TileLayer, useMapEvents } from "react-leaflet";

function DrawedPolygon() {
  const [points, setPoints] = useState<any>([])

  useMapEvents({
    click(e) {
      setPoints([...points, [e.latlng.lat, e.latlng.lng]])
    },
  })

  function getCenterPosition(): [number, number] {
      let length = points.length
      let centLat = points.reduce((prev: number, curr: any) => prev + curr[0], 0) / length
      let centLng = points.reduce((prev: number, curr: any) => prev + curr[1], 0) / length
  
      return [centLat, centLng]
  }

  const positions = getCenterPosition()

  return points.length === 0 ? null : (
    <>
      <Marker position={positions} />
      <Polygon pathOptions={{color: 'blue'}} positions={points} />
    </>
  )
}

function AddressInput (props: any) {
  const url: string = 'https://nominatim.openstreetmap.org/search?format=json&q='

  const [results, setResults] = useState<any>(null)
  const [query, setQuery] = useState<string>('')
  const map = useMapEvents({})
  
  const onChangeInput = (e: any) => {
    setQuery(e.target.value) 
  }

  useEffect(() => {
    let handler = setTimeout(() => {
      if (query.length > 0) {
        fetch(url + query).then(res => res.json()).then(data => {
          setResults(data)
          map.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        })
      }
    }, 1000)

    return function () {
      clearTimeout(handler)
    }
  }, [query, map])

  return (
    <>
    {results && <DrawedPolygon />}
    <input className="input text-red-600 outline-none transition transition-all duration-500 ease-in-out focus:border-green-400 focus:text-green-600 absolute top-3 border-red-200 border-2 px-5 py-2 w-80 rounded-full" style={{zIndex: 999, left: "50%", transform: "translateX(-50%)"}} onChange={onChangeInput} type="text" />
    </>
  )
}

function App() {
  return (
    <div>
      <MapContainer className="h-screen" center={[-16.321807484604218, -48.95888686180115]} zoom={15} scrollWheelZoom={true}>
        <AddressInput />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default App;
