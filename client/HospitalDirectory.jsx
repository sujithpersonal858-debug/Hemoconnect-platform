import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Search, Filter, Phone, Map, List, AlertCircle } from 'lucide-react';
import { HospitalCard } from '../components/HospitalCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { INDIAN_STATES } from '../utils/indianLocations';
import { api } from '../services/api';

export const HospitalDirectory = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('both'); // 'cards', 'map', 'both'

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedState !== 'ALL') params.state = selectedState;
      if (selectedCategory !== 'ALL') params.category = selectedCategory;

      const res = await api.getHospitals(params);
      if (res && res.facilities) {
        setFacilities(res.facilities);
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [selectedState, selectedCategory]);

  const filteredFacilities = facilities.filter(f => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      f.name.toLowerCase().includes(term) ||
      f.district.toLowerCase().includes(term) ||
      f.address.toLowerCase().includes(term)
    );
  });

  return (
    <div className="directory-page container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <div className="icon-header-badge">
            <Building2 className="text-red" size={24} />
          </div>
          <div>
            <h1 className="page-title">Hospitals &amp; Regional Blood Banks Directory</h1>
            <p className="page-sub">
              Verified clinical healthcare centers, trauma response units, and 24/7 blood banks across 15 Indian states.
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="view-mode-toggle">
          <button
            onClick={() => setViewMode('both')}
            className={`btn-toggle ${viewMode === 'both' ? 'active' : ''}`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`btn-toggle ${viewMode === 'map' ? 'active' : ''}`}
          >
            <Map size={15} /> Map View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`btn-toggle ${viewMode === 'cards' ? 'active' : ''}`}
          >
            <List size={15} /> List View
          </button>
        </div>
      </div>

      {/* Interactive Map Component */}
      {(viewMode === 'both' || viewMode === 'map') && (
        <div className="map-section-wrapper mb-6">
          <InteractiveMap
            facilities={facilities}
            selectedState={selectedState}
            onSelectFacility={(fac) => {
              setSearchTerm(fac.district);
            }}
          />
        </div>
      )}

      {/* Directory Filter Toolbar */}
      {(viewMode === 'both' || viewMode === 'cards') && (
        <>
          <div className="filter-card">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Search Facility Name or City:</label>
                <div className="input-with-icon">
                  <Search size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Osmania, King George, Apollo, Pune..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>State Filter:</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="form-control"
                >
                  <option value="ALL">All 15 States</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Facility Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-control"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Hospital">Hospitals</option>
                  <option value="Blood Bank">Blood Banks</option>
                  <option value="Emergency Center">Emergency Centers</option>
                </select>
              </div>
            </div>
          </div>

          {/* Facilities Cards Grid */}
          <div className="facilities-container">
            {loading ? (
              <div className="loading-grid">
                <div className="spinner"></div>
                <p>Loading hospital directory...</p>
              </div>
            ) : filteredFacilities.length > 0 ? (
              <div className="hospitals-grid">
                {filteredFacilities.map(facility => (
                  <HospitalCard key={facility._id} facility={facility} />
                ))}
              </div>
            ) : (
              <div className="no-results-card">
                <AlertCircle size={36} className="text-red" />
                <h3>No Facilities Found</h3>
                <p>Try clearing your search term or selecting another state.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedState('ALL'); setSelectedCategory('ALL'); }}
                  className="btn btn-secondary"
                >
                  Reset Directory Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
