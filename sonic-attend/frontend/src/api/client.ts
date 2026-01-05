import axios from 'axios';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from '../config/firebase'; // Ensure app is exported default

const db = getFirestore(app);

// Base URL for Antigravity Backend
const API_URL = 'http://localhost:3000/api';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Auth Token via Firebase SDK
client.interceptors.request.use(async (config) => {
    // 1. Try to get token from Firebase Auth currentUser
    if (auth.currentUser) {
        try {
            const token = await auth.currentUser.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        } catch (e) {
            console.warn("Failed to get ID token", e);
        }
    } else {
        // Fallback for mock/dev if needed, or just let it fail at backend
        const mockToken = localStorage.getItem('authToken');
        if (mockToken && mockToken === 'mock-token') { // Only send mock if strictly in mock mode
            config.headers.Authorization = `Bearer ${mockToken}`;
        }
    }
    return config;
});

export const api = {
    auth: {
        login: async (email: string, pass: string, role: string) => {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);

            // Check Role from Firestore
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role !== role) {
                    await signOut(auth);
                    throw new Error(`Unauthorized. You are not a ${role}.`);
                }
            } else {
                // Handle legacy/missing doc cases if needed, or strictly deny
                await signOut(auth);
                throw new Error("User profile not found.");
            }

            localStorage.setItem('userRole', role);
            return userCredential.user;
        },
        signup: async (email: string, pass: string, name: string, role: string) => {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(userCredential.user, { displayName: name });

            // Store Role in Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email,
                name,
                role,
                createdAt: new Date().toISOString()
            });

            localStorage.setItem('userRole', role);
            return userCredential.user;
        },
        logout: async () => {
            await signOut(auth);
            localStorage.removeItem('userRole');
            localStorage.removeItem('authToken'); // Cleanup old mock stuff
        }
    },
    attendance: {
        startSession: async (subject: string, duration: number) => {
            const response = await client.post('/attendance/start', { subject, duration });
            return response.data;
        },
        stopSession: async () => {
            const response = await client.post('/attendance/stop');
            return response.data;
        },
        detect: async (sessionId?: string, token?: string, sonicCode?: string) => {
            const response = await client.post('/attendance/detect', { sessionId, token, sonicCode });
            return response.data;
        },
        heartbeat: async (sessionId: string) => {
            const response = await client.post('/attendance/heartbeat', { sessionId });
            return response.data;
        },
        getStats: async (sessionId: string) => {
            const response = await client.get(`/attendance/stats/${sessionId}`);
            return response.data;
        },
        getSession: async (sessionId: string) => {
            const response = await client.get(`/attendance/session/${sessionId}`);
            return response.data;
        }
    }
};

export default api;
