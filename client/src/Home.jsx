import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  AlertCircle,
  Search,
  Building2,
  ShieldCheck,
  Activity,
  CheckCircle,
  Clock,
  Phone,
  ArrowRight,
  Droplet
} from 'lucide-react';
import { BloodGroupBadge } from '../components/BloodGroupBadge';
import { EmergencySOSCard } from '../components/EmergencySOSCard';
import { BLOOD_COMPATIBILITY, ALL_BLOOD_GROUPS } from '../utils/bloodCompatibility';
import { INDIAN_STATES } from '../utils/indianLocations';
import { api } from '../services/api';

export const Home = () => {
  const [selectedGroup, setSelectedGroup] = useState('O+');
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchUrgent = async () => {
      try {
        const res = await api.getRequests({ urgency: 'Critical - Immediate' });
        if (res && res.requests) {
          setUrgentRequests(res.requests.slice(0, 3));
        }
      } catch (err) {
        console.warn('Failed to load urgent requests:', err);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchUrgent();
  }, []);

  const currentCompat = BLOOD_COMPATIBILITY[selectedGroup] || BLOOD_COMPATIBILITY['O+'];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="container hero-container">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            <span>HUMANITARIAN BLOOD DONOR MATCHING &amp; EMERGENCY NETWORK</span>
          </div>

          <h1 className="hero-heading">
            Every Drop Connects Life. <br />
            <span className="text-red">Find Donors in Minutes.</span>
          </h1>

          <p className="hero-description">
            HemoConnect provides instant blood group compatibility matching and verified donor coordination across 15 Indian states, with priority coverage across Andhra Pradesh, Telangana, Maharashtra, and Karnataka.
          </p>

          <div className="hero-actions">
            <Link to="/emergency-sos" className="btn btn-hero-emergency">
              <AlertCircle size={20} />
              <span>Broadcast Emergency SOS</span>
            </Link>
            <Link to="/search" className="btn btn-hero-secondary">
              <Search size={20} />
              <span>Search Available Donors</span>
            </Link>
            <Link to="/register?role=donor" className="btn btn-hero-outline">
              <Heart size={20} />
              <span>Register as Voluntary Donor</span>
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="hero-stats-row">
            <div className="stat-card">
              <span className="stat-num">8 / 8</span>
              <span className="stat-label">Blood Groups Supported</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-card">
              <span className="stat-num">15</span>
              <span className="stat-label">Indian States Covered</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-card">
              <span className="stat-num">24 / 7</span>
              <span className="stat-label">Emergency SOS Network</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-card">
              <span className="stat-num">100%</span>
              <span className="stat-label">Voluntary &amp; Non-Remunerated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live SOS Alerts Section */}
      <section className="urgent-sos-section section-padding">
        <div className="container">
          <div className="section-head-row">
            <div>
              <div className="subhead-pill">CRITICAL EMERGENCY BROADCASTS</div>
              <h2 className="section-title">Active Urgent Blood Requests</h2>
              <p className="section-sub">
                Patients in ICU or emergency surgery requiring immediate blood units. Please respond if you are nearby and eligible.
              </p>
            </div>
            <Link to="/emergency-sos" className="link-with-arrow">
              <span>View All Requests</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loadingRequests ? (
            <div className="loading-placeholder">Searching active emergency broadcasts...</div>
          ) : urgentRequests.length > 0 ? (
            <div className="urgent-grid">
              {urgentRequests.map(req => (
                <EmergencySOSCard key={req._id} request={req} />
              ))}
            </div>
          ) : (
            <div className="empty-alert-box">
              <CheckCircle size={28} className="text-green" />
              <div>
                <strong>No critical emergencies pending in your immediate area right now.</strong>
                <p>Voluntary donors remain on standby for emergency dispatches.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8-Blood Group Compatibility Engine Section */}
      <section className="compatibility-section section-padding bg-alt">
        <div className="container">
          <div className="section-head-center">
            <div className="subhead-pill">MEDICAL COMPATIBILITY ENGINE</div>
            <h2 className="section-title">Eight Blood Groups Compatibility Guide</h2>
            <p className="section-sub">
              Select any blood group to inspect medical transfusion compatibility rules, universal donor/recipient statuses, and Indian population prevalence.
            </p>
          </div>

          {/* Blood group selector pills */}
          <div className="blood-group-selector">
            {ALL_BLOOD_GROUPS.map(group => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`blood-select-btn ${selectedGroup === group ? 'active' : ''}`}
              >
                <span className="drop">🩸</span>
                <span className="btn-text">{group}</span>
              </button>
            ))}
          </div>

          {/* Compatibility Breakdown Card */}
          <div className="compatibility-card">
            <div className="compat-card-header">
              <div className="compat-title-wrap">
                <BloodGroupBadge group={selectedGroup} size="xl" />
                <div>
                  <h3 className="compat-title">Blood Group {selectedGroup} Profile</h3>
                  <span className="prevalence-badge">{currentCompat.rarity}</span>
                </div>
              </div>
              <div className="compat-notes-pill">
                <ShieldCheck size={16} className="text-red" />
                <span>{currentCompat.notes}</span>
              </div>
            </div>

            <div className="compat-columns-grid">
              {/* Can Receive From */}
              <div className="compat-col">
                <h4 className="compat-col-title">
                  <span className="dot dot-green"></span>
                  Can Safely Receive Red Blood Cells From:
                </h4>
                <div className="badges-flex">
                  {currentCompat.canReceiveFrom.map(donorG => (
                    <div key={donorG} className="compat-chip can-receive">
                      <Droplet size={14} />
                      <span>{donorG}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Can Donate To */}
              <div className="compat-col">
                <h4 className="compat-col-title">
                  <span className="dot dot-red"></span>
                  Can Safely Donate Red Blood Cells To:
                </h4>
                <div className="badges-flex">
                  {currentCompat.canDonateTo.map(recipG => (
                    <div key={recipG} className="compat-chip can-donate">
                      <Droplet size={14} />
                      <span>{recipG}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="compat-card-footer">
              <Link to={`/search?recipientBloodGroup=${selectedGroup}`} className="btn btn-primary btn-sm">
                <Search size={15} />
                <span>Find Donors Compatible with {selectedGroup}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Focus Section: AP, TS, MH, KA */}
      <section className="regional-focus-section section-padding">
        <div className="container">
          <div className="section-head-center">
            <div className="subhead-pill">STATE-LEVEL ASSISTANCE</div>
            <h2 className="section-title">Comprehensive Coverage Across 15 Indian States</h2>
            <p className="section-sub">
              Prioritized regional clusters ensuring maximum donor availability and hospital blood bank connectivity.
            </p>
          </div>

          <div className="states-showcase-grid">
            <div className="state-card priority">
              <div className="state-tag">Priority State</div>
              <h3>Andhra Pradesh</h3>
              <p className="state-cities">Visakhapatnam, Vijayawada, Guntur, Tirupati, Kurnool, Kakinada, Rajahmundry, Nellore</p>
              <Link to="/search?state=Andhra Pradesh" className="state-explore-btn">
                <span>View AP Donors</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="state-card priority">
              <div className="state-tag">Priority State</div>
              <h3>Telangana</h3>
              <p className="state-cities">Hyderabad, Secunderabad, Warangal, Nizamabad, Karimnagar, Khammam, Nalgonda</p>
              <Link to="/search?state=Telangana" className="state-explore-btn">
                <span>View Telangana Donors</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="state-card priority">
              <div className="state-tag">Priority State</div>
              <h3>Maharashtra</h3>
              <p className="state-cities">Mumbai, Pune, Nagpur, Nashik, Thane, Chhatrapati Sambhajinagar, Solapur</p>
              <Link to="/search?state=Maharashtra" className="state-explore-btn">
                <span>View Maharashtra Donors</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="state-card priority">
              <div className="state-tag">Priority State</div>
              <h3>Karnataka</h3>
              <p className="state-cities">Bengaluru Urban, Mysuru, Hubli-Dharwad, Mangaluru, Belagavi, Kalaburagi</p>
              <Link to="/search?state=Karnataka" className="state-explore-btn">
                <span>View Karnataka Donors</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="other-states-ribbon">
            <strong>Also Serving:</strong>
            <span>Tamil Nadu &bull; Kerala &bull; Gujarat &bull; Delhi NCR &bull; Uttar Pradesh &bull; West Bengal &bull; Rajasthan &bull; Madhya Pradesh &bull; Punjab &bull; Odisha &bull; Bihar</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section section-padding bg-alt">
        <div className="container">
          <div className="section-head-center">
            <div className="subhead-pill">TRANSPARENT WORKFLOW</div>
            <h2 className="section-title">How HemoConnect Works</h2>
            <p className="section-sub">
              Connecting life-savers with patients in four straightforward steps.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h4>Register or Post SOS</h4>
              <p>Register as a voluntary donor with your blood group, or post an urgent emergency request with hospital details.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h4>Automated Compatibility Match</h4>
              <p>Our engine matches all compatible donors using medically accurate red-cell and Rh factor compatibility matrices.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h4>Direct Regional Outreach</h4>
              <p>Seekers receive real-time contact access to available, verified donors located within the relevant city or district.</p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h4>Safe Clinical Transfusion</h4>
              <p>Donors proceed directly to certified blood banks or hospital transfusion units to complete the life-saving donation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Ready to Save a Life in Your Community?</h2>
          <p>
            Join thousands of voluntary blood donors across India. Your single donation can save up to three lives.
          </p>
          <div className="cta-buttons">
            <Link to="/register?role=donor" className="btn btn-cta-primary">
              <Heart size={18} />
              <span>Register as a Blood Donor</span>
            </Link>
            <Link to="/hospitals" className="btn btn-cta-secondary">
              <Building2 size={18} />
              <span>Locate Nearest Blood Bank</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
