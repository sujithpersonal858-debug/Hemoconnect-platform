import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { EmergencySOSCard } from '../components/EmergencySOSCard';
import { User, AlertCircle, PlusCircle, Search, Building2, CheckCircle, Clock } from 'lucide-react';
import { api } from '../services/api';

export const SeekerDashboard = () => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await api.getRequests();
        if (res && res.requests) {
          // Filter requests from this user or demo seeker
          const filtered = res.requests.filter(r =>
            r.requester?._id === user?.id || r.contactName?.includes(user?.name) || r.isDemoRecord
          );
          setMyRequests(filtered);
        }
      } catch (err) {
        console.warn('Failed to load user requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRequests();
  }, [user]);

  return (
    <div className="portal-layout container">
      <Sidebar role="seeker" />

      <main className="portal-main-content">
        <div className="portal-header-card">
          <div className="portal-header-left">
            <div className="portal-user-badge">
              <User className="text-red" size={20} />
              <span>Blood Seeker Portal</span>
            </div>
            <h2>Hello, {user?.name}!</h2>
            <p className="portal-sub">
              Manage your blood requests, check compatibility matching, and connect with nearby donors.
            </p>
          </div>

          <div className="header-actions">
            <Link to="/emergency-sos" className="btn btn-sos">
              <PlusCircle size={16} />
              <span>Broadcast New SOS</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="portal-stats-grid">
          <Link to="/search" className="action-tile-card">
            <Search size={24} className="text-red" />
            <div>
              <h4>Search Donors</h4>
              <p>Find matching voluntary donors in your district</p>
            </div>
          </Link>

          <Link to="/emergency-sos" className="action-tile-card">
            <AlertCircle size={24} className="text-red" />
            <div>
              <h4>Post Emergency SOS</h4>
              <p>Broadcast urgent hospital requirement</p>
            </div>
          </Link>

          <Link to="/hospitals" className="action-tile-card">
            <Building2 size={24} className="text-red" />
            <div>
              <h4>Blood Bank Directory</h4>
              <p>Contact 24/7 hospital transfusion units</p>
            </div>
          </Link>
        </div>

        {/* My Requests Track */}
        <div className="portal-section-card">
          <div className="card-section-header">
            <div>
              <h3 className="section-heading">Your Active Blood Requests</h3>
              <p className="section-subheading">
                Status of requisitions posted under your account.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="loading-placeholder">Loading your blood requests...</div>
          ) : myRequests.length > 0 ? (
            <div className="requests-grid">
              {myRequests.map(req => (
                <EmergencySOSCard key={req._id} request={req} />
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <CheckCircle size={32} className="text-green" />
              <h4>No pending blood requests</h4>
              <p>You haven't posted any urgent blood requisitions recently.</p>
              <Link to="/emergency-sos" className="btn btn-primary btn-sm mt-3">
                Post an Emergency Request
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
