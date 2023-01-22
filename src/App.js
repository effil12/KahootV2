import React from 'react'
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Playerlogin from './components/Player-login';
import AdminSignUp from './components/AdminSignUp';
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import AdminLogin from './components/AdminLogin';
import NoContent from './components/NoContent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        {/*<Route path='/admin/signup'></Route> */}
        {/*<Route path='/admin/login'></Route> */}
        {/*<Route path='/admin'>
          {/*<Route index element={<Dashboard />} />
        </Route>*/}
        <Route path='/admin'>
          <Route index element={<AdminLogin />} />
          <Route path='signup' element={<AdminSignUp />} />
          <Route path='login' element={<AdminLogin />} />
        </Route>
        <Route path='*' element={<NoContent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
