import './App.css';
import DriverList from './pages/DriverList';
import RoutesManagement from './pages/RoutesManagement';
import Home from './pages/Home';
import { Routes, Route } from "react-router-dom";
import MainRoutesManagement from './pages/MainRoutesManagement';
import AssignRoutes from './pages/AssignRoutes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<div>Welcome to Routed Admin</div>} />
        <Route path="drivers" element={<DriverList />} />
        <Route path="routes" element={<RoutesManagement />} />
        <Route path="mainRoutes" element={<MainRoutesManagement />} />
        <Route path="assignRoutes" element={<AssignRoutes />} />
        
      </Route>
    </Routes>
  );
}

export default App;
