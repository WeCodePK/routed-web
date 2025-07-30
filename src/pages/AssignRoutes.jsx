import React, { useState, useEffect } from "react";
import axios from "axios";
import RouteInfo from "../components/RouteInfo";
function AssignRoutes() {
  const [openAssignRouteModal, setOpenAssignRouteModal] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [singleRouteData, setSingleRouteData] = useState(null);
  const [totalDistance, setTotalDistance] = useState("");
  const [viewRouteModalOpen, setViewRouteModalOpen] = useState(false);
  const [points, setPoints] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
 const handleSelect = (incomingRoute) => {
  const newRoute = incomingRoute.route || incomingRoute; // handle both structures

  const alreadySelected = selectedRoutes.some(
    (route) => route.name === newRoute.name
  );

  if (alreadySelected) {
    alert(`${newRoute.name} is already selected!`);
  } else {
    console.log("new", newRoute);

    setSelectedRoutes((prevRoutes) => [...prevRoutes, newRoute]);
    setPoints(Array.isArray(newRoute.points) ? newRoute.points : []);
    setTotalDistance(newRoute.totalDistance || "0 km");
    setSingleRouteData(newRoute);
  }
};

  const token = localStorage.getItem("token");

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
  const getDriversData = async () => {
    try {
      const response = await axios.get(
        "https://routed-backend.wckd.pk/api/v0/drivers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDrivers(response.data.data.drivers);
    } catch (error) {
      console.error("Save failed:", error.response?.data || error.message);
      alert(
        "Driver not get! " + (error.response?.data?.error || error.message)
      );
    }
  };

  useEffect(() => {
    getDriversData();
  }, []);

  const deleteRoute = (indexToRemove) => {
    setSelectedRoutes((prevRoutes) =>
      prevRoutes.filter((_, index) => index !== indexToRemove)
    );
  };
  const closedAssignRouteModal = () => {
    setOpenAssignRouteModal(false);
    setSelectedRoutes([]);
    setSelectedDriver("");
  };
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
    setSingleRouteData(route);
    setViewRouteModalOpen(true);
  };
  const center =
    points.length > 0
      ? points[Math.floor(points.length / 2)].coords
      : [33.6844, 73.0479];

  return (
    <div>
      <h1 className="text-center mt-4">
        <i class="fa-solid fa-person-circle-plus me-2"></i>Assign Routes To
        Drivers
      </h1>
      <div className="d-flex justify-content-end container">
        <button
          type="button"
          className="btn btn-outline-dark mt-2"
          onClick={() => setOpenAssignRouteModal(true)}
        >
          <i className="fa-solid fa-person-circle-plus me-2"></i>Assign New
          Route
        </button>
      </div>

      <div className="container table-responsive">
        <table className="table table-striped table-hover mt-3 text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Driver Name</th>
              <th>Routes Name</th>
            </tr>
          </thead>
          <tbody>
            {/* {Array.isArray(routes) && routes.length > 0 ? (
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
            )} */}
          </tbody>
        </table>
      </div>

      {openAssignRouteModal && (
        <>
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Assign Route</h4>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closedAssignRouteModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    {/* Left side: Buttons */}
                    <div className="col-md-4">
                      {/* Driver Dropdown */}
                      <div className="dropdown w-100 mb-3">
                        <button
                          className="btn btn-primary dropdown-toggle w-100"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Select Driver
                        </button>
                        <ul className="dropdown-menu w-100">
                          {drivers.map((driver, index) => (
                            <li key={index}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => setSelectedDriver(driver.name)}
                              >
                                {driver.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Route Dropdown */}
                      <div className="dropdown w-100">
                        <button
                          className="btn btn-primary dropdown-toggle w-100"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Select Route
                        </button>
                        <ul className="dropdown-menu w-100">
                          {routes.map((route, index) => (
                            <li key={route._id || index}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() =>
                                  handleSelect({
                                  route

                                  })
                                }
                              >
                                {route.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right side: Summary */}
                    <div className="col-md-8">
                      <div className="border p-3 rounded bg-light h-100">
                        <h5 className="text-center">Summary</h5>
                        <p>
                          <strong>Selected Driver:</strong>{" "}
                          {selectedDriver
                            ? selectedDriver
                            : "No driver selected"}
                        </p>
                        <p>
                          <strong>Assigned Routes:</strong>
                          <br />

                          <div
                            style={{ maxHeight: "250px", overflowY: "auto" }}
                          >
                            <table className="table table-striped table-hover mt-3 text-center">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Selected Routes</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(selectedRoutes) &&
                                selectedRoutes.length > 0 ? (
                                  selectedRoutes.map((route, index) => (
                                    <tr key={route._id}>
                                      <td>{index + 1}</td>
                                      <td>{route.name}</td>
                                      <td>
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
                                          <i class="fa-solid fa-location-arrow"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="7" className="text-center">
                                      No Selected Routes
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-danger"
                    onClick={closedAssignRouteModal}
                  >
                    <i class="fa-solid fa-xmark me-2"></i>
                    Close
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => alert("Chnage saving")}
                  >
                    <i class="fa-solid fa-check me-2"></i>
                    Assign Route
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {viewRouteModalOpen && singleRouteData && (
        <RouteInfo
          singleRouteData={singleRouteData}
          setViewRouteModalOpen={setViewRouteModalOpen}
          points={points}
          routePath={routePath}
          totalDistance={totalDistance}
          center={center}
        />
      )}
    </div>
  );
}

export default AssignRoutes;
