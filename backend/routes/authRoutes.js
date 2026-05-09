const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, register, login, getMe } = require('../controllers/authController');
const { uploadProfile } = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', uploadProfile.single('picture'), register);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;