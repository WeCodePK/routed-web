import React from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div>
      <SideBar/>
          <div style={{ paddingTop: "70px" }}>
        <Outlet />
         </div>
    </div>
  )
}

export default Home
