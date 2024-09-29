const express = require('express');
const { saveVideo, deleteVideo } = require('../controllers/videoController');
const router = express.Router();

// Routes
router.post('/save', saveVideo);
router.delete('/delete/:id', deleteVideo);

module.exports = router;

