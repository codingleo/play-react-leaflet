import { useState } from "react";
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
function App() {
  return (
    <MapContainer className="h-80" center={[-16.321807484604218, -48.95888686180115]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DrawedPolygon />
    </MapContainer>
  );
}

export default App;
