import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RouteInfo from "../components/RouteInfo";

import "leaflet/dist/leaflet.css";
import RoutesManagement from "./RoutesManagement";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainRoutesManagement() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [singleRouteData, setSingleRouteData] = useState(null);
  const [editRouteData, setEditRouteData] = useState(null);
  const [viewRouteModalOpen, setViewRouteModalOpen] = useState(false);

  const [editTrigger, setEditTrigger] = useState(false);
  const [routeIndex, setRouteIndex] = useState("");

  const [openEditRouteModal, setOpenEditRouteModal] = useState(false);
  const token = localStorage.getItem("token");

  const handleaddRoutes = () => {
    navigate("/home/routes");
  };

  const getRoutes = async () => {
    try {
      const response = await axios.get(
        "https://routed-backend.wckd.pk/api/v0/routes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRoutes(response.data.data.routes);
    } catch (error) {
      console.error(
        "Get Routes failed:",
        error.response?.data || error.message
      );
      alert("Route not get! " + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    getRoutes();
  }, []);

  const openViewModal = (route) => {
    setSingleRouteData(route);
    setViewRouteModalOpen(true);
  };
  const deleteRoute = async (index) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this route?"
      );
      if (!confirmDelete) return;
      console.log("id", index);

      const response = await axios.delete(
        `https://routed-backend.wckd.pk/api/v0/routes/${index}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  const handleOpenEditRouteModal = (route, index) => {
    setEditRouteData(route);
    setRouteIndex(index);
    setOpenEditRouteModal(true);
  };

  const handleEditRoutes = () => {
    setEditTrigger(true);

    setTimeout(() => {
      setOpenEditRouteModal(false);
      getRoutes();
    }, 2000);
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="text-center mt-4">
        <i className="fa-solid fa-map-location-dot me-2"></i>Routes Management
      </h1>
      <div className="d-flex justify-content-end container">
        <button
          type="button"
          className="btn btn-outline-dark mt-2"
          onClick={handleaddRoutes}
        >
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
                  <td>
                    {new Date(route.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-success btn-sm mx-1"
                      onClick={() => handleOpenEditRouteModal(route, index)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm mx-1"
                      onClick={() => deleteRoute(index)}
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
        <RouteInfo
          viewRouteModalOpen={viewRouteModalOpen}
          singleRouteData={singleRouteData}
          setViewRouteModalOpen={setViewRouteModalOpen}
        />
      )}

      {openEditRouteModal && (
        <>
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Edit Route</h4>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpenEditRouteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <RoutesManagement
                    mode="edit"
                    data={editRouteData}
                    editTrigger={editTrigger}
                    setEditTrigger={setEditTrigger}
                    routeIndex={routeIndex}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => setOpenEditRouteModal(false)}
                  >
                    <i class="fa-solid fa-xmark me-2"></i>
                    Close
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleEditRoutes}
                  >
                    <i class="fa-solid fa-check me-2"></i>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MainRoutesManagement;
