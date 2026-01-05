const { admin } = require('../config/firebase');

// In-memory store for MOCK mode
const sessions = new Map();
const attendance = new Map(); // Key: sessionId_studentId

const startSession = async (req, res) => {
    try {
        const { subject, duration } = req.body;
        const facultyId = req.user ? req.user.uid : 'mock-faculty-id';

        if (!subject || !duration) {
            return res.status(400).json({ error: 'Subject and duration are required' });
        }

        const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sonicCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char code
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + duration * 60000);

        const sessionData = {
            sessionId,
            sonicCode,
            facultyId,
            subject,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            isActive: true,
            createdAt: admin && admin.firestore ? admin.firestore.FieldValue.serverTimestamp() : new Date()
        };

        if (admin && admin.apps && admin.apps.length > 0) {
            await admin.firestore().collection('sessions').doc(sessionId).set(sessionData);
        } else {
            console.log('[MOCK] Saving session to memory:', sessionId);
            sessions.set(sessionId, sessionData);
            // Index by sonicCode for retrieval
            sessions.set(sonicCode, sessionData);
        }

        const sonicToken = Buffer.from(JSON.stringify({ sid: sessionId, end: endTime.getTime(), code: sonicCode })).toString('base64');

        res.status(201).json({
            message: 'Session started successfully',
            data: { ...sessionData, sonicToken, sonicCode }
        });

    } catch (error) {
        console.error('Start Session Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const detectSonicPresence = async (req, res) => {
    try {
        const { sessionId, token } = req.body;
        const studentId = req.user ? req.user.uid : 'mock-student-id';

        if (!sessionId) return res.status(400).json({ error: 'Session ID is required' });

        let sessionData = null;

        if (admin && admin.apps && admin.apps.length > 0) {
            if (sessionId) {
                const doc = await admin.firestore().collection('sessions').doc(sessionId).get();
                sessionData = doc.exists ? doc.data() : null;
            } else if (req.body.sonicCode) {
                const query = await admin.firestore().collection('sessions')
                    .where('sonicCode', '==', req.body.sonicCode)
                    .where('isActive', '==', true)
                    .limit(1)
                    .get();
                if (!query.empty) sessionData = query.docs[0].data();
            }
        } else {
            if (sessionId) {
                sessionData = sessions.get(sessionId);
            } else if (req.body.sonicCode) {
                sessionData = sessions.get(req.body.sonicCode);
            }
        }

        if (!sessionData) {
            return res.status(404).json({ error: 'Session not found for provided ID or Code' });
        }

        // Ensure we always have the ID for logging
        const finalSessionId = sessionData.sessionId;

        const now = new Date();
        const endTime = new Date(sessionData.endTime);
        if (now > endTime) {
            return res.status(400).json({ status: 'rejected', reason: 'Session expired' });
        }

        const attendanceRecord = {
            sessionId,
            studentId,
            detectedAt: now.toISOString(),
            status: 'PENDING',
            lastHeartbeat: now.toISOString()
        };

        if (admin && admin.apps && admin.apps.length > 0) {
            // Query to see if already exists? For now just add.
            // In real app, use doc(sessionId_studentId) for idempotency
            await admin.firestore().collection('attendance').doc(`${sessionId}_${studentId}`).set(attendanceRecord);
        } else {
            const key = `${sessionId}_${studentId}`;
            console.log(`[MOCK] Recorded attendance for ${studentId} in session ${sessionId}`);
            attendance.set(key, attendanceRecord);
        }

        res.status(200).json({
            status: 'success',
            message: 'Sonic presence detected.',
            data: { status: 'PENDING' }
        });

    } catch (error) {
        console.error('Detection Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const recordHeartbeat = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const studentId = req.user ? req.user.uid : 'mock-student-id';

        if (!sessionId) return res.status(400).json({ error: 'Session ID is required' });

        const now = new Date();
        const key = `${sessionId}_${studentId}`;

        if (admin && admin.apps && admin.apps.length > 0) {
            const docRef = admin.firestore().collection('attendance').doc(key);
            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'No active attendance record found' });
            }
            await docRef.update({ lastHeartbeat: now.toISOString() });
        } else {
            if (!attendance.has(key)) {
                console.log('[MOCK] Heartbeat missed: No record for', key);
                return res.status(404).json({ error: 'No active attendance record found' });
            }
            const record = attendance.get(key);
            record.lastHeartbeat = now.toISOString();
            attendance.set(key, record);
            console.log(`[MOCK] Heartbeat updated for ${key} at ${now.toISOString()}`);
        }

        res.status(200).json({ status: 'ok', timestamp: now });

    } catch (error) {
        console.error('Heartbeat Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const stopSession = async (req, res) => {
    try {
        const facultyId = req.user ? req.user.uid : 'mock-faculty-id';
        let sessionId = null;
        let sessionData = null;

        // 1. Find Active Session for this Faculty
        if (admin && admin.apps && admin.apps.length > 0) {
            const query = await admin.firestore().collection('sessions')
                .where('facultyId', '==', facultyId)
                .where('isActive', '==', true)
                .limit(1)
                .get();

            if (!query.empty) {
                sessionId = query.docs[0].id;
                sessionData = query.docs[0].data();
            }
        } else {
            // Mock Mode
            for (const [key, val] of sessions.entries()) {
                if (val.facultyId === facultyId && val.isActive) {
                    sessionId = val.sessionId;
                    sessionData = val;
                    break;
                }
            }
        }

        if (!sessionId) {
            return res.status(404).json({ error: 'No active session found to stop' });
        }

        // 2. Mark Session as Inactive
        const now = new Date();
        if (admin && admin.apps && admin.apps.length > 0) {
            await admin.firestore().collection('sessions').doc(sessionId).update({
                isActive: false,
                actualEndTime: now.toISOString()
            });
        } else {
            sessionData.isActive = false;
            sessionData.actualEndTime = now.toISOString();
            sessions.set(sessionId, sessionData);
            // Also update the index by code if needed, but object ref might handle it
        }

        // 3. Finalize Attendance
        const stats = await finalizeAttendance(sessionId);

        res.json({
            message: 'Session stopped and attendance finalized',
            summary: stats
        });

    } catch (error) {
        console.error("Stop Session Error", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Helper: Finalize Attendance (Pending -> Confirmed/Invalid)
const finalizeAttendance = async (sessionId) => {
    let confirmed = 0;
    let invalid = 0;
    const now = new Date();
    // Threshold: Heartbeat within last 5 minutes to be valid
    const THRESHOLD_MS = 5 * 60 * 1000;

    if (admin && admin.apps && admin.apps.length > 0) {
        const snapshot = await admin.firestore().collection('attendance')
            .where('sessionId', '==', sessionId)
            .get();

        const batch = admin.firestore().batch();

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === 'PENDING') {
                const lastHeartbeat = new Date(data.lastHeartbeat).getTime();
                if (now.getTime() - lastHeartbeat < THRESHOLD_MS) {
                    batch.update(doc.ref, { status: 'CONFIRMED' });
                    confirmed++;
                } else {
                    batch.update(doc.ref, { status: 'INVALID', reason: 'Timeout' });
                    invalid++;
                }
            } else if (data.status === 'CONFIRMED') {
                confirmed++;
            }
        });

        await batch.commit();

    } else {
        // Mock Mode
        for (const [key, record] of attendance.entries()) {
            if (record.sessionId === sessionId && record.status === 'PENDING') {
                const lastHeartbeat = new Date(record.lastHeartbeat).getTime();
                if (now.getTime() - lastHeartbeat < THRESHOLD_MS) {
                    record.status = 'CONFIRMED';
                    confirmed++;
                } else {
                    record.status = 'INVALID';
                    invalid++;
                }
                attendance.set(key, record);
            } else if (record.sessionId === sessionId && record.status === 'CONFIRMED') {
                confirmed++;
            }
        }
    }

    return { confirmed, invalid };
};

const getSessionStats = async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

        let count = 0;
        let students = [];

        if (admin && admin.apps && admin.apps.length > 0) {
            const snapshot = await admin.firestore().collection('attendance')
                .where('sessionId', '==', sessionId)
                .get();

            count = snapshot.size;
            snapshot.forEach(doc => {
                students.push(doc.data());
            });
        } else {
            // Mock Mode
            for (const [key, record] of attendance.entries()) {
                if (record.sessionId === sessionId) {
                    count++;
                    students.push(record);
                }
            }
        }

        res.status(200).json({ count, students });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        let sessionData = null;

        if (admin && admin.apps && admin.apps.length > 0) {
            const doc = await admin.firestore().collection('sessions').doc(sessionId).get();
            sessionData = doc.exists ? doc.data() : null;
        } else {
            sessionData = sessions.get(sessionId);
        }

        if (!sessionData) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(200).json(sessionData);
    } catch (error) {
        console.error('Get Session Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { startSession, stopSession, detectSonicPresence, recordHeartbeat, getSessionStats, getSession };
