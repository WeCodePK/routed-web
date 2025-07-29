import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// 📍 Map click handler
function ClickHandler({ addPoint }) {
  useMapEvents({
    click(e) {
      addPoint(e.latlng);
    },
  });
  return null;
}

// 🔁 Map center updater
function MapUpdater({ center }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, 14);
  }, [center]);
  return null;
}

function RoutesManagement({ mode, data }) {
  const [points, setPoints] = useState(data?.points || []);
  const [routePath, setRoutePath] = useState([]);
  const [query, setQuery] = useState("");
  const [routeName, setRouteName] = useState(data?.name || "");
  const [routeDescription, setRouteDescription] = useState(data?.description || "");
  const [totalDistance, setTotalDistance] = useState(data?.totalDistance || null);
  const [center, setCenter] = useState([33.6844, 73.0479]);
  const token = localStorage.getItem("token")
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.points) {
      const enrichedPoints = data.points.map((point, index) => ({
        ...point,
        id: point.id ? String(point.id) : `${Date.now()}-${index}`,
      }));
      setPoints(enrichedPoints);
    }
  }, [data]);
  

  useEffect(() => {
    if (points.length < 2) return;

    const coords = points.map((p) => `${p.coords[1]},${p.coords[0]}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    axios.get(url)
      .then((res) => {
        const geo = res.data.routes[0].geometry.coordinates;
        const formatted = geo.map(([lng, lat]) => [lat, lng]);
        setRoutePath(formatted);

        const distanceInKm = (res.data.routes[0].distance / 1000).toFixed(2);
        setTotalDistance(distanceInKm);
      })
      .catch((err) => console.error("OSRM error:", err));
  }, [points]);

  const addPoint = (latlng) => {
    const newPoint = {
      id: Date.now().toString(),
      name: `Point ${points.length + 1}`,
      coords: [latlng.lat, latlng.lng],
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  const handleSaveRoutes = async () => {
    const pointsWithPosition = points.map((point, index) => ({
      name: point.name,
      coords: point.coords,
      position: index,
    }));

    const payload = {
      name: routeName,
      description: routeDescription,
      totalDistance: totalDistance,
      points: pointsWithPosition,
    };

    try {
      const response = await axios.post(
        "https://routed-backend.wckd.pk/api/v0/routes",
        payload,
         {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
      );
      alert("Route saved successfully!");
      navigate("/home/mainRoutes")
    } catch (error) {
      console.error("Save failed:", error.response?.data || error.message);
      alert("Route not saved! " + (error.response?.data?.error || error.message));
    }
  };

  const handleSearch = async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    } else {
      alert("Location not found!");
    }
  };

  const deletePoint = (id) => {
      if(points.length === 1){
      setTotalDistance(0)
    }
    setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));
  
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(points);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setPoints(reordered);
  };

  const handleClear = () => {
    if (window.confirm("Do you want to clear all routes?")) {
      setPoints([]);
      setRoutePath([]);
      setTotalDistance(0);
    }
  };

  const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="color: red; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

  return (
    <div className="row g-3 p-3">
      {/* Left Panel */}
      <div className="col-12 col-md-4">
        <div className="bg-white shadow p-4 rounded overflow-auto" style={{ maxHeight: "80vh" }}>
          <h2 className="text-lg font-semibold mb-3 mt-2 text-center">Route Details</h2>

          <label className="fw-bold mt-2">Route Name</label>
          <input
            type="text"
            className="form-control mt-1"
            placeholder="Enter Route Name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />

          <label className="fw-bold mt-2">Route Description</label>
          <textarea
            className="form-control mt-1"
            placeholder="Enter Short Description"
            value={routeDescription}
            onChange={(e) => setRouteDescription(e.target.value)}
          />

          <h5 className="font-semibold mb-2 mt-4 text-center">Route Points (Drag to Reorder)</h5>

          <div className="alert alert-info text-center">
            <strong>Total Distance:</strong> {totalDistance} km
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="points">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="list-unstyled">
                  {points.map((point, index) => (
                    <Draggable key={point.id} draggableId={point.id} index={index}>
                      {(provided) => (
                        <li
                          className="p-2 bg-light rounded shadow-sm d-flex justify-content-between align-items-center my-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {point.name}
                          <i
                            className="fa-solid fa-trash text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => deletePoint(point.id)}
                          ></i>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          {points.length > 0 && mode !== "edit" && (
            <>
              <button
                onClick={handleSaveRoutes}
                className="mt-2 w-100 btn btn-success"
              >
                <i className="fa-solid fa-circle-check me-2"></i>
                Save Route
              </button>

              <button
                onClick={handleClear}
                className="mt-2 w-100 btn btn-danger"
              >
                <i className="fa-solid fa-trash me-2"></i>
                Clear Route
              </button>
            </>
          )}
        </div>
      </div>

 
      <div className="col-12 col-md-8">
        {/* Search bar */}
      <div className="input-group mb-2">
  <input
    type="text"
    className="form-control"
    placeholder="Search street, area, city..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  <button className="btn btn-primary" onClick={handleSearch}>
    <i className="fa-solid fa-magnifying-glass-location"></i>
  </button>
</div>


        {/* Map */}
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: mode === "edit" ? "500px" : "550px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler addPoint={addPoint} />
          {routePath.length > 0 && (
            <Polyline positions={routePath} color="blue" />
          )}
          {points.map((point) => (
            <Marker position={point.coords} icon={customIcon}>
              <Tooltip permanent>{point.name}</Tooltip>
            </Marker>
          ))}
          <MapUpdater center={center} />
        </MapContainer>
      </div>
    </div>
  );
}

export default RoutesManagement;
