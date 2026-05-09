const Report = require('../models/Report');
const path = require('path');
const fs = require('fs');

// GET /api/reports — get all reports for this doctor (with optional filter)
exports.getReports = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { doctor: req.doctorId };
    if (type && ['opg', 'plaque'].includes(type)) {
      filter.detectionType = type;
    }
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/reports/:id — single report
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, doctor: req.doctorId });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/reports/:id
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, doctor: req.doctorId });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/reports/:id/download — download PDF
exports.downloadPDF = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, doctor: req.doctorId });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (!report.pdfPath) return res.status(404).json({ message: 'PDF not generated yet' });

    const absolutePath = path.join(__dirname, '..', report.pdfPath.replace(/^\//, ''));
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: 'PDF file not found on disk' });
    }

    res.download(absolutePath, `report-${report.patientName.replace(/\s/g, '_')}.pdf`);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};