import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import {
  ShieldAlert,
  Users,
  Heart,
  AlertCircle,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { api } from '../services/api';

export const AdminPortal = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, donorsRes] = await Promise.all([
        api.getAdminStats(),
        api.searchDonors()
      ]);

      if (statsRes && statsRes.stats) setStats(statsRes.stats);
      if (donorsRes && donorsRes.donors) setDonors(donorsRes.donors);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerify = async (donor) => {
    const userId = donor.user?._id || donor.user?.id || donor._id;
    const currentStatus = Boolean(donor.user?.isVerified || donor.isVerified);
    const newStatus = !currentStatus;

    try {
      await api.verifyDonor(userId, newStatus);
      setActionMsg(`Donor verification updated for ${donor.user?.name || donor.name}`);
      // Update local state
      setDonors(prev =>
        prev.map(d => {
          if ((d.user?._id || d._id) === userId) {
            return {
              ...d,
              isVerified: newStatus,
              user: d.user ? { ...d.user, isVerified: newStatus } : { isVerified: newStatus }
            };
          }
          return d;
        })
      );
      setTimeout(() => setActionMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update verification:', err);
    }
  };

  const filteredDonors = donors.filter(d => {
    const name = d.user?.name || d.name || '';
    const state = d.state || '';
    const district = d.district || '';
    const blood = d.bloodGroup || '';
    const q = filterQuery.toLowerCase();
    return name.toLowerCase().includes(q) || state.toLowerCase().includes(q) || district.toLowerCase().includes(q) || blood.toLowerCase().includes(q);
  });

  return (
    <div className="portal-layout container">
      <Sidebar role="admin" />

      <main className="portal-main-content admin-main">
        {/* Admin Header */}
        <div className="portal-header-card admin-header">
          <div>
            <div className="admin-status-pill">
              <ShieldAlert size={16} />
              <span>Restricted System Administrator Console</span>
            </div>
            <h2>Platform Control &amp; Verification Center</h2>
            <p className="portal-sub">
              Oversee nationwide voluntary blood donor registrations, verify donor credentials, and manage regional hospital networks.
            </p>
          </div>
          <div className="admin-signed-in-as">
            <small>Administrator Session</small>
            <strong>{user?.email}</strong>
          </div>
        </div>

        {actionMsg && (
          <div className="alert-box alert-success mb-4">
            <CheckCircle size={18} />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Platform Stat Cards */}
        <div className="portal-stats-grid four-cols">
          <div className="p-stat-card">
            <div className="p-stat-icon red-bg">
              <Users size={22} className="text-red" />
            </div>
            <div>
              <span className="p-stat-label">Total Users</span>
              <h3 className="p-stat-val">{stats?.totalUsers || donors.length + 15}</h3>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon green-bg">
              <Heart size={22} className="text-green" />
            </div>
            <div>
              <span className="p-stat-label">Registered Donors</span>
              <h3 className="p-stat-val">{stats?.totalDonors || donors.length}</h3>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon amber-bg">
              <AlertCircle size={22} className="text-amber" />
            </div>
            <div>
              <span className="p-stat-label">Active Requisitions</span>
              <h3 className="p-stat-val">{stats?.activeRequests || 9}</h3>
            </div>
          </div>

          <div className="p-stat-card">
            <div className="p-stat-icon blue-bg">
              <Building2 size={22} className="text-blue" />
            </div>
            <div>
              <span className="p-stat-label">Verified Centers</span>
              <h3 className="p-stat-val">{stats?.totalHospitals || 24}</h3>
            </div>
          </div>
        </div>

        {/* Verification Queue Table */}
        <div className="portal-section-card">
          <div className="card-section-header between-row">
            <div>
              <h3 className="section-heading">Voluntary Donor Verification Roster</h3>
              <p className="section-subheading">
                Inspect donor profiles and toggle certified verification badge after cross-checking contact details.
              </p>
            </div>

            <div className="table-search-input">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search donor name, city, group..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-placeholder">Loading donor directory...</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Blood Group</th>
                    <th>Location</th>
                    <th>Contact Phone</th>
                    <th>Status</th>
                    <th>Verification</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonors.map((donor, idx) => {
                    const isVer = Boolean(donor.user?.isVerified || donor.isVerified);
                    const isDemo = Boolean(donor.user?.isDemoRecord || donor.isDemoRecord);
                    return (
                      <tr key={donor._id || idx}>
                        <td>
                          <strong>{donor.user?.name || donor.name}</strong>
                          {isDemo && <span className="demo-table-tag">Demo</span>}
                        </td>
                        <td>
                          <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                        </td>
                        <td>
                          <span className="loc-text">
                            <MapPin size={12} /> {donor.district}, {donor.state}
                          </span>
                        </td>
                        <td>
                          <code className="phone-code">{donor.user?.phone || donor.phone || 'N/A'}</code>
                        </td>
                        <td>
                          <span className={`pill-status ${donor.isAvailable ? 'online' : 'resting'}`}>
                            {donor.isAvailable ? 'Available' : 'Resting'}
                          </span>
                        </td>
                        <td>
                          {isVer ? (
                            <span className="badge-verified">
                              <CheckCircle size={13} /> Verified
                            </span>
                          ) : (
                            <span className="badge-unverified">
                              <Clock size={13} /> Pending
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleVerify(donor)}
                            className={`btn-action-verify ${isVer ? 'unverify' : 'verify'}`}
                          >
                            {isVer ? 'Revoke Verification' : 'Verify Donor'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Blood Group Inventory Breakdown */}
        {stats?.donorsByBloodGroup && (
          <div className="portal-section-card">
            <h3 className="section-heading mb-4">Donors Distribution by Blood Group</h3>
            <div className="distribution-grid">
              {stats.donorsByBloodGroup.map(item => (
                <div key={item._id} className="dist-chip">
                  <BloodGroupBadge group={item._id} size="sm" />
                  <span className="dist-count"><strong>{item.count}</strong> donors</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
