import React, { useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ProtectRoutes } from './hooks/protectRoutes';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import WaterIntakeReport from './pages/WaterIntakeReport';

import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [sidebar, setSidebar] = useState(true);
  const location = useLocation();
  const { pathname } = location;

  return (
    <>
      <div className='app-container'>
        <div className='sidebar'>
          <NavBar setSidebar={setSidebar} pathname={pathname} />
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
            </Route>
          </Routes>
        </div>
      </div>
    </>
  )
}