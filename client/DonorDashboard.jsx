import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { EmergencySOSCard } from '../components/EmergencySOSCard';
import { Activity, Heart, CheckCircle, Clock, AlertCircle, Award, Droplet, Calendar, ShieldCheck } from 'lucide-react';
import { BLOOD_COMPATIBILITY } from '../utils/bloodCompatibility';
import { api } from '../services/api';

export const DonorDashboard = () => {
  const { user, donorProfile, setDonorProfile } = useAuth();
  const [isAvailable, setIsAvailable] = useState(donorProfile?.isAvailable ?? true);
  const [matchingRequests, setMatchingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationSuccess, setDonationSuccess] = useState('');

  const bloodGroup = donorProfile?.bloodGroup || 'O+';
  const compatData = BLOOD_COMPATIBILITY[bloodGroup] || BLOOD_COMPATIBILITY['O+'];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.getRequests();
        if (res && res.requests) {
          // Filter requests that can receive from this donor's blood group
          const matched = res.requests.filter(req =>
            compatData.canDonateTo.includes(req.bloodGroup)
          );
          setMatchingRequests(matched);
        }
      } catch (err) {
        console.warn('Failed to load matching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [bloodGroup]);

  const handleToggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      const res = await api.toggleAvailability(nextState);
      if (res && res.donor) {
        setDonorProfile(res.donor);
      }
    } catch (err) {
      console.warn('Could not update availability:', err);
    }
  };

  const handleLogDonation = async () => {
    try {
      const res = await api.logDonation();
      if (res && res.success) {
        setDonationSuccess('Life saved! Your donation has been recorded in your service log.');
        if (donorProfile) {
          setDonorProfile({
            ...donorProfile,
            donationsCount: (donorProfile.donationsCount || 0) + 1,
            lastDonationDate: new Date().toISOString()
          });
        }
        setTimeout(() => setDonationSuccess(''), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="portal-layout container">
      <Sidebar role="donor" />

      <main className="portal-main-content">
        {/* Welcome Header */}
        <div className="portal-header-card">
          <div className="portal-header-left">
            <div className="portal-user-badge">
              <Heart className="text-red" fill="#dc2626" size={20} />
              <span>Voluntary Donor Portal</span>
            </div>
            <h2>Welcome back, {user?.name}!</h2>
            <p className="portal-sub">
              Your blood group <strong>{bloodGroup}</strong> can save patients requiring: {compatData.canDonateTo.join(', ')}.
            </p>
          </div>

          <div className="availability-card-toggle">
            <span className="toggle-label">Status:</span>
            <button
              onClick={handleToggleAvailability}
              className={`btn-availability-toggle ${isAvailable ? 'available' : 'off-duty'}`}
            >
              <span className="toggle-dot"></span>
              <span>{isAvailable ? 'Available for Emergency' : 'Resting / Off-Duty'}</span>
            </button>
          </div>
        </div>

        {donationSuccess && (
          <div className="alert-box alert-success mb-4">
            <CheckCircle size={18} />
            <span>{donationSuccess}</span>
          </div>
        )}

        {/* Donor Stat Cards */}
        <div className="portal-stats-grid">
          <div className="p-stat-card">
            <div className="p-stat-icon red-bg">
              <Droplet size={22} className="text-red" />
            </div>
            <div>
              <span className="p-stat-label">Blood Group</span>
              <h3 className="p-stat-val">{bloodGroup}</h3>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon green-bg">
              <Award size={22} className="text-green" />
            </div>
            <div>
              <span className="p-stat-label">Total Donations</span>
              <h3 className="p-stat-val">{donorProfile?.donationsCount || 0} times</h3>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon blue-bg">
              <Calendar size={22} className="text-blue" />
            </div>
            <div>
              <span className="p-stat-label">Last Donated</span>
              <h3 className="p-stat-val">
                {donorProfile?.lastDonationDate
                  ? new Date(donorProfile.lastDonationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Ready to donate'}
              </h3>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon amber-bg">
              <AlertCircle size={22} className="text-amber" />
            </div>
            <div>
              <span className="p-stat-label">Matching SOS</span>
              <h3 className="p-stat-val">{matchingRequests.length} active</h3>
            </div>
          </div>
        </div>

        {/* Quick Action: Log Donation */}
        <div className="quick-donation-log-card">
          <div className="log-text">
            <h4>Recently Donated Blood?</h4>
            <p>Keep your health record updated. Medical guidelines recommend a 90-day recovery interval between whole blood donations.</p>
          </div>
          <button onClick={handleLogDonation} className="btn btn-primary">
            <Award size={16} />
            <span>Log a Completed Donation</span>
          </button>
        </div>

        {/* Matching Emergency Requests Stream */}
        <div className="portal-section-card">
          <div className="card-section-header">
            <div>
              <h3 className="section-heading">Emergency Requests Matching Your Blood Type ({bloodGroup})</h3>
              <p className="section-subheading">
                These patients are compatible with your blood. If you are available and in the area, please reach out to the hospital coordinator.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="loading-placeholder">Checking urgent requests...</div>
          ) : matchingRequests.length > 0 ? (
            <div className="requests-grid">
              {matchingRequests.map(req => (
                <EmergencySOSCard key={req._id} request={req} />
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <CheckCircle size={32} className="text-green" />
              <h4>No matching emergency requisitions right now</h4>
              <p>You will be alerted when a hospital in your region needs your blood type.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
