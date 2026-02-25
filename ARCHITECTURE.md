# SafeQuest: System Architecture & Implementation Blueprint

## 1. System Architecture Overview

SafeQuest is built using a **Modular Microservices Architecture** to ensure high availability, specialized scaling, and extreme reliability for its core safety features.

### Layered Diagram
- **Edge Layer**: AWS CloudFront (CDN), AWS WAF (Security), API Gateway (Rate Limiting, Auth).
- **Service Layer**:
    - **Identity Service**: JWT, OAuth2, Role-Based Access Control (RBAC).
    - **Safety & SOS Service**: Real-time GPS streaming via WebSockets, Twilio integration.
    - **AI Intelligence Service**: Python-based FastAPI service for Scam Detection and RAG.
    - **Regional Data Service**: Manages place intelligence, cultural data, and food safety.
    - **Gamification & Rewards**: Event-driven engine for XP, badges, and scores.
    - **Offline Sync Service**: Manages regional data packaging and delta updates.
- **Data Layer**:
    - **PostgreSQL + PostGIS**: Primary relational and spatial database.
    - **Redis**: Real-time caching for live SOS sessions and leaderboard stats.
    - **Pinecone**: Vector database for AI context retrieval (RAG).
    - **SQLite (Mobile)**: On-device storage for offline capability.

---

## 2. Real-Time Data Flow

### A. Emergency SOS Flow
1. **Trigger**: User activates SOS (Long press or Tap).
2. **Streaming**: Mobile app initiates a WebSocket connection to the Safety Service.
3. **Broadcasting**: Safety Service pushes live GPS packets to:
    - **Emergency Dashboard**: For monitoring by trusted contacts.
    - **FCM/APNs**: To send push notifications to trusted contacts.
    - **Twilio**: To send SMS/Call alerts with a live tracking link.
4. **Logging**: Every packet is indexed in Redis for real-time viewing and eventually archived in PostgreSQL.

### B. Scam Alert & Geofencing
1. **Monitoring**: Mobile app reports background location periodically (or uses OS Geofencing).
2. **Detection**: API Gateway routes location to the Safety Service.
3. **Query**: Service performs a PostGIS query to find active scams within a 500m radius.
4. **Push**: If risk > Threshold, a high-priority push notification is sent to the user.

---

## 3. Scalability Strategy

- **Horizontal Pod Autoscaling (HPA)**: Critical for the AI and Safety services during peak tourism seasons (e.g., Summer in Europe).
- **Database Sharding**: `scam_reports` and `user_activities` are sharded by geographic region (RegionIDs).
- **CDN Caching**: Static cultural data and maps are served via Edge locations.
- **Write-Behind Pattern**: Gamification XP updates are queued in Redis and written to PostgreSQL in batches to reduce DB load.

---

## 4. Production Deployment Plan

### Cloud Infrastructure (AWS Focus)
- **Compute**: Amazon EKS (Kubernetes) for microservices.
- **Database**: Amazon RDS (PostgreSQL), Amazon ElastiCache (Redis).
- **AI**: Amazon SageMaker for model hosting (Scam detection models).
- **Messaging**: Amazon SQS for notification queues.

### CI/CD Pipeline
- **GitHub Actions**: 
    - Linting & Unit Tests.
    - Docker Image Creation.
    - Push to Amazon ECR.
    - Deploy to EKS using Helm charts.

---

## 5. Security & Privacy
- **AES-256**: All user location history is encrypted at rest.
- **Short-Lived Tokens**: Access tokens expire in 15 mins; Refresh tokens stored in secure storage.
- **Privacy Zero-Knowledge**: Opt-out for location tracking when not in "Active Safety Mode".
