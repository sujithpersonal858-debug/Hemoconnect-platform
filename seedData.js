const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const BloodRequest = require('../models/BloodRequest');

dotenv.config();

/**
 * NOTICE:
 * All records seeded by this script are explicitly labeled as DEMONSTRATION / TEST SAMPLES
 * and marked with `isDemoRecord: true`. They are strictly for UI and system testing,
 * not verified real-world medical data.
 */

const sampleHospitals = [
  // Andhra Pradesh
  {
    name: '[Demo] King George Hospital Blood Bank',
    category: 'Blood Bank',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    address: 'Maharanipeta, Visakhapatnam, Andhra Pradesh 530002',
    contactPhone: '+91 891 2564891',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 17.7088,
    longitude: 83.3033,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },
  {
    name: '[Demo] Government General Hospital Blood Center',
    category: 'Hospital',
    state: 'Andhra Pradesh',
    district: 'Vijayawada',
    address: 'Hanumanpet, Vijayawada, Andhra Pradesh 520003',
    contactPhone: '+91 866 2577411',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 16.5186,
    longitude: 80.6200,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },
  {
    name: '[Demo] Sri Venkateswara Institute of Medical Sciences (SVIMS)',
    category: 'Hospital',
    state: 'Andhra Pradesh',
    district: 'Tirupati',
    address: 'Alipiri Road, Tirupati, Andhra Pradesh 517507',
    contactPhone: '+91 877 2287777',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 13.6373,
    longitude: 79.4065,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },

  // Telangana
  {
    name: '[Demo] Osmania General Hospital Blood Bank',
    category: 'Hospital',
    state: 'Telangana',
    district: 'Hyderabad',
    address: 'Afzal Gunj, Hyderabad, Telangana 500012',
    contactPhone: '+91 40 2460 0146',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 17.3753,
    longitude: 78.4744,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },
  {
    name: '[Demo] Nizam Institute of Medical Sciences (NIMS) Blood Center',
    category: 'Blood Bank',
    state: 'Telangana',
    district: 'Hyderabad',
    address: 'Punjagutta, Hyderabad, Telangana 500082',
    contactPhone: '+91 40 2348 9000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 17.4222,
    longitude: 78.4526,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },
  {
    name: '[Demo] MGM Hospital Emergency Blood Unit',
    category: 'Hospital',
    state: 'Telangana',
    district: 'Warangal',
    address: 'Mattewada, Warangal, Telangana 506002',
    contactPhone: '+91 870 242 1200',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 17.9784,
    longitude: 79.6010,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },

  // Maharashtra
  {
    name: '[Demo] KEM Hospital & Central Blood Bank',
    category: 'Hospital',
    state: 'Maharashtra',
    district: 'Mumbai',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    contactPhone: '+91 22 2410 7000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 19.0028,
    longitude: 72.8427,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },
  {
    name: '[Demo] Sassoon General Hospital Blood Bank',
    category: 'Hospital',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Near Pune Railway Station, Pune, Maharashtra 411001',
    contactPhone: '+91 20 2612 8000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 18.5283,
    longitude: 73.8739,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },

  // Karnataka
  {
    name: '[Demo] Victoria Hospital Regional Blood Center',
    category: 'Hospital',
    state: 'Karnataka',
    district: 'Bengaluru',
    address: 'Fort Road, near City Market, Bengaluru, Karnataka 560002',
    contactPhone: '+91 80 2670 1150',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 12.9629,
    longitude: 77.5759,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  },
  {
    name: '[Demo] KIMS Hospital & Research Blood Center',
    category: 'Hospital',
    state: 'Karnataka',
    district: 'Hubli-Dharwad',
    address: 'Vidyanagar, Hubli, Karnataka 580022',
    contactPhone: '+91 836 227 2000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 15.3524,
    longitude: 75.1274,
    isVerified: true,
    isDemoRecord: true,
    disclaimer: 'Demonstration sample entry for testing HemoConnect platform'
  }
];

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('⚠️  MONGODB_URI is not set. Seed script halted. Please configure your Atlas URI in server/.env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas for seeding.');

    // Remove existing demonstration entries to avoid duplicates
    await Hospital.deleteMany({ isDemoRecord: true });
    await Hospital.insertMany(sampleHospitals);
    console.log(`✅ Seeded ${sampleHospitals.length} demonstration hospital/blood-bank facilities across AP, TS, MH, and KA.`);

    await mongoose.disconnect();
    console.log('Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
