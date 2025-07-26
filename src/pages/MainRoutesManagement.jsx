import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RoutesManagement from "./RoutesManagement";


  const customIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="color: red; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

function ClickHandler({ addPoint }) {
  useMapEvents({
    click(e) {
      addPoint(e.latlng);
    },
  });
  return null;
}

// 📌 Map centering helper
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center]);
  return null;
}

function MainRoutesManagement() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [singleRouteData, setSingleRouteData] = useState(null);
  const [editRouteData, setEditRouteData] = useState(null);
  const [viewRouteModalOpen, setViewRouteModalOpen] = useState(false);
  const [points, setPoints] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [totalDistance, setTotalDistance] = useState("");
  const [openEditRouteModal, setOpenEditRouteModal] = useState(false);

  const handleaddRoutes = () => {
    navigate("/home/routes");
  };

  const getRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/routes/getRoutes");
      setRoutes(response.data.route);
    } catch (error) {
      console.error("Save failed:", error.response?.data || error.message);
      alert("Route not get! " + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    getRoutes();
  }, []);
  


  useEffect(() => {
    if (!viewRouteModalOpen || points.length < 2) return;

    const coords = points.map((p) => `${p.coords[1]},${p.coords[0]}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    axios
      .get(url)
      .then((res) => {
        const geo = res.data.routes[0].geometry.coordinates;
        const formatted = geo.map(([lng, lat]) => [lat, lng]);
        setRoutePath(formatted);

        const distanceInMeter = res.data.routes[0].distance;
        const distanceInKm = (distanceInMeter / 1000).toFixed(2);
        setTotalDistance(distanceInKm);
      })
      .catch((err) => console.error("OSRM error:", err));
  }, [viewRouteModalOpen, points]);

  const openViewModal = (route) => {
    setPoints(route.points);
    setSingleRouteData(route);
    setViewRouteModalOpen(true);
  };
 const deleteRoute = async (route) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this route?");
    if (!confirmDelete) return;

    const response = await axios.delete(`http://localhost:5000/api/routes/deleteRoute/${route._id}`);

    if (response.status === 200) {
      alert("Route deleted successfully");
      getRoutes();
      
    } else {
      alert("Failed to delete the route.");
    }

  } catch (error) {
    console.error("Error deleting route:", error);
    alert("Something went wrong while deleting the route.");
  }
};

const handleOpenEditRouteModal = (route)=>{
    setEditRouteData(route);
    setOpenEditRouteModal(true)
}



  const center =
    points.length > 0
      ? points[Math.floor(points.length / 2)].coords
      : [33.6844, 73.0479]; 

  return (
    <div>
      <h1 className="text-center mt-4">
        <i className="fa-solid fa-map-location-dot me-2"></i>Routes Management
      </h1>
      <div className="d-flex justify-content-end container">
        <button type="button" className="btn btn-outline-dark mt-2" onClick={handleaddRoutes}>
          <i className="fa-solid fa-route me-2"></i>Add Route
        </button>
      </div>

      <div className="container table-responsive">
        <table className="table table-striped table-hover mt-3 text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Total Distance</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(routes) && routes.length > 0 ? (
              routes.map((route, index) => (
                <tr key={route._id}>
                  <td>{index + 1}</td>
                  <td>{route.name}</td>
                  <td>{route.description}</td>
                  <td>{route.totalDistance}</td>
                  <td>{new Date(route.createdAt).toLocaleDateString("en-GB")}</td>
                  <td>
                    <button
                      className="btn btn-outline-success btn-sm mx-1"
                      onClick={() => handleOpenEditRouteModal(route)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm mx-1"
                      onClick={() => deleteRoute(route)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm mx-1"
                      onClick={() => openViewModal(route)}
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Routes Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewRouteModalOpen && singleRouteData && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Route</h5>
                <button type="button" className="btn-close" onClick={() => setViewRouteModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <h3 className="text-center fw-bold">
                  <i className="fa-solid fa-route me-2"></i>Route Details
                </h3>
                <div className="row mt-4">
                  <div className="col-md-3">
                    <p><b>Route Name:</b> {singleRouteData.name}</p>
                  </div>
                  <div className="col-md-3">
                    <p><b>Route Description:</b> {singleRouteData.description}</p>
                  </div>
                  <div className="col-md-3">
                    <p><b>Route Total Distance:</b> {totalDistance || singleRouteData.totalDistance} km</p>
                  </div>
                  <div className="col-md-3">
                    <p><b>Route Creation:</b> {new Date(singleRouteData.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>

                <div style={{ height: "400px" }} className="mt-3">
                  <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler addPoint={() => {}} />
                    <MapUpdater center={center} />

                    {routePath.length > 0 && <Polyline positions={routePath} color="blue" />}
                    {points.map((point) => (
                      <Marker key={point.name} position={point.coords} icon={customIcon}>
                        <Tooltip permanent>{point.name}</Tooltip>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewRouteModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {
        openEditRouteModal &&(
            <>
             <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-fullscreen">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Route</h4>
                <button type="button" className="btn-close" onClick={() => setOpenEditRouteModal(false)}></button>
              </div>
              <div className="modal-body">
                <RoutesManagement mode = "edit" data = {editRouteData}/>
              </div>

              <div className="modal-footer">
                 <button className="btn btn-danger" onClick={() => setOpenEditRouteModal(false)}>
                    <i class="fa-solid fa-xmark me-2"></i>
                  Close
                </button>
                <button className="btn btn-success" onClick={() => alert("Chnage saving")}>
                    <i class="fa-solid fa-check me-2"></i>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
            </>
        )
      }
    </div>
  );
}

export default MainRoutesManagement;
