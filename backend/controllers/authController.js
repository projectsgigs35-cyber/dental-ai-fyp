const Doctor = require('../models/Doctor');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail, verifyEmailDomain } = require('../utils/sendOTP');
const nodemailer = require('nodemailer');

// Helper: generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: verify email actually exists by sending a test (use DNS MX)
async function checkEmailExists(email) {
  const domainOk = await verifyEmailDomain(email);
  if (!domainOk) return false;
  // Also verify via nodemailer SMTP (optional, but can cause delays)
  // For now, DNS MX check + format check is sufficient
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const emailValid = await checkEmailExists(email);
    if (!emailValid) {
      return res.status(400).json({
        message: 'This email address does not exist or is invalid. Please use a real email address.',
      });
    }

    const existing = await Doctor.findOne({ email: email.toLowerCase() });
    if (existing && existing.isVerified) {
      return res.status(400).json({ message: 'Email is already registered. Please login.' });
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email: email.toLowerCase() });
    await OTP.create({ email: email.toLowerCase(), otp });
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to your email. It expires in 5 minutes.' });
  } catch (err) {
    console.error('sendOTP error:', err);
    if (err.code === 'ENOTFOUND' || err.responseCode >= 500) {
      return res.status(400).json({ message: 'Email could not be reached. Please check the address.' });
    }
    res.status(500).json({ message: 'Server error sending OTP' });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email: email.toLowerCase(), otp });
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }
    await OTP.deleteMany({ email: email.toLowerCase() });
    res.json({ message: 'OTP verified successfully', verified: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const {
      name, dob, degrees, cnic, clinicName, clinicAddress,
      contactNo, yearsOfExperience, email, password
    } = req.body;

    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    const existing = await Doctor.findOne({ $or: [{ email: email.toLowerCase() }, { cnic }] });
    if (existing) {
      return res.status(400).json({ message: 'Doctor with this email or CNIC already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const picture = req.file ? `/uploads/images/${req.file.filename}` : '';

    const doctor = await Doctor.create({
      name, dob, degrees, cnic, clinicName, clinicAddress,
      contactNo, yearsOfExperience,
      email: email.toLowerCase(),
      password: hashedPassword,
      picture,
      isVerified: true,
    });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Registration successful!', token, doctor: sanitizeDoctor(doctor) });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!doctor) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, doctor: sanitizeDoctor(doctor) });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctorId).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

function sanitizeDoctor(doc) {
  const d = doc.toObject();
  delete d.password;
  return d;
}