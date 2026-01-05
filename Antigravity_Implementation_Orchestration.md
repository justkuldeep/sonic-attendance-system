
# Antigravity – Implementation Orchestration
## Sonic Attendance System (Post-UI Phase)

This document describes the **step-by-step backend and logic orchestration** for Antigravity after the frontend UI has been completed using Lovable.  
The ideation is assumed to be finalized in `Project-Idation.txt`.

---

## 0. Objective of Antigravity
Antigravity is the **authoritative backend orchestration layer** responsible for:
- Validating sonic presence
- Enforcing time-based participation
- Preventing proxy attendance
- Maintaining audit-safe attendance records

> UI only requests actions. Antigravity decides outcomes.

---

## 1. Phase 1: UI Freeze & Action Mapping

### What to do
- Freeze all Lovable-generated UI screens and flows.
- List all user actions (button clicks, page loads, timers).

### Outcome
- Each UI action is mapped to one backend responsibility.
- No business logic remains in UI.

---

## 2. Phase 2: Backend Skeleton Setup

### What to do
- Initialize Antigravity backend (Firebase + Cloud Functions / Node.js).
- Set up core services:
  - Authentication Service
  - Attendance Session Service
  - Sonic Verification Service
  - Time Enforcement Service

### Outcome
- Clean, modular backend structure.

---

## 3. Phase 3: Authentication & Session Control

### What to do
- Verify Firebase Auth token on every request.
- Maintain one active session per user.

### Rules
- No parallel logins allowed.
- Logout event is tracked server-side.

### Outcome
- Identity enforced without IMEI or hardware identifiers.

---

## 4. Phase 4: Faculty Attendance Session Creation

### What to do
- Faculty initiates attendance from UI.
- Antigravity generates:
  - attendance_session_id
  - subject_id
  - start_time
  - expiry_time

### API
POST /attendance/start

### Outcome
- Backend fully controls attendance lifecycle.

---

## 5. Phase 5: Sonic Detection Validation

### What to do
- Student app detects ultrasonic frequency.
- UI sends detection request with:
  - session_id
  - student_id
  - detection_timestamp

### Backend Validation
- Session active
- Timestamp valid
- Student not already marked

### Outcome
- Attendance marked as **PENDING**.

---

## 6. Phase 6: Time-Bound Presence Enforcement

### What to do
- Start 10-minute server-side timer.
- Require continuous session validity.

### Invalid Conditions
- Logout
- App closed
- Heartbeat missing

### Outcome
- Attendance becomes INVALID if conditions fail.

---

## 7. Phase 7: Heartbeat & Anti-Bypass Logic

### What to do
- UI sends heartbeat every 20–30 seconds.

### Backend Checks
- Session still active
- No abnormal gaps

### Outcome
- Continuous presence confirmed.

---

## 8. Phase 8: Attendance Finalization

### What to do
- After 10 minutes:
  - Mark attendance as CONFIRMED
  - Lock record (read-only)

### Outcome
- Tamper-proof attendance record.

---

## 9. Phase 9: Data Storage & Audit Trail

### Stored Fields
- session_id
- student_id
- faculty_id
- timestamps
- attendance_status

### Privacy
- No IMEI
- No biometrics
- No hardware fingerprinting

---

## 10. Phase 10: Analytics & History APIs

### Faculty
- Session summary
- Attendance count

### Student
- Attendance history
- Status visibility

---

## 11. Phase 11: Failure Handling

### Scenarios
- Network drop
- App crash
- Late detection

### Strategy
- Grace window
- Retry logic
- Auto-cleanup stale sessions

---

## 12. Phase 12: Security Hardening

### Measures
- Token validation
- Rate limiting
- Firebase security rules

### Outcome
- Production-ready backend

---

## Final Architecture Principle

UI = Interface  
Antigravity = Authority

> Presence is proven by sound.  
> Participation is proven by time.

---

## One-Line Summary
Antigravity orchestrates sonic validation, enforces continuous presence, and finalizes attendance independent of the frontend.

