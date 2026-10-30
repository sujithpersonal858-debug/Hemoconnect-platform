import React, { useState, useEffect } from 'react';
import { AlertCircle, Send, Clock, MapPin, Building, Phone, User, CheckCircle, ShieldAlert } from 'lucide-react';
import { EmergencySOSCard } from '../components/EmergencySOSCard';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const EmergencySOS = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsNeeded: 1,
    urgency: 'Critical - Immediate',
    hospitalName: '',
    hospitalAddress: '',
    state: user?.state || 'Andhra Pradesh',
    district: user?.district || 'Visakhapatnam',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    caseNotes: ''
  });

  const [activeRequests, setActiveRequests] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch active requests
  const fetchActiveRequests = async () => {
    try {
      const res = await api.getRequests();
      if (res && res.requests) {
        setActiveRequests(res.requests);
      }
    } catch (err) {
      console.warn('Failed to fetch requests:', err);
    }
  };

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const currentStateObj = INDIAN_STATES.find(s => s.name === formData.state);
  const districtList = currentStateObj ? currentStateObj.districts : [];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const matchState = INDIAN_STATES.find(s => s.name === newState);
    setFormData({
      ...formData,
      state: newState,
      district: matchState?.districts[0] || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.createRequest(formData);
      if (res && res.success) {
        setSuccessMsg('Emergency blood request successfully broadcasted to local donors and response network.');
        // Refresh active list
        fetchActiveRequests();
        // Reset form
        setFormData({
          patientName: '',
          bloodGroup: 'O+',
          unitsNeeded: 1,
          urgency: 'Critical - Immediate',
          hospitalName: '',
          hospitalAddress: '',
          state: formData.state,
          district: formData.district,
          contactName: user?.name || '',
          contactPhone: user?.phone || '',
          caseNotes: ''
        });
      } else {
        setErrorMsg(res?.message || 'Failed to submit request');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error broadcasting request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="emergency-page container">
      {/* Top Banner */}
      <div className="emergency-hero-banner">
        <div className="sos-indicator">
          <span className="pulse-circle"></span>
          <AlertCircle size={28} className="text-white" />
        </div>
        <div>
          <h1 className="emergency-hero-title">Emergency Blood SOS Broadcast</h1>
          <p className="emergency-hero-sub">
            Post an urgent requisition for blood or platelets. Nearby voluntary donors in your district will be alerted immediately.
          </p>
        </div>
      </div>

      <div className="emergency-layout-grid">
        {/* Left Form Column */}
        <div className="form-column">
          <div className="sos-form-card">
            <div className="card-header-styled">
              <ShieldAlert className="text-red" size={20} />
              <div>
                <h3>Create Emergency Requisition</h3>
                <small>Fill in patient hospital details. Voluntary donors respond directly.</small>
              </div>
            </div>

            {successMsg && (
              <div className="alert-box alert-success">
                <CheckCircle size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert-box alert-error">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="styled-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Blood Group Required *</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="form-control font-bold"
                  >
                    {ALL_BLOOD_GROUPS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Units Needed *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Urgency Level *</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="form-control text-red font-bold"
                  >
                    <option value="Critical - Immediate">Critical - Immediate (ICU/Surgery)</option>
                    <option value="Urgent - Within 6 Hours">Urgent - Within 6 Hours</option>
                    <option value="Within 24 Hours">Within 24 Hours</option>
                    <option value="Scheduled">Scheduled Transfusion</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Hospital / Medical Center Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Hospitals / King George Hospital"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Hospital Address / Ward / Bed Number</label>
                <input
                  type="text"
                  placeholder="e.g. Ward 4, Emergency Wing, Jubilee Hills"
                  value={formData.hospitalAddress}
                  onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>State *</label>
                  <select value={formData.state} onChange={handleStateChange} className="form-control">
                    {INDIAN_STATES.map(s => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>District / City *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="form-control"
                  >
                    {districtList.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh / Attendant Suresh"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Case Notes / Diagnosis (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Emergency bypass surgery scheduled for 3:00 PM; platelet replacement required."
                  value={formData.caseNotes}
                  onChange={(e) => setFormData({ ...formData, caseNotes: e.target.value })}
                  className="form-control"
                ></textarea>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-sos-submit">
                <Send size={18} />
                <span>{submitting ? 'Broadcasting Emergency SOS...' : 'Broadcast Emergency SOS Now'}</span>
              </button>

              <small className="form-ethical-note">
                Notice: All emergency blood requests are strictly non-commercial. Selling blood is illegal under Indian law.
              </small>
            </form>
          </div>
        </div>

        {/* Right Active Broadcasts Column */}
        <div className="active-broadcasts-column">
          <div className="active-header-box">
            <div className="live-tag">
              <span className="pulse-dot"></span>
              <strong>LIVE BROADCASTS ({activeRequests.length})</strong>
            </div>
            <p>Active requests broadcasted across local medical channels.</p>
          </div>

          <div className="requests-stack">
            {activeRequests.length > 0 ? (
              activeRequests.map(req => (
                <EmergencySOSCard key={req._id} request={req} />
              ))
            ) : (
              <div className="no-broadcasts-card">
                <CheckCircle size={32} className="text-green" />
                <h4>No active requests</h4>
                <p>All recent emergency requests have been fulfilled.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
