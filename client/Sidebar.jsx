import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Activity, AlertCircle, Clock, ShieldCheck, UserCheck, Settings, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ role = 'donor' }) => {
  const { user } = useAuth();

  return (
    <aside className="portal-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-role-badge">
          {role === 'admin' ? 'Restricted Admin' : role === 'donor' ? 'Registered Donor' : 'Blood Seeker'}
        </div>
        <h3 className="sidebar-user-name">{user?.name}</h3>
        <p className="sidebar-location-sub">{user?.district}, {user?.state}</p>
      </div>

      <nav className="sidebar-nav">
        {role === 'donor' && (
          <>
            <NavLink to="/donor-dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Activity size={18} />
              <span>Donor Overview</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Heart size={18} />
              <span>Match Directory</span>
            </NavLink>
            <NavLink to="/emergency-sos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <AlertCircle size={18} />
              <span>Urgent SOS Requests</span>
            </NavLink>
          </>
        )}

        {role === 'seeker' && (
          <>
            <NavLink to="/seeker-dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Activity size={18} />
              <span>Seeker Dashboard</span>
            </NavLink>
            <NavLink to="/emergency-sos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <AlertCircle size={18} />
              <span>Post Emergency Request</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Heart size={18} />
              <span>Find Compatible Donors</span>
            </NavLink>
            <NavLink to="/hospitals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Clock size={18} />
              <span>Nearby Blood Banks</span>
            </NavLink>
          </>
        )}

        {role === 'admin' && (
          <>
            <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={18} />
              <span>Admin Overview</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} />
              <span>Donor Directory</span>
            </NavLink>
            <NavLink to="/emergency-sos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <AlertCircle size={18} />
              <span>All SOS Broadcasts</span>
            </NavLink>
            <NavLink to="/hospitals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Clock size={18} />
              <span>Hospital Facilities</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="emergency-quick-box">
          <small>Need urgent guidance?</small>
          <strong>Dial 104 (Health Help)</strong>
        </div>
      </div>
    </aside>
  );
};
