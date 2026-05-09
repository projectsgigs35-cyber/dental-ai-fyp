const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, getStats } = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, uploadProfile.single('picture'), updateProfile);
router.put('/change-password', auth, changePassword);
router.get('/stats', auth, getStats);

module.exports = router;