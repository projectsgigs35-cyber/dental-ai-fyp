const express = require('express');
const router = express.Router();
const { getReports, getReport, deleteReport, downloadPDF } = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/', auth, getReports);
router.get('/:id', auth, getReport);
router.delete('/:id', auth, deleteReport);
router.get('/:id/download', auth, downloadPDF);

module.exports = router;