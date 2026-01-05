# Sonic Attendance System 🔊✅

A modern, high-security attendance management system that leverages **Ultrasonic Sonic Codes** for contact-less, proximity-based verification.

## 📌 Problem Statement

Traditional attendance systems often suffer from several drawbacks:
- **Proxy Attendance:** Plastic ID cards and simple QR codes are easily shared, leading to fraudulent attendance.
- **Hardware Costs:** Biometric systems require expensive dedicated hardware and maintenance.
- **Inefficiency:** Manual registers are slow and prone to human error.
- **Proximity Ambiguity:** GPS-based systems can be spoofed or lack the granularity needed for indoor classroom environments.

## 🚀 Solution Approach: Sonic Attendance

The **Sonic Attendance System** solves these issues by using high-frequency (near-ultrasonic) sound waves to transmit unique, time-sensitive attendance codes.

### How it works:
1.  **Session Generation:** The Faculty starts a session on their dashboard.
2.  **Sonic Transmission:** The faculty's device broadcasts a "Sonic Code" (using the `ggwave` protocol). This code is audible as a short burst of data or can be configured to be near-ultrasonic (barely audible to humans).
3.  **Proximity Verification:** Since sound waves are confined by walls, only students physically present in the room can pick up the code using their device's microphone.
4.  **Automatic Marking:** The student's app decodes the sound and automatically communicates with the backend to verify the code and mark the attendance in real-time.

**Key Advantages:**
- **Zero-Proxy:** Codes change rapidly and require physical proximity within earshot.
- **Hardware-Agnostic:** Works on any standard smartphone or laptop with a speaker and microphone.
- **Frictionless:** Students don't need to scan anything or stand in line.

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **State Management:** TanStack Query (React Query)
- **Styling:** Tailwind CSS & Shadcn UI (for a premium, modern aesthetic)
- **Audio Processing:** `ggwave` (WebAssembly-based audio data encoding/decoding)
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Firebase Firestore (Real-time updates)
- **Authentication:** Firebase Auth
- **Admin SDK:** Firebase Admin SDK (Secret verification and management)

## 🏗 Project Structure

```text
.
├── sonic-attend/
│   ├── frontend/       # React application (Vite-powered)
│   └── backend/        # Express.js server & Firebase integration
├── SECRETS_TEMPLATE.txt # Template for configuration variables
└── README.md           # This documentation
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- A Firebase Project

### 1. Environment Configuration
Copy the contents of `SECRETS_TEMPLATE.txt` into a new `.env` file in both the `frontend` and `backend` directories and fill in your Firebase credentials.

### 2. Backend Setup
```bash
cd sonic-attend/backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd sonic-attend/frontend
npm install
npm run dev
```

## 🔐 Security
The system ensures that attendance data is tamper-proof by validating every Sonic Code on the server using Firebase Admin privileges. IP and proximity checks are built into the protocol handles.

---
Developed with ❤️ by Kuldeep.
