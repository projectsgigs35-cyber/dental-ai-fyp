const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    degrees: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    clinicName: { type: String, required: true },
    clinicAddress: { type: String, required: true },
    picture: { type: String, default: '' }, // file path
    contactNo: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);