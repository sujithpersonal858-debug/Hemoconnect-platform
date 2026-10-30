import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { SearchDonors } from './pages/SearchDonors';
import { EmergencySOS } from './pages/EmergencySOS';
import { HospitalDirectory } from './pages/HospitalDirectory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DonorDashboard } from './pages/DonorDashboard';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { AdminPortal } from './pages/AdminPortal';
import { Unauthorized } from './pages/Unauthorized';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <Navbar />
          <div className="main-content-wrapper">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchDonors />} />
              <Route path="/emergency-sos" element={<EmergencySOS />} />
              <Route path="/hospitals" element={<HospitalDirectory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Donor Portal */}
              <Route
                path="/donor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['donor', 'admin']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Seeker Portal */}
              <Route
                path="/seeker-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['seeker', 'admin']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Console */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
