import axios from "axios";
import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";

function DriverList() {
  const [addDriverModal, setAddDriverModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setphone] = useState("");
  // const [passport, setPassport] = useState("");
  // const [cnic, setCnic] = useState("");
  // const [email, setEmail] = useState("");
  // const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [driverInfoModal, setDriverInfoModal] = useState(false);
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
      phone,
    
    };

    console.log("Sending payload:", payload);

    const response = await axios.post(
      "https://routed-backend.wckd.pk/api/v0/drivers",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

const closedAddDriverModal = ()=>{
  setErrors({})
  setAddDriverModal(false);
}

  const getDriversData = async () => {
    try {
      const response = await axios.get("https://routed-backend.wckd.pk/api/v0/drivers",{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDrivers(response.data.data.drivers);
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
      // setEmail(driver.email ? driver.email : "Loading");
      setphone(driver.phone ? driver.phone : "Loading");
      // setCnic(driver.cnic ? driver.cnic : "Loading");
      // setPassport(driver.passport ? driver.passport : "Loading");
      // setAddress(driver.address ? driver.address : "Loading");

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
                      <b>phone #</b>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      value={phone}
                      onChange={(e) => setphone(e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.phone}</div>
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
                    <p><b>Driver phone#:</b> {phone}</p>
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
