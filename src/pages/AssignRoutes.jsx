import React, { useState } from "react";

function AssignRoutes() {
  const [openAssignRouteModal, setOpenAssignRouteModal] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  const handleSelect = (newRoute) => {
  const alreadySelected = selectedRoutes.some(
    (route) => route._id === newRoute._id
  );
  if (alreadySelected) {
    alert(`${newRoute.name} is already selected!`);
  } else {
    setSelectedRoutes((prevRoutes) => [...prevRoutes, newRoute]);
  }
};


  const deleteRoute = (indexToRemove) => {
    setSelectedRoutes((prevRoutes) =>
      prevRoutes.filter((_, index) => index !== indexToRemove)
    );
  };
  const closedAssignRouteModal = ()=>{
      setOpenAssignRouteModal(false);
  setSelectedRoutes([]);
  setSelectedDriver("")
  }

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

      <div className="container">
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
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => setSelectedDriver("Ali Khan")}
                            >
                              Ali Khan
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => setSelectedDriver("Burhan Ali")}
                            >
                              Burhan Ali
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => setSelectedDriver("Zain Ahmed")}
                            >
                              Zain Ahmed
                            </button>
                          </li>
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
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handleSelect({ name: "Route 1", _id: "1" })
                              }
                            >
                              Route 1
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handleSelect({ name: "Route 2", _id: "2" })
                              }
                            >
                              Route 2
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handleSelect({ name: "Route 3", _id: "3" })
                              }
                            >
                              Route 3
                            </button>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handleSelect({ name: "Route 4", _id: "4" })
                              }
                            >
                              Route 4
                            </button>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handleSelect({ name: "Route 5", _id: "5" })
                              }
                            >
                              Route 5
                            </button>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handleSelect({ name: "Route 6", _id: "6" })
                              }
                            >
                              Route 6
                            </button>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handleSelect({ name: "Route 7", _id: "7" })
                              }
                            >
                              Route 7
                            </button>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handleSelect({ name: "Route 8", _id: "8" })
                              }
                            >
                              Route 8
                            </button>
                          </li>
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
                       
                            <div style={{ maxHeight: "250px", overflowY: "auto" }}>
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
                                        //onClick={() => openViewModal(route)}
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
                      <button className="btn btn-success" onClick={() => alert("Chnage saving")}>
                    <i class="fa-solid fa-check me-2"></i>
                  Assign Route
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

export default AssignRoutes;
