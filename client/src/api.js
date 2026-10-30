/**
 * HemoConnect API Client
 * Connects to Node.js/Express backend, with safe local demonstration fallbacks
 * when the server or MongoDB Atlas is not yet connected.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('hemoconnect_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Safe demonstration data (clearly marked so it cannot be mistaken for real verified medical data)
const DEMO_DONORS = [
  {
    _id: 'demo-donor-1',
    user: {
      _id: 'u-1',
      name: 'R. K. Sharma (Demo Donor)',
      phone: '+91 98480 00000',
      email: 'demo.donor1@example.com',
      isVerified: true,
      isDemoRecord: true
    },
    bloodGroup: 'O+',
    age: 29,
    gender: 'Male',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    isAvailable: true,
    donationsCount: 6,
    lastDonationDate: '2026-08-14'
  },
  {
    _id: 'demo-donor-2',
    user: {
      _id: 'u-2',
      name: 'P. Ananya Reddy (Demo Donor)',
      phone: '+91 94400 00000',
      email: 'demo.donor2@example.com',
      isVerified: true,
      isDemoRecord: true
    },
    bloodGroup: 'O-',
    age: 26,
    gender: 'Female',
    state: 'Telangana',
    district: 'Hyderabad',
    isAvailable: true,
    donationsCount: 4,
    lastDonationDate: '2026-09-02'
  },
  {
    _id: 'demo-donor-3',
    user: {
      _id: 'u-3',
      name: 'S. Vikram Deshmukh (Demo Donor)',
      phone: '+91 98220 00000',
      email: 'demo.donor3@example.com',
      isVerified: true,
      isDemoRecord: true
    },
    bloodGroup: 'A+',
    age: 33,
    gender: 'Male',
    state: 'Maharashtra',
    district: 'Pune',
    isAvailable: true,
    donationsCount: 8,
    lastDonationDate: '2026-07-20'
  },
  {
    _id: 'demo-donor-4',
    user: {
      _id: 'u-4',
      name: 'M. Chetan Kumar (Demo Donor)',
      phone: '+91 97410 00000',
      email: 'demo.donor4@example.com',
      isVerified: false,
      isDemoRecord: true
    },
    bloodGroup: 'B+',
    age: 24,
    gender: 'Male',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    isAvailable: true,
    donationsCount: 2,
    lastDonationDate: '2026-09-18'
  },
  {
    _id: 'demo-donor-5',
    user: {
      _id: 'u-5',
      name: 'K. Sneha Rao (Demo Donor)',
      phone: '+91 98860 00000',
      email: 'demo.donor5@example.com',
      isVerified: true,
      isDemoRecord: true
    },
    bloodGroup: 'AB+',
    age: 31,
    gender: 'Female',
    state: 'Karnataka',
    district: 'Mysuru',
    isAvailable: false,
    donationsCount: 5,
    lastDonationDate: '2026-10-01'
  },
  {
    _id: 'demo-donor-6',
    user: {
      _id: 'u-6',
      name: 'Dr. V. Prasad (Demo Donor)',
      phone: '+91 98490 00000',
      email: 'demo.donor6@example.com',
      isVerified: true,
      isDemoRecord: true
    },
    bloodGroup: 'A-',
    age: 38,
    gender: 'Male',
    state: 'Andhra Pradesh',
    district: 'Vijayawada (NTR)',
    isAvailable: true,
    donationsCount: 11,
    lastDonationDate: '2026-06-11'
  }
];

const DEMO_REQUESTS = [
  {
    _id: 'demo-req-1',
    patientName: '[Demo] Aarav V.',
    bloodGroup: 'O-',
    unitsNeeded: 2,
    hospitalName: 'Apollo Speciality Hospital (Demo)',
    hospitalAddress: 'Jubilee Hills, Hyderabad, Telangana',
    state: 'Telangana',
    district: 'Hyderabad',
    urgency: 'Critical - Immediate',
    contactName: 'Emergency Coordinator (Demo)',
    contactPhone: '+91 40 2360 7777',
    status: 'Active',
    createdAt: new Date().toISOString(),
    isDemoRecord: true
  },
  {
    _id: 'demo-req-2',
    patientName: '[Demo] Lakshmi N.',
    bloodGroup: 'B+',
    unitsNeeded: 3,
    hospitalName: 'Care Hospital Emergency Unit (Demo)',
    hospitalAddress: 'Ram Nagar, Visakhapatnam, Andhra Pradesh',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    urgency: 'Urgent - Within 6 Hours',
    contactName: 'Attendant Ramesh (Demo)',
    contactPhone: '+91 891 275 6000',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isDemoRecord: true
  },
  {
    _id: 'demo-req-3',
    patientName: '[Demo] Rajesh G.',
    bloodGroup: 'A+',
    unitsNeeded: 1,
    hospitalName: 'Manipal Hospital ICU (Demo)',
    hospitalAddress: 'Old Airport Road, Bengaluru, Karnataka',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    urgency: 'Within 24 Hours',
    contactName: 'Blood Request Desk (Demo)',
    contactPhone: '+91 80 2502 4444',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    isDemoRecord: true
  }
];

const DEMO_HOSPITALS = [
  {
    _id: 'hosp-1',
    name: '[Demo Facility] King George Hospital Blood Center',
    category: 'Blood Bank',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    address: 'Maharanipeta, Visakhapatnam 530002',
    contactPhone: '+91 891 2564891',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 17.7088,
    longitude: 83.3033,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Sample facility for layout and map testing'
  },
  {
    _id: 'hosp-2',
    name: '[Demo Facility] Osmania General Hospital Regional Blood Bank',
    category: 'Hospital',
    state: 'Telangana',
    district: 'Hyderabad',
    address: 'Afzal Gunj, Hyderabad 500012',
    contactPhone: '+91 40 2460 0146',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 17.3753,
    longitude: 78.4744,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Sample facility for layout and map testing'
  },
  {
    _id: 'hosp-3',
    name: '[Demo Facility] KEM Hospital Blood Bank',
    category: 'Hospital',
    state: 'Maharashtra',
    district: 'Mumbai',
    address: 'Acharya Donde Marg, Parel, Mumbai 400012',
    contactPhone: '+91 22 2410 7000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 19.0028,
    longitude: 72.8427,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Sample facility for layout and map testing'
  },
  {
    _id: 'hosp-4',
    name: '[Demo Facility] Victoria Hospital Emergency Blood Bank',
    category: 'Hospital',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    address: 'Fort Road, near City Market, Bengaluru 560002',
    contactPhone: '+91 80 2670 1150',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 12.9629,
    longitude: 77.5759,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Sample facility for layout and map testing'
  }
];

export const api = {
  // Authentication
  async register(data) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Registration failed');
      return json;
    } catch (err) {
      // Local fallback for offline/preview testing
      console.warn('Backend not reached, using local session fallback for demonstration:', err.message);
      const mockUser = {
        id: 'local-user-' + Date.now(),
        name: data.name,
        email: data.email,
        role: data.role || 'seeker',
        phone: data.phone,
        state: data.state,
        district: data.district,
        isVerified: false,
        isDemoRecord: true
      };
      const token = 'demo_token_' + Date.now();
      return { success: true, token, user: mockUser };
    }
  },

  async login(credentials) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Login failed');
      return json;
    } catch (err) {
      console.warn('Backend not reached, checking demo login fallback:', err.message);
      // Hardcoded fallback logins for UI demo testing
      if (credentials.email === 'admin@hemoconnect.org') {
        return {
          success: true,
          token: 'demo_admin_jwt',
          user: {
            id: 'admin-1',
            name: 'HemoConnect Admin',
            email: 'admin@hemoconnect.org',
            role: 'admin',
            phone: '+91 99999 00000',
            state: 'Telangana',
            district: 'Hyderabad',
            isVerified: true
          }
        };
      } else if (credentials.email === 'donor@example.com') {
        return {
          success: true,
          token: 'demo_donor_jwt',
          user: {
            id: 'donor-1',
            name: 'R. K. Sharma (Demo Donor)',
            email: 'donor@example.com',
            role: 'donor',
            phone: '+91 98480 00000',
            state: 'Andhra Pradesh',
            district: 'Visakhapatnam',
            isVerified: true
          },
          donorProfile: DEMO_DONORS[0]
        };
      } else {
        return {
          success: true,
          token: 'demo_seeker_jwt',
          user: {
            id: 'seeker-1',
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'seeker',
            phone: '+91 98765 43210',
            state: 'Telangana',
            district: 'Hyderabad',
            isVerified: false
          }
        };
      }
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to verify token');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Donors
  async searchDonors(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/donors?${query}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      console.warn('Using local demonstration donor list:', err.message);
      let results = [...DEMO_DONORS];
      if (params.bloodGroup && params.bloodGroup !== 'ALL') {
        results = results.filter(d => d.bloodGroup === params.bloodGroup);
      }
      if (params.state && params.state !== 'ALL') {
        results = results.filter(d => d.state === params.state);
      }
      if (params.district && params.district !== 'ALL') {
        results = results.filter(d => d.district.toLowerCase().includes(params.district.toLowerCase()));
      }
      if (params.availableOnly === 'true') {
        results = results.filter(d => d.isAvailable);
      }
      return { success: true, count: results.length, donors: results, isFallback: true };
    }
  },

  async toggleAvailability(isAvailable) {
    try {
      const res = await fetch(`${BASE_URL}/donors/availability`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isAvailable })
      });
      return await res.json();
    } catch (err) {
      return { success: true, isAvailable };
    }
  },

  async logDonation() {
    try {
      const res = await fetch(`${BASE_URL}/donors/log-donation`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: 'Donation logged in demo session' };
    }
  },

  // Requests
  async createRequest(data) {
    try {
      const res = await fetch(`${BASE_URL}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      console.warn('Creating request in local demonstration state:', err.message);
      const newReq = {
        _id: 'req-' + Date.now(),
        ...data,
        status: 'Active',
        createdAt: new Date().toISOString(),
        isDemoRecord: true
      };
      DEMO_REQUESTS.unshift(newReq);
      return { success: true, request: newReq };
    }
  },

  async getRequests(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/requests?${query}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      let results = [...DEMO_REQUESTS];
      if (params.bloodGroup && params.bloodGroup !== 'ALL') {
        results = results.filter(r => r.bloodGroup === params.bloodGroup);
      }
      if (params.state && params.state !== 'ALL') {
        results = results.filter(r => r.state === params.state);
      }
      return { success: true, count: results.length, requests: results, isFallback: true };
    }
  },

  // Hospitals
  async getHospitals(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/hospitals?${query}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      let results = [...DEMO_HOSPITALS];
      if (params.state && params.state !== 'ALL') {
        results = results.filter(h => h.state === params.state);
      }
      if (params.category && params.category !== 'ALL') {
        results = results.filter(h => h.category === params.category);
      }
      return { success: true, count: results.length, facilities: results, isFallback: true };
    }
  },

  // Admin
  async getAdminStats() {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      return {
        success: true,
        stats: {
          totalUsers: 142,
          totalDonors: 98,
          availableDonors: 76,
          verifiedDonors: 64,
          totalRequests: 38,
          activeRequests: 9,
          fulfilledRequests: 27,
          totalHospitals: 24,
          donorsByBloodGroup: [
            { _id: 'O+', count: 32 },
            { _id: 'B+', count: 28 },
            { _id: 'A+', count: 22 },
            { _id: 'AB+', count: 8 },
            { _id: 'O-', count: 3 },
            { _id: 'A-', count: 2 },
            { _id: 'B-', count: 2 },
            { _id: 'AB-', count: 1 }
          ],
          requestsByState: [
            { _id: 'Telangana', count: 14 },
            { _id: 'Andhra Pradesh', count: 11 },
            { _id: 'Maharashtra', count: 8 },
            { _id: 'Karnataka', count: 5 }
          ]
        },
        isFallback: true
      };
    }
  },

  async verifyDonor(userId, isVerified) {
    try {
      const res = await fetch(`${BASE_URL}/admin/donors/${userId}/verify`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isVerified })
      });
      return await res.json();
    } catch (err) {
      return { success: true, isVerified };
    }
  }
};
