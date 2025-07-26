import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login from "../images/login.png";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const navigate = useNavigate();

  

  const loginRequest = async () => {
    setLoading(true)
    console.log("Login request started");

    if (loginEmail === "") {
      toast.warning("Email field cannot be empty!");
      console.log("Validation failed: email is empty");
       setLoading(false)
      return;
    }

    if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      toast.warning("Valid Email is required!");
      console.log("Validation failed: email is not valid format");
      setLoading(false)
      return;
    }

    if (loginPassword === "") {
      toast.warning("Password field cannot be empty!");
      console.log("Validation failed: password is empty");
      setLoading(false)
      return;
    }

    const payload = {
      email: loginEmail,
      password: loginPassword,
    };

    console.log("Sending login request with payload:", payload);

    try {
      const response = await axios.post(
        "https://routed-backend.wckd.pk/api/v0/auth/admin/login",
        payload
      );

      console.log("Server responded with:", response);

      if (response.status === 200) {
        toast.success("Login successfully!");
        navigate("/home")
        console.log("Login successful!");
        setLoading(false)
      }
    } catch (error) {
      console.log("Login failed with error:", error);
      

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        console.log("Server error message:", error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
        console.log("Unknown login failure");
      }
      setLoading(false)
    }
  };
   const forgotPasswordRequest = ()=>{
        if (!/\S+@\S+\.\S+/.test(forgetEmail)) {
      toast.warning("Valid Email is required!");
      setLoading(false)
      setForgotPasswordModal(false)
      return;
    }


   }
  return (
    <div className="container my-5">
      <ToastContainer />

      <div className="text-center mb-4">
        <h1 className="text-primary fw-bold">Welcome Back!</h1>
        <p className="lead">Please login to access your dashboard.</p>
      </div>

      <div className="d-flex justify-content-center">
        <div
          className="shadow-lg p-4 rounded-4 d-flex flex-column flex-md-row align-items-center w-100"
          style={{
            backgroundColor: "#f9f9f9",
            maxWidth: "900px",
            height: "auto",
          }}
        >
          <div className="text-center mb-4 mb-md-0" style={{ flex: 1 }}>
            <img
              src={login}
              alt="Login"
              className="img-fluid rounded-3"
              style={{ maxHeight: "350px" }}
            />
          </div>
          <div
            className="d-block d-md-none w-100 my-3"
            style={{
              height: "1px",
              backgroundColor: "#ccc",
            }}
          ></div>

          {/* Divider for Desktop (vertical line) */}
          <div
            className="d-none d-md-block"
            style={{
              width: "1px",
              backgroundColor: "#ccc",
              height: "90%",
              margin: "0 20px",
            }}
          ></div>

          <div className="px-md-4 w-100" style={{ flex: 1 }}>
            <h2 className="text-center mb-3">Login</h2>
            <p className="text-center text-muted">
              <b>Enter valid credentials to get access</b>
            </p>

            <label>Email</label>
            <input
              type="email"
              className="form-control mb-3"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Enter your email"
            />

            <label>Password</label>
            <input
              type="password"
              className="form-control mb-2"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <p
              className="d-flex justify-content-end text-secondary"
              style={{ cursor: "pointer" }}
              onClick={()=>setForgotPasswordModal(true)}
            >
              Forgot Password?
            </p>

            <button className="btn btn-primary w-100" onClick={loginRequest} disabled={loading}>

                 {loading === false ? (
                    <>
                       Login
                      
                    </>
                  ) : ( 
                    <>
                      Verifying...
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

      {
        forgotPasswordModal && (
            <>
                <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i class="fa-solid fa-key me-2"></i>Forgot Password
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={()=>setForgotPasswordModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                     <label>Email</label>
            <input
              type="email"
              className="form-control mb-3"
              value={forgetEmail}
              onChange={(e) => setForgetEmail(e.target.value)}
              placeholder="Enter your email"
            />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setForgotPasswordModal(false)}>
                    cancel
                </button>
                <button
                  className="btn btn-primary"
                 onClick={forgotPasswordRequest}
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
            </>
        )
      }
    </div>
  );
}

export default Login;
