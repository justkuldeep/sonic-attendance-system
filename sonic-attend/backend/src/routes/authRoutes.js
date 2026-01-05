const express = require('express');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Protected Route Example
router.get('/me', verifyToken, (req, res) => {
    res.json({
        message: 'You are authenticated',
        user: req.user
    });
});

module.exports = router;
