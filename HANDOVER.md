# SafeQuest Handover Document

## 🚀 Project Overview
SafeQuest is a community-driven safety platform for travelers. This document outlines the technical state of the platform and steps for deployment.

## 🛠️ Components

### 1. Backend (NestJS)
- **Status**: Build verified. Production-hardened.
- **Key Features**:
  - **AES-256 Encryption**: Location data in SOS events is encrypted at rest.
  - **Rate Limiting**: 10 requests/min per IP.
  - **Security Headers**: Helmet integration.
  - **Guardian Engine**: XP and verification logic for scam reports.
- **Run Locally**:
  ```bash
  cd backend
  npm install
  npm run start:dev
  ```

### 2. Mobile (Expo/React Native)
- **Status**: Multi-functional UI with biometric integration.
- **Key Features**:
  - **Biometric SOS**: FaceID/TouchID trigger for silent alerts.
  - **Community Tips**: Social feed for local safety advice.
  - **Heatmap**: Real-time danger zone visualization.
- **Run Locally**:
  ```bash
  cd mobile
  npm install
  npx expo start
  ```

### 3. Database & Cache
- **PostgreSQL**: Stores users, scams, safe zones, and encrypted SOS events.
- **Redis**: Real-time tracker for active SOS coordinates (TTL based).

## 🐳 Deployment (Docker)
The easiest way to run the full stack is via Docker Compose:
1. Ensure Docker is running.
2. Run `docker-compose up --build`.
3. The API will be available at `http://localhost:3000`.

## 📍 Initial Data (Seeding)
To populate the database with global hubs (Rome, London, Paris, Tokyo):
- **Seed Safe Zones**: `POST http://localhost:3000/safety/admin/seed-safe-zones`
- **Seed Scams**: `POST http://localhost:3000/scams/admin/seed-scams`

## 🔮 Future Roadmap
- **Production Encryption Key**: Replace the default key in `docker-compose.yml`.
- **Firebase Messaging**: Swap out the Expo Push Mock for FCM for native background notifications.
- **PostGIS integration**: Further optimize spatial queries for high-density metropolitan areas.

---
**SafeQuest Team**  
*February 2026*
