const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
  class: String,
  confidence: Number,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
});

const reportSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, enum: ['male', 'female', 'other'], required: true },
    patientContact: { type: String, required: true },
    detectionType: { type: String, enum: ['opg', 'plaque'], required: true },
    originalImage: { type: String, required: true }, // path to uploaded image
    annotatedImage: { type: String, default: '' },   // path to image with bounding boxes
    detections: [detectionSchema],
    summary: { type: String, default: '' },
    pdfPath: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);