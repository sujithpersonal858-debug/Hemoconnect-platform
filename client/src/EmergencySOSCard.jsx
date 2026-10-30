import React from 'react';
import { BloodGroupBadge } from './BloodGroupBadge';
import { AlertCircle, MapPin, Building, Phone, Clock, Droplet } from 'lucide-react';

export const EmergencySOSCard = ({ request }) => {
  const urgencyStyles = {
    'Critical - Immediate': 'urgency-critical',
    'Urgent - Within 6 Hours': 'urgency-urgent',
    'Within 24 Hours': 'urgency-moderate',
    'Scheduled': 'urgency-scheduled'
  };

  const isDemo = request.isDemoRecord;

  return (
    <div className={`sos-card ${urgencyStyles[request.urgency] || 'urgency-urgent'}`}>
      <div className="sos-header">
        <div className="sos-badge-wrap">
          <span className="urgency-pill">
            <span className="pulse-dot"></span>
            {request.urgency}
          </span>
          {isDemo && <span className="demo-tag">Demonstration Sample</span>}
        </div>
        <span className="sos-time">
          <Clock size={13} />
          {new Date(request.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="sos-body">
        <div className="sos-patient-row">
          <BloodGroupBadge group={request.bloodGroup} size="lg" />
          <div className="patient-info">
            <h4 className="patient-name">{request.patientName}</h4>
            <div className="units-tag">
              <Droplet size={14} className="text-red" />
              <span><strong>{request.unitsNeeded} unit(s)</strong> required</span>
            </div>
          </div>
        </div>

        <div className="sos-hospital-details">
          <div className="detail-line">
            <Building size={14} className="icon-sub" />
            <span className="hosp-name">{request.hospitalName}</span>
          </div>
          {request.hospitalAddress && (
            <div className="detail-line address-line">
              <MapPin size={14} className="icon-sub" />
              <span>{request.hospitalAddress}</span>
            </div>
          )}
          <div className="detail-line loc-badge-line">
            <span className="location-chip">{request.district}, {request.state}</span>
          </div>
        </div>

        {request.caseNotes && (
          <p className="case-notes">
            <em>&ldquo;{request.caseNotes}&rdquo;</em>
          </p>
        )}
      </div>

      <div className="sos-footer">
        <div className="contact-details">
          <span className="contact-label">Contact Person:</span>
          <strong>{request.contactName}</strong>
        </div>
        <a href={`tel:${request.contactPhone}`} className="btn btn-emergency-call">
          <Phone size={15} />
          <span>Call: {request.contactPhone}</span>
        </a>
      </div>
    </div>
  );
};
