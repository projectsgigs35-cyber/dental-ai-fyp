const Doctor = require('../models/Doctor');
const Report = require('../models/Report');
const bcrypt = require('bcryptjs');

// GET /api/doctors/profile
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctorId).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/doctors/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, dob, degrees, clinicName, clinicAddress, contactNo, yearsOfExperience, theme } = req.body;
    const updates = { name, dob, degrees, clinicName, clinicAddress, contactNo, yearsOfExperience, theme };

    if (req.file) {
      updates.picture = `/uploads/images/${req.file.filename}`;
    }

    const doctor = await Doctor.findByIdAndUpdate(req.doctorId, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/doctors/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const doctor = await Doctor.findById(req.doctorId);
    const match = await bcrypt.compare(currentPassword, doctor.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    doctor.password = await bcrypt.hash(newPassword, 12);
    await doctor.save();
    res.json({ message: 'Password changed successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/doctors/stats
exports.getStats = async (req, res) => {
  try {
    const total = await Report.countDocuments({ doctor: req.doctorId });
    const opg = await Report.countDocuments({ doctor: req.doctorId, detectionType: 'opg' });
    const plaque = await Report.countDocuments({ doctor: req.doctorId, detectionType: 'plaque' });
    res.json({ total, opg, plaque });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};