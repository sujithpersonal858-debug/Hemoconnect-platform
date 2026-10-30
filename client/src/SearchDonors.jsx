import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, AlertCircle, Heart, Users, MapPin, CheckCircle } from 'lucide-react';
import { DonorCard } from '../components/DonorCard';
import { ALL_BLOOD_GROUPS, INDIAN_STATES } from '../utils/indianLocations';
import { BLOOD_COMPATIBILITY, getCompatibleDonorGroups } from '../utils/bloodCompatibility';
import { api } from '../services/api';

export const SearchDonors = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'ALL');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'ALL');
  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || 'ALL');
  const [recipientBloodGroup, setRecipientBloodGroup] = useState(searchParams.get('recipientBloodGroup') || 'ALL');
  const [availableOnly, setAvailableOnly] = useState(true);

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  // Available districts for chosen state
  const currentStateObj = INDIAN_STATES.find(s => s.name === selectedState);
  const districtList = currentStateObj ? currentStateObj.districts : [];

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedState !== 'ALL') params.state = selectedState;
      if (selectedDistrict !== 'ALL') params.district = selectedDistrict;
      if (availableOnly) params.availableOnly = 'true';

      if (recipientBloodGroup !== 'ALL') {
        params.recipientBloodGroup = recipientBloodGroup;
      } else if (bloodGroup !== 'ALL') {
        params.bloodGroup = bloodGroup;
      }

      const res = await api.searchDonors(params);
      if (res && res.donors) {
        setDonors(res.donors);
        setIsFallback(Boolean(res.isFallback));
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedState, selectedDistrict, bloodGroup, recipientBloodGroup, availableOnly]);

  const handleStateChange = (e) => {
    const st = e.target.value;
    setSelectedState(st);
    setSelectedDistrict('ALL');
  };

  const handleReset = () => {
    setSelectedState('ALL');
    setSelectedDistrict('ALL');
    setBloodGroup('ALL');
    setRecipientBloodGroup('ALL');
    setAvailableOnly(false);
  };

  const compatibleList = recipientBloodGroup !== 'ALL' ? getCompatibleDonorGroups(recipientBloodGroup) : null;

  return (
    <div className="search-page container">
      {/* Search Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <div className="icon-header-badge">
            <Search className="text-red" size={24} />
          </div>
          <div>
            <h1 className="page-title">Find Compatible Blood Donors</h1>
            <p className="page-sub">
              Locate voluntary donors across 15 Indian states filtered by medical blood group compatibility, district, and real-time availability.
            </p>
          </div>
        </div>

        {isFallback && (
          <div className="demo-notice-banner">
            <AlertCircle size={16} />
            <span>Demonstration mode active. Showing test donor profiles for UI testing.</span>
          </div>
        )}
      </div>

      {/* Filter Toolbar Card */}
      <div className="filter-card">
        <div className="filter-header">
          <div className="filter-title">
            <Filter size={18} className="text-red" />
            <span>Search &amp; Compatibility Filters</span>
          </div>
          <button onClick={handleReset} className="btn-reset">
            <RefreshCw size={14} />
            <span>Reset All</span>
          </button>
        </div>

        <div className="filter-grid">
          {/* Patient Blood Group (Auto-match compatible donors) */}
          <div className="filter-group highlight-filter">
            <label>
              Patient's Blood Group (Matches Compatible Donors):
            </label>
            <select
              value={recipientBloodGroup}
              onChange={(e) => {
                setRecipientBloodGroup(e.target.value);
                if (e.target.value !== 'ALL') setBloodGroup('ALL');
              }}
              className="form-control"
            >
              <option value="ALL">-- Any / Don't Match by Recipient --</option>
              {ALL_BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>Patient Needs for {bg}</option>
              ))}
            </select>
            {compatibleList && (
              <small className="filter-hint text-red">
                Accepts from: <strong>{compatibleList.join(', ')}</strong>
              </small>
            )}
          </div>

          {/* Exact Blood Group */}
          <div className="filter-group">
            <label>Exact Donor Blood Group:</label>
            <select
              value={bloodGroup}
              onChange={(e) => {
                setBloodGroup(e.target.value);
                if (e.target.value !== 'ALL') setRecipientBloodGroup('ALL');
              }}
              className="form-control"
              disabled={recipientBloodGroup !== 'ALL'}
            >
              <option value="ALL">All 8 Blood Groups</option>
              {ALL_BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="filter-group">
            <label>Indian State:</label>
            <select value={selectedState} onChange={handleStateChange} className="form-control">
              <option value="ALL">All 15 States</option>
              {INDIAN_STATES.map(s => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* District / City */}
          <div className="filter-group">
            <label>District / City:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="form-control"
              disabled={selectedState === 'ALL' || districtList.length === 0}
            >
              <option value="ALL">{selectedState === 'ALL' ? 'Select State First' : 'All Districts'}</option>
              {districtList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle options */}
        <div className="filter-footer-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            <span>Show available donors only</span>
          </label>

          <div className="results-count">
            <Users size={16} />
            <span><strong>{donors.length}</strong> donor profile(s) found</span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-container">
        {loading ? (
          <div className="loading-grid">
            <div className="spinner"></div>
            <p>Searching regional donor database...</p>
          </div>
        ) : donors.length > 0 ? (
          <div className="donors-grid">
            {donors.map(donor => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
          </div>
        ) : (
          <div className="no-results-card">
            <AlertCircle size={40} className="text-red" />
            <h3>No Donors Found Matching Your Criteria</h3>
            <p>
              Try expanding your search to neighboring districts, or remove the "available only" filter.
              If this is an emergency, you can broadcast an urgent SOS request.
            </p>
            <div className="no-res-actions">
              <button onClick={handleReset} className="btn btn-secondary">
                Reset Filters
              </button>
              <a href="/emergency-sos" className="btn btn-sos">
                Broadcast Emergency SOS
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
