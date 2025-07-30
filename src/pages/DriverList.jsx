import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import driver from "../images/driver.png";

function DriverList() {
  const [addDriverModal, setAddDriverModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setphone] = useState("");
   const [driverIndex, setDriverIndex] = useState("");
  // const [cnic, setCnic] = useState("");
  // const [email, setEmail] = useState("");
  // const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [driverInfoModal, setDriverInfoModal] = useState(false);
  const [driverEditModal, setDriverEditModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim() || phone.length < 11)
      newErrors.phone = "Valid 11 digit phone # is required";
    // if (!passport.trim()) newErrors.passport = "Passport # is required";
    // if (!cnic.trim() || cnic.length !== 13)
    //   newErrors.cnic = "Valid 13 digit CNIC # is required";
    // if (!/\S+@\S+\.\S+/.test(email))
    //   newErrors.email = "Valid email is required";
    // if (!address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFields = () => {
    setName("");
    // setEmail("");
    setphone("");
    // setCnic("");
    // setAddress("");
    // setPassport("");
  };
  const payload = {
    name,
    phone,
  };
  const saveDriver = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);

      return;
    }

    try {
      console.log("Sending payload:", payload);

      const response = await axios.post(
        "https://routed-backend.wckd.pk/api/v0/drivers",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Driver saved successfully");
        getDriversData();
        resetFields();
        setAddDriverModal(false);
        setLoading(false);
        return true;
      } else {
        alert("Unexpected server response");
        setLoading(false);
        return false;
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.status === 400) {
        const status = error.response.data?.status;
        return false;
      }

      console.error("Error saving driver:", error);
      alert("Something went wrong while saving the driver.");
      return false;
    }
  };

  const closedAddDriverModal = () => {
    setErrors({});
    setAddDriverModal(false);
  };

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

  const openDriverInfoModal = (driver) => {
    setName(driver.name ? driver.name : "Loading");
    // setEmail(driver.email ? driver.email : "Loading");
    setphone(driver.phone ? driver.phone : "Loading");
    // setCnic(driver.cnic ? driver.cnic : "Loading");
    // setPassport(driver.passport ? driver.passport : "Loading");
    // setAddress(driver.address ? driver.address : "Loading");

    setDriverInfoModal(true);
  };
  const closeDriverInfoModal = () => {
    resetFields();
    setDriverInfoModal(false);
  };
  const hndleDeleteDriver = async (driverId) => {
    console.log("Deleting driver with ID:", driverId);

    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        const response = await axios.delete(
          `https://routed-backend.wckd.pk/api/v0/drivers/${driverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          alert("Driver deleted successfully");
          getDriversData();
        } else {
          alert("Failed to delete driver");
        }
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert("Something went wrong while deleting the driver.");
      }
    }
  };

  const openEditModal = (driver, index) => {
    setName(driver.name); 
    setphone(driver.phone);
    setDriverIndex(driver.id);
     setDriverEditModal(true);
  }

 const handleEditDriver = async () => {
 
  setLoading(true); 
  console.log("Editing driver with ID:", driverIndex);
  


  try {
    const response = await axios.put(
      `https://routed-backend.wckd.pk/api/v0/drivers/${driverIndex}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      alert("Driver updated successfully");
      getDriversData(); // Refresh updated list
      setDriverEditModal(false);
    } else {
      alert("Unexpected server response");
    }
  } catch (error) {
    console.error("Error updating driver:", error);
    alert("Failed to update driver.");
  } finally {
    setLoading(false); // End loading
  }
};

  const closeDriverEditModal = () => {
    setDriverEditModal(false);
  };

  return (
    <div>
      <h1 className="text-center mt-4">
        <i class="fa-solid fa-users me-2"></i>Driver List
      </h1>
      <div className="d-flex justify-content-end container">
        <button
          type="button"
          className="btn btn-outline-dark mt-2"
          onClick={() => setAddDriverModal(true)}
        >
          <i class="fa-solid fa-user-plus me-2"></i>Add Driver
        </button>
      </div>
      <div className="container table-responsive">
        <table className="table table-striped table-hover  my-3 text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>phone#</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(drivers) && drivers.length > 0 ? (
              drivers.map((driver, index) => {
                return (
                  <tr key={driver._id}>
                    <td>{index + 1}</td>

                    <td>{driver.name}</td>
                    <td>{driver.phone}</td>
                    <td>
                      <button
                        className="btn btn-outline-success btn-sm mx-1"
                        title="Edit"
                        onClick={() => openEditModal(driver, index)}
                      >
                        <i class="fa-solid fa-user-pen"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm mx-1"
                        title="Decline"
                        onClick={() => hndleDeleteDriver(index)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm mx-1"
                        title="Details"
                        onClick={() => openDriverInfoModal(driver)}
                      >
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Driver Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {addDriverModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg rounded-4">
              {/* Modal Header */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fa-solid fa-user-plus me-2"></i> Add New Driver
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closedAddDriverModal}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body px-4 py-4">
                <div className="row align-items-center">
                  <h3 className="text-center text-primary mb-3">
                    Driver Information
                  </h3>
                  {/* Left Image + Text */}
                  <div className="col-md-6 rouded text-center mb-3 mb-md-0">
                    <img
                      src={driver}
                      alt="Driver"
                      className="img-fluid  mb-2 "
                      style={{
                        width: "250px",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                    <p className="text-muted small">
                      "Every route tells a story — let's make it a good one."
                    </p>
                  </div>

                  {/* Form Section */}
                  <div className="col-md-6">
                    <form className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          <b>Name</b>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          value={name}
                          placeholder="Enter driver's name"
                          onChange={(e) => setName(e.target.value)}
                        />
                        <div className="invalid-feedback">{errors.name}</div>
                      </div>

                      <div className="col-md-12">
                        <label className="form-label">
                          <b>Phone #</b>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.phone ? "is-invalid" : ""
                          }`}
                          value={phone}
                          placeholder="e.g., 0300-1234567"
                          onChange={(e) => setphone(e.target.value)}
                        />
                        <div className="invalid-feedback">{errors.phone}</div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-primary w-100 py-2"
                  onClick={saveDriver}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Saving...
                      <div
                        className="spinner-border spinner-border-sm text-light ms-2"
                        role="status"
                      ></div>
                    </>
                  ) : (
                    <>
                      Save Driver <i className="fas fa-user ms-2"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {driverInfoModal && (
        <>
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i class="fa-solid fa-user-tie me-2"></i>Driver Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDriverInfoModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <p>
                        <b>Driver Name:</b> {name}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <b>Driver phone#:</b> {phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={closeDriverInfoModal}
                  >
                    Closed
                    {/* {loading === false ? (
                    <>
                      Submit
                      <i className="fas fa-paper-plane ms-2"></i>
                    </>
                  ) : ( 
                    <>
                      Submitting...
                      <div
                        className="spinner-border spinner-border-sm text-dark ms-2"
                        role="status"
                      ></div>
                    </>
                  )} */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {driverEditModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i class="fa-solid fa-user-pen me-2"></i>Edit Driver
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDriverEditModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Edit form goes here */}
                <div className="col-md-12">
                  <form className="row g-3">
                    <div className="col-md-12">
                      <label className="form-label">
                        <b>Name</b>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        value={name}
                        placeholder="Enter driver's name"
                        onChange={(e) => setName(e.target.value)}
                      />
                      <div className="invalid-feedback">{errors.name}</div>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">
                        <b>Phone #</b>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        value={phone}
                        placeholder="e.g., 0300-1234567"
                        onChange={(e) => setphone(e.target.value)}
                      />
                      <div className="invalid-feedback">{errors.phone}</div>
                    </div>
                  </form>
                </div>
              </div>
               <div className="modal-footer">
        <button
          className="btn btn-primary w-100 py-2"
          onClick={handleEditDriver}
          disabled={loading}
        >
          {loading ? (
            <>
              Changing...
              <div
                className="spinner-border spinner-border-sm text-light ms-2"
                role="status"
              ></div>
            </>
          ) : (
            <>
              Save Changing <i className="fas fa-user ms-2"></i>
            </>
          )}
        </button>
      </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverList;
