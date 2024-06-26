import React, { useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ProtectRoutes } from './hooks/protectRoutes';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import WaterIntakeReport from './pages/WaterIntakeReport';

import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import WeightControlReport from './pages/WeightControlReport';

export default function App() {
  const [sidebar, setSidebar] = useState(true);
  const location = useLocation();
  const { pathname } = location;

  return (
    <>
      <div className='app-container'>
        <div className='sidebar'>
          <SideBar setSidebar={setSidebar} pathname={pathname} />
        </div>
        <div className={!sidebar ? "main" : "main sidebar-active"}>
          <Routes>
            <Route path='/' element={<Navigate to='home' exact />} />
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            <Route element={<ProtectRoutes />}>
              <Route path='/profile' element={<Dashboard />} />
              <Route path='/water-intake-report' element={<WaterIntakeReport />} />
              <Route path='/weight-control-report' element={<WeightControlReport />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  )
}