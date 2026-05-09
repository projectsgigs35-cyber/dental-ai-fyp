const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { v4: uuidv4 } = require('uuid');
const Report = require('../models/Report');
const Doctor = require('../models/Doctor');
const { generateReportPDF } = require('../utils/generatePDF');

// Colors for bounding boxes by class
const CLASS_COLORS = {
  default: '#EF4444',
  cavity: '#EF4444',
  calculus: '#F59E0B',
  plaque: '#F59E0B',
  tooth: '#3B82F6',
  periapical: '#8B5CF6',
  crown: '#10B981',
  filling: '#06B6D4',
  caries: '#EF4444',
  'root canal': '#EC4899',
};

function getColor(className) {
  if (!className) return CLASS_COLORS.default;
  const lower = className.toLowerCase();
  for (const key of Object.keys(CLASS_COLORS)) {
    if (lower.includes(key)) return CLASS_COLORS[key];
  }
  return CLASS_COLORS.default;
}

// ─── Draw bounding boxes (works for both detection & segmentation) ───────────
async function drawBoundingBoxes(imagePath, detections) {
  try {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    detections.forEach((d) => {
      const color = getColor(d.class);

      // ── Segmentation: draw polygon points if available ──
      if (d.points && d.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(d.points[0].x, d.points[0].y);
        d.points.forEach((pt) => ctx.lineTo(pt.x, pt.y));
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(2, img.width / 400);
        ctx.stroke();
        // Semi-transparent fill
        ctx.fillStyle = color + '33'; // 20% opacity
        ctx.fill();
      }

      // ── Bounding box (both detection and segmentation have x,y,width,height) ──
      const x = d.x - d.width / 2;
      const y = d.y - d.height / 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, img.width / 400);
      ctx.strokeRect(x, y, d.width, d.height);

      // ── Label ──
      const fontSize = Math.max(12, img.width / 70);
      ctx.font = `bold ${fontSize}px Arial`;
      const label = `${d.class} ${(d.confidence * 100).toFixed(0)}%`;
      const textWidth = ctx.measureText(label).width;
      const padding = 4;

      // Label background
      ctx.fillStyle = color;
      ctx.fillRect(x, y - fontSize - padding * 2, textWidth + padding * 2, fontSize + padding * 2);

      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x + padding, y - padding);
    });

    const annotatedFilename = `annotated-${uuidv4()}.jpg`;
    const annotatedPath = path.join(__dirname, '../uploads/images', annotatedFilename);
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
    fs.writeFileSync(annotatedPath, buffer);
    return `/uploads/images/${annotatedFilename}`;
  } catch (err) {
    console.error('Error drawing bounding boxes:', err);
    return null;
  }
}

// ─── Normalize predictions from both model types into unified format ──────────
function normalizePredictions(roboflowData, detectionType) {
  const predictions = roboflowData.predictions || [];

  return predictions.map((pred) => {
    // Instance segmentation returns points array
    // Object detection returns just x, y, width, height
    return {
      class: pred.class || 'Unknown',
      confidence: pred.confidence || 0,
      x: pred.x || 0,
      y: pred.y || 0,
      width: pred.width || 0,
      height: pred.height || 0,
      // Include polygon points for segmentation (will be stored and used for drawing)
      points: pred.points || [],
    };
  });
}

// ─── Call Roboflow API ────────────────────────────────────────────────────────
async function callRoboflow(imagePath, modelId, apiKey, detectionType) {
  const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

  // Instance segmentation uses a different endpoint format
  const isSegmentation = detectionType === 'plaque';

  const url = isSegmentation
    ? `https://detect.roboflow.com/${modelId}`
    : `https://detect.roboflow.com/${modelId}`;

  const response = await axios({
    method: 'POST',
    url,
    params: {
      api_key: apiKey,
      confidence: 40,   // minimum confidence threshold (%)
      overlap: 30,      // max overlap for NMS (%)
    },
    data: imageData,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 30000, // 30 second timeout
  });

  return response.data;
}

// ─── Generate AI summary text ─────────────────────────────────────────────────
function generateSummary(detections, detectionType) {
  if (detections.length === 0) {
    return detectionType === 'opg'
      ? 'No dental pathologies detected in the OPG radiograph.'
      : 'No plaque or calculus deposits detected in the image.';
  }

  const classCounts = {};
  detections.forEach((d) => {
    classCounts[d.class] = (classCounts[d.class] || 0) + 1;
  });

  const summary = Object.entries(classCounts)
    .map(([cls, count]) => `${count} instance(s) of ${cls}`)
    .join(', ');

  const avgConfidence = (
    detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100
  ).toFixed(1);

  return `Detected ${detections.length} finding(s): ${summary}. Average confidence: ${avgConfidence}%.`;
}

// ─── Main detection route handler ─────────────────────────────────────────────
// POST /api/detections/run
exports.runDetection = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const { detectionType, patientName, patientAge, patientGender, patientContact } = req.body;

    if (!['opg', 'plaque'].includes(detectionType)) {
      return res.status(400).json({ message: 'Invalid detection type. Must be opg or plaque.' });
    }

    if (!patientName || !patientAge || !patientGender || !patientContact) {
      return res.status(400).json({ message: 'All patient details are required.' });
    }

    const imagePath = path.join(__dirname, '../uploads/images', req.file.filename);

    // Select correct model and API key
    const modelId = detectionType === 'opg'
      ? process.env.ROBOFLOW_OPG_MODEL
      : process.env.ROBOFLOW_PLAG_MODEL;

    const apiKey = detectionType === 'opg'
      ? process.env.ROBOFLOW_OPG_API_KEY
      : process.env.ROBOFLOW_PLAG_API_KEY;

    if (!modelId || !apiKey) {
      return res.status(500).json({ message: 'Roboflow model not configured in .env' });
    }

    console.log(`Running ${detectionType.toUpperCase()} detection on model: ${modelId}`);

    // Call Roboflow
    let roboflowData;
    try {
      roboflowData = await callRoboflow(imagePath, modelId, apiKey, detectionType);
      console.log(`Roboflow returned ${roboflowData.predictions?.length || 0} predictions`);
    } catch (roboErr) {
      console.error('Roboflow API error:', roboErr.response?.data || roboErr.message);
      return res.status(502).json({
        message: 'Failed to reach Roboflow API. Check your model ID and API key.',
        detail: roboErr.response?.data?.message || roboErr.message,
      });
    }

    // Normalize predictions (handles both detection & segmentation formats)
    const detections = normalizePredictions(roboflowData, detectionType);

    // Draw bounding boxes / segmentation masks on image
    const annotatedImage = await drawBoundingBoxes(imagePath, detections);

    // Generate text summary
    const summary = generateSummary(detections, detectionType);

    // Fetch doctor info
    const doctor = await Doctor.findById(req.doctorId).select('-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Save report to MongoDB
    const report = await Report.create({
      doctor: req.doctorId,
      patientName,
      patientAge: Number(patientAge),
      patientGender,
      patientContact,
      detectionType,
      originalImage: `/uploads/images/${req.file.filename}`,
      annotatedImage: annotatedImage || `/uploads/images/${req.file.filename}`,
      detections,
      summary,
    });

    // Generate PDF report
    try {
      const pdf = await generateReportPDF(report, doctor);
      report.pdfPath = pdf.path;
      await report.save();
      console.log(`PDF generated: ${pdf.path}`);
    } catch (pdfErr) {
      console.error('PDF generation error (non-fatal):', pdfErr.message);
      // PDF failure is non-fatal — report is still saved
    }

    res.json({
      message: 'Detection completed successfully',
      report,
      detectionCount: detections.length,
    });

  } catch (err) {
    console.error('Detection controller error:', err);
    res.status(500).json({
      message: 'Internal server error during detection.',
      detail: err.message,
    });
  }
};