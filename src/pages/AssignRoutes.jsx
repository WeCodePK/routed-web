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
const [selectedRoute, setSelectedRoute] = useState(null);
const [showModal, setShowModal] = useState(false);

  const [assignments, setAssignments] = useState([]);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const handleSelect = (incomingRoute) => {
    const newRoute = incomingRoute.route || incomingRoute; // handle both structures

    const alreadySelected = selectedRoutes.some(
      (route) => route.id === newRoute.id
    );

    if (alreadySelected) {
      alert(`${newRoute.name} is already selected!`);
    } else {
      console.log("new", newRoute);

      setSelectedRoutes((prevRoutes) => [...prevRoutes, newRoute]);
      // setPoints(Array.isArray(newRoute.points) ? newRoute.points : []);
      // setTotalDistance(newRoute.totalDistance || "0 km");
      // setSingleRouteData(newRoute);
    }
  };

  const token = localStorage.getItem("token");
  const openviewRouteModal = (route) => {
    setSingleRouteData(route);
    setViewRouteModalOpen(true);
    setPoints(route.points || []);
    setRoutePath([]);
    setTotalDistance(route.totalDistance || "0 km");
  }

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

  const routeAssign = async () => {
    if (!selectedDriver) {
      alert("Please select a driver.");
      return;
    }
    if (selectedRoutes.length === 0) {
      alert("Please select at least one route.");
      return;
    }
    console.log("Selected Driver:", selectedDriver);

    const payload = {
      drivers: [selectedDriver.id],
      routes: selectedRoutes.map((route) => route._id || route.id),
    };

    try {
      const response = await axios.post(
        "https://routed-backend.wckd.pk/api/v0/assignments",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Routes assigned successfully!");
      setSelectedDriver(null)
      setSelectedRoutes([]);
      getAssignedRoutes();
      setOpenAssignRouteModal(false);
    } catch (error) {
      console.error(
        "Assignment failed:",
        error.response?.data || error.message
      );
      alert(
        "Route assignment failed! " +
          (error.response?.data?.error || error.message)
      );
    }
  };
  const handleRouteClick = (routeName) => {
  setSelectedRoute(routeName);
  setShowModal(true);
};


  const getAssignedRoutes = async () => {
    try {
      const response = await axios.get(
        "https://routed-backend.wckd.pk/api/v0/assignments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // setAssignedRoutes(
      //   response.data?.data?.assignments?.map(
      //     (assignment) => assignment.route
      //   ) || []
      // );

      // setAssignedDrivers(
      //   response.data?.data?.assignments?.map(
      //     (assignment) => assignment.driver
      //   ) || []
      // );
      setAssignments(response.data?.data?.assignments || []);
      alert("Assigned Routes fetched successfully!");
    } catch (error) {
      console.error(
        "Assignment failed:",
        error.response?.data || error.message
      );
      alert(
        "Route assignment failed! " +
          (error.response?.data?.error || error.message)
      );
    }
  };
  useEffect(() => {
    getAssignedRoutes();
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

     
const groupedDrivers = {};

assignments?.forEach((assignment) => {
  const driverId = assignment.driver.id;
  if (!groupedDrivers[driverId]) {
    groupedDrivers[driverId] = {
      id: driverId,
      name: assignment.driver.name,
      phone: assignment.driver.phone,
      routes: [assignment.route],
    };
  } else {
    groupedDrivers[driverId].routes.push(assignment.route);
  }
});

const groupedList = Object.values(groupedDrivers);


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
              <th>Phone</th>
              <th>Routes Assigned</th>
            </tr>
          </thead>
          <tbody>
          {groupedList.length > 0 ? (
  groupedList.map((driver, index) => (
    <tr key={driver.id}>
      <td>{index + 1}</td>
      <td>{driver.name}</td>
      <td>{driver.phone}</td>
      <td>
  {driver.routes.map((route, idx) => (
    <button key={idx} className="btn btn-sm btn-outline-dark me-1 mb-1" onClick={() => handleRouteClick(route)}>
      {route?.name}
    </button>
  ))}
</td>

    </tr>
  ))
) : (
  <tr>
    <td colSpan="4" className="text-center">
      No assignments found
    </td>
  </tr>
)}


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
                                onClick={() => setSelectedDriver(driver)}
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
                                    route,
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
                        {selectedDriver ? (
                          <p>
                            <strong>Selected Driver:</strong>{" "}
                            {selectedDriver.name} <br />
                            <strong>Phone:</strong> {selectedDriver.phone}
                          </p>
                        ) : (
                          <p>
                            <strong>Selected Driver:</strong> No driver selected
                          </p>
                        )}

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
                                          onClick={() => openviewRouteModal(route)}
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
                  <button className="btn btn-success" onClick={routeAssign}>
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

     {showModal && (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(0px)',
    }}
  >
    <div className="modal-dialog modal-sm modal-dialog-centered">
      <div className="modal-content shadow" style={{ borderRadius: '10px' }}>
        <div className="modal-header text-light py-2 px-3" style={{ backgroundColor: "#1e1e2f"}}>
          <h6 className="modal-title m-0">
            <i className="fa-solid fa-route me-2"></i>
            	Route: <strong>{selectedRoute.name}</strong>
          </h6>
         <button
  type="button"
  className="btn-close btn-close-white"
  aria-label="Close"
  onClick={() => setShowModal(false)}
></button>

        </div>
        <div className="modal-body text-center">
          <p className="mb-3">What would you like to do?</p>
          <button
            className="btn btn-outline-primary w-100 mb-2"
            onClick={() => {
              setShowModal(false);
              console.log('Viewing on map:', selectedRoute.name);
            }}
          >
            <i className="fa-solid fa-map-location-dot me-2"></i> See on Map
          </button>
          <button
            className="btn btn-outline-danger w-100"
            onClick={() => {
              setShowModal(false);
              console.log('Unassigning route:', selectedRoute.name);
            }}
          >
            <i className="fa-solid fa-trash-can me-2"></i> Unassign
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default AssignRoutes;
