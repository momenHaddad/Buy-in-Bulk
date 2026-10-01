/*
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/Register';
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from './admin/AdminDashboard';
import Navbar from './Navbar/Navbar';
import UserDashboard from './user/UserDashboard';
import React from 'react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
            <div className="pages">
              <Navbar/>
                <Routes>
                    <Route path="/" element={<Navigate to="/login"/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/admin" element={<AdminDashboard/>} />
                    <Route path="/UserDashboard" element={<UserDashboard/>} />
                </Routes>
            </div>
        </AuthProvider>
      </BrowserRouter>
        
    </div>
  );
}

export default App;
*/


import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/Register';
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from './admin/AdminDashboard';
import Navbar from './Navbar/Navbar';
import UserDashboard from './user/UserDashboard';
import React from 'react';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>  {/* Corrected BrowserRouter */}
        <AuthProvider>
          <div className="pages">
            <Routes>  {/* Updated Routes usage */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/UserDashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

