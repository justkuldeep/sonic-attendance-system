const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { startSession, stopSession, detectSonicPresence, recordHeartbeat, getSessionStats, getSession } = require('../controllers/attendanceController');

const router = express.Router();

router.post('/start', verifyToken, startSession);
router.post('/detect', verifyToken, detectSonicPresence);
router.post('/heartbeat', verifyToken, recordHeartbeat);
// Get real-time stats (faculty)
router.get('/stats/:sessionId', verifyToken, getSessionStats);
router.get('/session/:sessionId', verifyToken, getSession);
router.post('/stop', verifyToken, stopSession);

module.exports = router;
