const express = require('express');
const authRoutes = require('./authRoutes');
const attendanceRoutes = require('./attendanceRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/attendance', attendanceRoutes);

// Placeholder routes
router.get('/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

module.exports = router;
