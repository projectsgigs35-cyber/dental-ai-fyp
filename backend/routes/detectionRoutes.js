const express = require('express');
const router = express.Router();
const { runDetection } = require('../controllers/detectionController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/run', auth, upload.single('image'), runDetection);

module.exports = router;