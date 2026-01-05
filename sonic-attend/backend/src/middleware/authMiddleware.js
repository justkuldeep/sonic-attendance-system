const { auth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        if (auth) {
            const decodedvToken = await auth.verifyIdToken(token);
            req.user = decodedvToken;
            next();
        } else {
            // MOCK MODE for dev without Firebase creds
            if (token === 'mock-token') {
                req.user = { uid: 'mock-user-123', email: 'mock@test.com' };
                next();
            } else {
                throw new Error('Invalid mock token');
            }
        }
    } catch (error) {
        console.error('Auth Error:', error.message);
        return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = verifyToken;
