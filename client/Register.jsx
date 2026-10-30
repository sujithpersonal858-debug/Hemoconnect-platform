import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, User, Mail, Lock, Phone, MapPin, AlertCircle, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'donor' ? 'donor' : 'seeker';

  const [role, setRole] = useState(initialRole);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    bloodGroup: 'O+',
    age: 24,
    gender: 'Male',
    weightKg: 60
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    setLoading(true);
    setErrorMsg('');

    const res = await register({
      ...formData,
      role
    });

    setLoading(false);

    if (res.success) {
      if (role === 'donor') {
        navigate('/donor-dashboard');
      } else {
        navigate('/seeker-dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card-wrapper register-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand-icon">
              <Heart className="text-red" fill="#dc2626" size={28} />
            </div>
            <h2 className="auth-title">Join the HemoConnect Network</h2>
            <p className="auth-sub">
              Register as a voluntary life-saving blood donor or as a patient/seeker.
            </p>
          </div>

          {/* Role Toggle Tabs */}
          <div className="role-selector-tabs">
            <button
              type="button"
              onClick={() => setRole('donor')}
              className={`role-tab ${role === 'donor' ? 'active' : ''}`}
            >
              <Heart size={16} />
              <span>Voluntary Donor</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('seeker')}
              className={`role-tab ${role === 'seeker' ? 'active' : ''}`}
            >
              <User size={16} />
              <span>Blood Seeker / Patient</span>
            </button>
          </div>

          {errorMsg && (
            <div className="alert-box alert-error">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sujith Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="sujith@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password (min 6 characters) *</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number (WhatsApp preferred) *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
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

            {/* Extra fields if registering as Donor */}
            {role === 'donor' && (
              <div className="donor-specific-fields">
                <div className="donor-section-heading">
                  <Shield size={16} className="text-red" />
                  <span>Clinical Eligibility Details</span>
                </div>

                <div className="form-row three-cols">
                  <div className="form-group">
                    <label>Blood Group *</label>
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

                  <div className="form-group">
                    <label>Age (18 - 65) *</label>
                    <input
                      type="number"
                      min="18"
                      max="65"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Weight (kg) *</label>
                    <input
                      type="number"
                      min="45"
                      max="150"
                      required
                      value={formData.weightKg}
                      onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <div className="radio-group-horizontal">
                    {['Male', 'Female', 'Other'].map(gen => (
                      <label key={gen} className="radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value={gen}
                          checked={formData.gender === gen}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        />
                        <span>{gen}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-auth-submit">
              <span>{loading ? 'Creating Account...' : `Register as ${role === 'donor' ? 'Voluntary Donor' : 'Blood Seeker'}`}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-footer-link">
            <span>Already have an account? </span>
            <Link to="/login" className="text-red font-bold">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
