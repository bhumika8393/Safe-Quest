# 🛡️ SafeQuest: The Universal Safety Companion

**Empowering Travelers through Community Intelligence and AI-Driven Defense.**

SafeQuest is a next-generation safety platform designed to protect travelers in unfamiliar environments. It combines high-speed emergency broadcasting, community-verified scam intelligence, and AI-powered risk assessment into a single, seamless experience.

---

## 🚀 Key Features

### 🆘 Emergency Response
*   **Biometric SOS**: Trigger silent, encrypted GPS broadcasts using FaceID or TouchID.
*   **Guardian Network**: Real-time push notifications to high-trust community members ("Guardians") nearby.
*   **Incident Auditing**: Persistent, immutable logs of all safety events for insurance and legal purposes.

### 🕵️ Scam Defense
*   **Verified Intel**: Crowdsourced scam reports with photo/video evidence.
*   **Guardian Verification**: Human-in-the-loop verification to ensure the highest data quality.
*   **Real-time Maps**: Live heatmap of "Verified Patterns" like pickpockets, ATM skimmers, and fake guides.

### 🧠 Intelligence & Connectivity
*   **AI Copilot**: Multi-lingual assistant that provides local safety context and advice.
*   **Dynamic Risk Score**: Real-time safety rating based on your precise GPS coordinates.
*   **Offline SafePacks**: Download local safety data (Safe Zones, Scams, Contacts) for use in low-signal areas.

### 🔐 Security First
*   **AES-256 Encryption**: All location history is encrypted at rest using industry-standard AES-256 with per-event IVs.
*   **Privacy Shield**: We don't store plain-text location trails. Data is decrypted in-memory only for real-time safety services.

---

## 🛠️ Tech Stack

### Backend (NestJS)
*   **API**: TypeScript-based microservices architecture.
*   **Database**: PostgreSQL for persistent data, TypeORM for object mapping.
*   **Caching**: Redis for high-speed SOS coordinate tracking.
*   **Hardening**: Helmet, Throttler (Rate Limiting), and strict Validation Pipes.

### Mobile (React Native / Expo)
*   **UI/UX**: Premium aesthetics with high-contrast safety elements.
*   **Hardware**: Biometrics (LocalAuthentication), MapView, and push notifications.
*   **Offline**: AsyncStorage-based caching and local storage service.

---

## 🚦 Quick Start

### Prerequisites
*   Node.js v18+
*   Docker & Docker Compose (Optional, for easy setup)

### Full Stack via Docker
```bash
# 1. Start all services (DB, Redis, Backend, AI Mock)
docker-compose up --build

# 2. Access the API
# http://localhost:3000
```

### Manual Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

### Manual Mobile Setup
```bash
cd mobile
npm install
npx expo start
```

---

## 🏆 Contribution & Verifications
SafeQuest relies on a trust-based economy. Users earn **XP** and **Badges** for:
*   Reporting scams (+50 XP)
*   Verifying reports (+150 XP for Guardians)
*   Checking in at Safe Zones (+20 XP)
*   Sharing Community Safety Tips (+15 XP)

**Stay Safe. Quest Boldly.**
