import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import login from "../images/login.png"

function Login() {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

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
          style={{ backgroundColor: "#f9f9f9", maxWidth: "900px",  height: "auto"}}
        >
         
          <div className="text-center mb-4 mb-md-0" style={{ flex: 1 }}>
            <img
              src={login}
              alt="Login"
              className="img-fluid rounded-3"
              style={{ maxHeight: '350px' }}
            />
          </div>
          <div className="d-block d-md-none w-100 my-3" style={{
  height: '1px',
  backgroundColor: '#ccc'
}}></div>

{/* Divider for Desktop (vertical line) */}
<div className="d-none d-md-block" style={{
  width: '1px',
  backgroundColor: '#ccc',
  height: '90%',
  margin: '0 20px'
}}></div>

          <div className="px-md-4 w-100" style={{ flex: 1 }}>
            <h2 className="text-center mb-3">Login</h2>
            <p className="text-center text-muted"><b>Enter valid credentials to get access</b></p>

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
              className="form-control mb-4"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter your password"
            />

            <button className="btn btn-primary w-100">Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
