import React, { use, useState } from "react";
 import { useNavigate, Link } from "react-router-dom";
 const navigate = useNavigate();
function SideBar() {

     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const bgColor = "rgb(9, 28, 50)";
  const textColor = "#FF9800";

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const navigate = useNavigate();



  return (
    <div>
         <div>
      {/* Top Navbar */}
      <nav
        className="navbar navbar-dark px-3"
        style={{
          height: "70px",
          backgroundColor: bgColor,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000, // makes sure it stays above other elements
        }}
      >
        {isDrawerOpen ? (
          ""
        ) : (
          <button
            className="btn"
            type="button"
            onClick={toggleDrawer}
            style={{
              color: bgColor, // orange color for icon/text
              backgroundColor: textColor, // navy background (optional)
              border: "none", // remove border if needed
              padding: "8px 12px", // better spacing
              borderRadius: "8px", // smooth corners
            }}
          >
            <i className="fas fa-bars"></i>
          </button>
        )}

        <span
          className="navbar-brand mb-0 h5 ms-3 fw-bold"
          style={{ color: textColor }}
        >
          Admin Routed
        </span>
      </nav>

      {/* Sidebar Drawer */}
      <div
        className={`drawer ${isDrawerOpen ? "open" : ""}`}
        style={{
          width: "250px",
          backgroundColor: bgColor,
          position: "fixed",
          top: 0,
          left: 0,
          height: "635px",
          zIndex: 1000,
          marginTop: "80px",
          marginLeft: isDrawerOpen ? "08px" : "",
          borderRadius: "15px", // ✅ rounded corners
          transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.7s ease-in-out",
        }}
      >
        {/* Header */}
        <div
          className="drawer-header p-3 d-flex justify-content-between align-items-center"
          style={{ backgroundColor: bgColor, borderRadius: "15px" }}
        >
          <div className="d-flex align-items-center">
            {/* Profile Picture
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "100%",
                overflow: "hidden",
                border: "2px solid #FF9800",
              }}
              className="p-1"
            >
              <img
                src={dp} // Replace with your DP URL
                alt="User DP"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div> */}

            {/* Name & Role to the Right */}
            <div className="ms-3">
              <h6 className="mb-0 fw-bolder" style={{ color: textColor }}>
                Burhan Ali
              </h6>{" "}
              {/* Name */}
              <small className="text-secondary">Admin</small> {/* Role */}
            </div>
          </div>

          {isDrawerOpen && (
            <button
              type="button"
              onClick={toggleDrawer}
              className="d-flex align-items-center"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                borderRadius: "20%", // circular
                width: "30px",
                height: "30px",
                justifyContent: "center",
                backgroundColor: textColor, // ✅ navy blue background
                border: "none",
                color: bgColor, // ✅ orange icon color
                cursor: "pointer",
              }}
            >
              <i className="fas fa-angle-left"></i>
            </button>
          )}
        </div>
        <hr
          className="mx-3"
          style={{
            borderTop: "2px solid #FF9800",
            opacity: 1,
            marginTop: "-0px",
            color: "#FF9800",
          }}
        />

        {/* Body */}
        <div className="drawer-body p-0">
          <ul className="list-unstyled m-0 p-0 ">
            <li className="nav-item">
              <Link
                to="/signup"
                className="d-flex align-items-center py-3 px-4 text-decoration-none "
                onClick={toggleDrawer}
                style={{ color: textColor }}
              >
                <i class="fa-solid fa-house me-2"></i>
                Dashboard
              </Link>
            </li>

          
            <li>
              <Link
                to="/mainRoutes"
                className="d-flex align-items-center py-3 px-4 text-decoration-none "
                style={{ color: textColor }}
                onClick={toggleDrawer}
              >
                	<i class="fas fa-route me-2"></i>
                Routes Management
              </Link>
            </li>
            <li>
              <Link
                to="/assignRoutes"
                className="d-flex align-items-center py-3 px-4  text-decoration-none "
                style={{ color: textColor }}
                onClick={toggleDrawer}
              >
                <i class="fas fa-map-marked-alt me-2"></i>
                Assign Route
              </Link>
            </li>
            <li>
              <Link
                to="/drivers"
                className="d-flex align-items-center py-3 px-4 text-decoration-none "
                style={{ color: textColor }}
                onClick={toggleDrawer}
              >
                	<i class="fas fa-users me-2"></i>
                Driver List
              </Link>
            </li>
                 <li>
              <Link
                to="/diver"
                className="d-flex align-items-center py-3 px-4 text-decoration-none "
                style={{ color: textColor }}
                onClick={toggleDrawer}
              >
                
                		<i class="fas fa-map me-2"></i>
                Driver Tracking
              </Link>
            </li>
            <li>
                  <li>
              <Link
                to="/students"
                className="d-flex align-items-center py-3 px-4 text-decoration-none"
                style={{ color: textColor }}
                onClick={toggleDrawer}
              >
                <i class="fa-solid fa-bell me-2"></i>
                Violation Alerts
              </Link>
            </li>
              <Link
                to="/profile"
                className="d-flex align-items-center py-3 px-4  text-decoration-none "
                style={{ color: textColor }}
                onClick={toggleDrawer}
              >
                	<i class="fas fa-user-cog me-2"></i>
                Profile Setting
              </Link>
            </li>
            <hr
              className="mx-3"
              style={{
                borderTop: "2px solid #FF9800",
                opacity: 1,
                marginTop: "-0px",
                color: "#FF9800",
              }}
            />
            <li>
              <Link
                to="/"
                className="d-flex align-items-center py-3 px-4  text-decoration-none"
                style={{ color: textColor }}
              >
                	<i class="fas fa-sign-out-alt me-2"></i>
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay when drawer is open */}
      {isDrawerOpen && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            zIndex: 999,
          }}
          onClick={toggleDrawer}
        />
      )}

      {/* Add some styles */}
      <style>{`
        .drawer {
          box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        }
        .drawer-body a:hover {
          background-color: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
    </div>
  )
}

export default SideBar
