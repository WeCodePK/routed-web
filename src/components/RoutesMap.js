import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";

function ClickHandler({ setPoints }) {
  useMapEvents({
    click(e) {
      setPoints(prev => [...prev, [e.latlng.lng, e.latlng.lat]]); // note: lng, lat (OSRM expects this order)
    },
  });
  return null;
}

function RoutesMap() {
  const [points, setPoints] = useState([]);
  const [roadRoute, setRoadRoute] = useState(null);

  useEffect(() => {
    const getRoute = async () => {
      if (points.length < 2) return;

      const coords = points.map(p => p.join(",")).join(";");
      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

      try {
        const res = await axios.get(url);
        const geo = res.data.routes[0].geometry.coordinates;
        const latlngs = geo.map(([lng, lat]) => [lat, lng]); // flip back for leaflet
        setRoadRoute(latlngs);
      } catch (err) {
        console.error("OSRM error:", err);
      }
    };

    getRoute();
  }, [points]);

  const handleClear = () => {
    setPoints([]);
    setRoadRoute(null);
  };

  return (
    <div>
      <MapContainer center={[31.5204, 74.3587]} zoom={6} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler setPoints={setPoints} />

        {/* Real road route */}
        {roadRoute && <Polyline positions={roadRoute} color="blue" />}

        {/* Show clicked markers */}
        {points.map(([lng, lat], idx) => (
          <Marker key={idx} position={[lat, lng]}>
            <Popup>Point {idx + 1}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="mt-3">
        <button
          onClick={handleClear}
          className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
        >
          Clear Route
        </button>
      </div>
    </div>
  );
}

export default RoutesMap;
