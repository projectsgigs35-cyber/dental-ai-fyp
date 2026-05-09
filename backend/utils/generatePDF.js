const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateReportPDF(report, doctor) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `report-${report._id}.pdf`;
    const outputPath = path.join(__dirname, '../uploads/reports', filename);
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // ─── PAGE 1: Header & Doctor Info ─────────────────────────
    // Header Background
    doc.rect(0, 0, 595, 100).fill('#f8fafc');
    
    doc
      .fillColor('#1e40af')
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('Dental AI Report', 50, 20, { align: 'left' });

    doc
      .fillColor('#0369a1')
      .fontSize(10)
      .font('Helvetica')
      .text('AI-Powered Dental Detection System', 50, 55);

    doc
      .fillColor('#64748b')
      .fontSize(9)
      .font('Helvetica')
      .text(`Report ID: ${report._id}`, 50, 70)
      .text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 50, 85);

    // Blue top border decorative line
    doc.moveTo(50, 110).lineTo(545, 110).strokeColor('#1e40af').lineWidth(2).stroke();

    doc.moveDown(3.5);

    // ─── Doctor Information Section ────────────────────────────
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('EXAMINING DOCTOR');
    doc.moveDown(0.3);
    
    // Doctor info box
    doc.rect(50, doc.y, 495, 100).stroke('#cbd5e1');
    doc.moveDown(0.5);
    
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text(doctor.name, 60, doc.y);
    doc.moveDown(0.4);
    doc.fontSize(10).font('Helvetica').fillColor('#334155')
      .text(`Qualifications: ${doctor.degrees}`, 60, doc.y)
      .text(`Clinic: ${doctor.clinicName}`, 60, doc.y)
      .text(`Address: ${doctor.clinicAddress}`, 60, doc.y)
      .text(`Contact: ${doctor.contactNo} | Email: ${doctor.email}`, 60, doc.y)
      .text(`Experience: ${doctor.yearsOfExperience} years`, 60, doc.y);

    doc.moveDown(2);

    // ─── Patient Information Section ───────────────────────────
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('PATIENT INFORMATION');
    doc.moveDown(0.3);

    // Patient info box
    doc.rect(50, doc.y, 495, 80).stroke('#cbd5e1');
    doc.moveDown(0.5);

    const patientInfo = [
      { label: 'Patient Name', value: report.patientName || 'Not Provided' },
      { label: 'Age', value: `${report.patientAge || 'N/A'} years` },
      { label: 'Gender', value: report.patientGender || 'Not Specified' },
      { label: 'Contact Number', value: report.patientContact || 'Not Provided' },
    ];

    patientInfo.forEach((info, idx) => {
      if (idx < 2) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b')
          .text(`${info.label}: `, 60, doc.y, { continued: true })
          .font('Helvetica').fillColor('#475569')
          .text(info.value);
      }
    });

    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b')
      .text(`${patientInfo[2].label}: `, 300, doc.y - 16, { continued: true })
      .font('Helvetica').fillColor('#475569')
      .text(patientInfo[2].value);

    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b')
      .text(`${patientInfo[3].label}: `, 300, doc.y, { continued: true })
      .font('Helvetica').fillColor('#475569')
      .text(patientInfo[3].value);

    doc.moveDown(2.5);

    // ─── Detection Type Section ────────────────────────────────
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('DETECTION TYPE');
    doc.moveDown(0.3);

    const detectionTypeBg = report.detectionType.toUpperCase() === 'PLAQUE' ? '#fef08a' : '#dbeafe';
    const detectionTypeColor = report.detectionType.toUpperCase() === 'PLAQUE' ? '#9a3412' : '#0c4a6e';
    
    doc.rect(50, doc.y, 495, 35).fill(detectionTypeBg);
    doc.fontSize(16).font('Helvetica-Bold').fillColor(detectionTypeColor)
      .text(report.detectionType.toUpperCase(), 50, doc.y + 8, { align: 'center' });

    doc.moveDown(2);

    // ─── AI Detection Results ──────────────────────────────────
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('AI DETECTION RESULTS');
    doc.moveDown(0.3);

    // Results box
    doc.rect(50, doc.y, 495, Math.max(60, 20 + (report.detections.length * 18))).stroke('#cbd5e1');
    doc.moveDown(0.5);

    if (report.detections.length === 0) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#16a34a')
        .text('✓ No pathologies detected', 60, doc.y);
    } else {
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b')
        .text(`Total Findings: ${report.detections.length}`, 60, doc.y);
      doc.moveDown(0.5);

      report.detections.forEach((d, i) => {
        const confidence = (d.confidence * 100).toFixed(1);
        const confidenceColor = confidence >= 80 ? '#dc2626' : confidence >= 60 ? '#ea580c' : '#eab308';
        
        doc.fontSize(9).font('Helvetica').fillColor('#1e293b')
          .text(`${i + 1}. ${d.class}`, 60, doc.y, { continued: true })
          .fillColor(confidenceColor).font('Helvetica-Bold')
          .text(` — ${confidence}%`, { continued: false });
        doc.moveDown(0.3);
      });
    }

    doc.moveDown(1.5);

    // ─── Summary Section ──────────────────────────────────────
    if (report.summary) {
      doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text('CLINICAL SUMMARY');
      doc.moveDown(0.3);

      doc.rect(50, doc.y, 495, 60).fill('#f0fdf4').stroke('#86efac');
      doc.moveDown(0.4);

      doc.fontSize(10).font('Helvetica').fillColor('#15803d')
        .text(report.summary, 60, doc.y, { width: 475, align: 'left' });

      doc.moveDown(2);
    }

    // ─── Annotated Image (on New Page) ─────────────────────────
    const imagePath = report.annotatedImage || report.originalImage;
    if (imagePath && fs.existsSync(path.join(__dirname, '..', imagePath.replace(/^\//, '')))) {
      // Add new page for image
      doc.addPage();

      // Page header
      doc.fillColor('#1e40af').fontSize(14).font('Helvetica-Bold')
        .text('Annotated X-Ray Image', 50, 50);

      doc.moveTo(50, 70).lineTo(545, 70).strokeColor('#1e40af').lineWidth(1.5).stroke();
      doc.moveDown(2);

      const absImagePath = path.join(__dirname, '..', imagePath.replace(/^\//, ''));
      try {
        // Add image with proper sizing to fit on page
        doc.image(absImagePath, 50, 90, { fit: [495, 600], align: 'center' });

        // Add info below image
        doc.moveDown(1);
        doc.fontSize(9).font('Helvetica').fillColor('#64748b')
          .text('Red boxes indicate detected pathologies. Confidence scores shown above.', { align: 'center' });
      } catch (e) {
        doc.fillColor('#dc2626').fontSize(11).text('⚠ Unable to embed image');
        console.error('Image embedding error:', e);
      }
    }

    // ─── Footer on Last Page ──────────────────────────────────
    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cbd5e1').lineWidth(0.5).stroke();
    doc.moveDown(1);

    doc.fillColor('#64748b').fontSize(9)
      .text('Disclaimer: This report was generated by Dental AI and is intended for clinical reference only.', { align: 'center' })
      .text('It should be reviewed and verified by a qualified dental professional before clinical use.', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve({ filename, path: `/uploads/reports/${filename}` }));
    stream.on('error', reject);
  });
}

module.exports = { generateReportPDF };