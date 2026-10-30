const express = require('express');
const router = express.Router();
const { getStats, getAllDonors, verifyDonor, getAllUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All routes strictly protected for 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/donors', getAllDonors);
router.put('/donors/:userId/verify', verifyDonor);
router.get('/users', getAllUsers);

module.exports = router;
