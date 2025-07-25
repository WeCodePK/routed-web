import axios from "axios";
import React, { useState , useEffect} from "react";

function DriverList() {
  const [addDriverModal, setAddDriverModal] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [passport, setPassport] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [driverInfoModal, setDriverInfoModal] = useState(false);
  const [drivers, setDrivers] = useState([]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!contact.trim() || contact.length < 11)
      newErrors.contact = "Valid 11 digit contact # is required";
    if (!passport.trim()) newErrors.passport = "Passport # is required";
    if (!cnic.trim() || cnic.length !== 13)
      newErrors.cnic = "Valid 13 digit CNIC # is required";
    if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Valid email is required";
    if (!address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFields = () => {
    setName("");
    setEmail("");
    setContact("");
    setCnic("");
    setAddress("");
    setPassport("");
  };
const saveDriver = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!validateForm()) {
    setLoading(false);
    
    return;
  }

  try {
    const payload = {
      name,
      email,
      contact,
      cnic,
      passport,
      address,
    };

    console.log("Sending payload:", payload);

    const response = await axios.post(
      "http://localhost:5000/api/drivers/saveDriver",
      payload
    );

    if (response.status === 200 || response.status === 201) {
      alert("Driver saved successfully");
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
      const newErrors = {};

      if (status === "email") {
        newErrors.email = "Email is already registered";
      } else if (status === "passport") {
        newErrors.passport = "Passport is already registered";
      } else if (status === "cnic") {
        newErrors.cnic = "CNIC is already registered";
      }
      else if (status === "contact") {
        newErrors.contact = "contact is already registered";
      }

      setErrors(newErrors);
      return false;
    }

    console.error("Error saving driver:", error);
    alert("Something went wrong while saving the driver.");
    return false;
  }
};

const closedAddDriverModal = ()=>{
  setErrors({})
  setAddDriverModal(false);
}

  const getDriversData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/drivers/getDrivers");
      setDrivers(response.data.driver);
    } catch (error) {
      console.error("Save failed:", error.response?.data || error.message);
      alert("Route not get! " + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    getDriversData();
  }, []);

  const openDriverInfoModal = (driver)=>{
      setName(driver.name ? driver.name : "Loading");
      setEmail(driver.email ? driver.email : "Loading");
      setContact(driver.contact ? driver.contact : "Loading");
      setCnic(driver.cnic ? driver.cnic : "Loading");
      setPassport(driver.passport ? driver.passport : "Loading");
      setAddress(driver.address ? driver.address : "Loading");

      setDriverInfoModal(true);
  }
  const closeDriverInfoModal = ()=>{
    resetFields();
    setDriverInfoModal(false);
  }


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
      <div className="container">
        <table className="table table-striped table-hover  my-3 text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact#</th>
              <th>Address</th>
              <th>Cnic</th>
              <th>Passport</th>
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
                    <td>{driver.email}</td>
                    <td>{driver.contact}</td>
                    <td>{driver.address}</td>
                    <td>{driver.cnic}</td>
                    <td>{driver.passport}</td>

                    <td>
                      <button
                        className="btn btn-outline-success btn-sm mx-1"
                        title="Edit"
                        onClick={() => alert("Edit Driver")}
                      >
                        <i class="fa-solid fa-user-pen"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm mx-1"
                        title="Decline"
                        onClick={() => alert("Delete Driver")}
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
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i class="fa-solid fa-user-plus me-2"></i>Add Driver
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closedAddDriverModal}
                ></button>
              </div>
              <div className="modal-body">
                <form class="row g-3">
                  <div class="col-md-6">
                    <label for="validationServer01" class="form-label">
                      <b>Name</b>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>

                  <div class="col-md-6">
                    <label for="validationServer02" class="form-label">
                      <b>Contact #</b>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.contact ? "is-invalid" : ""
                      }`}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.contact}</div>
                  </div>

                  <div class="col-md-6">
                    <label for="validationServer02" class="form-label">
                      <b>Passport #</b>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.passport ? "is-invalid" : ""
                      }`}
                      value={passport}
                      onChange={(e) => setPassport(e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.passport}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="validationServer02" class="form-label">
                      <b>Cnic #</b>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.cnic ? "is-invalid" : ""
                      }`}
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.cnic}</div>
                  </div>

                  <div class="col-md-5">
                    <label for="validationServerUsername" class="form-label">
                      <b>Email</b>
                    </label>
                    <div class="input-group has-validation">
                      <span class="input-group-text" id="inputGroupPrepend3">
                        @
                      </span>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div className="invalid-feedback">{errors.email}</div>
                    </div>
                  </div>

                  <div class="col-md-7">
                    <label for="validationServer03" class="form-label">
                      <b>Address</b>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.address}</div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={saveDriver}
                  disabled={loading}
                >
                  {loading === false ? (
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
                    <p><b>Driver Name:</b> {name}</p>
                  </div>
                  <div className="col-md-6">
                    <p><b>Driver Email:</b> {email}</p>
                  </div>
                  <div className="col-md-6">
                    <p><b>Driver Contact#:</b> {contact}</p>
                  </div>
                  <div className="col-md-6">
                    <p><b>Driver Cnic#:</b> {cnic}</p>
                  </div>
                  <div className="col-md-6">
                    <p><b>Driver Passport#:</b> {passport}</p>
                  </div>
                  <div className="col-md-6">
                    <p><b>Driver Address:</b> {address}</p>
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
    </div>
  );
}

export default DriverList;
