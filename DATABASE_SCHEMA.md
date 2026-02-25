# SafeQuest: Database Schema Design

## 1. Core Relational Schema (Postgres + PostGIS)

### `users` Table
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password_hash`: String
- `phone_number`: String
- `safety_score`: Integer (0-100)
- `trust_level`: Enum (Newbie, Reliable, Guardian)
- `xp_points`: Integer
- `emergency_contacts`: JSONB (List of names and numbers)
- `created_at`: Timestamp

### `locations` Table (Place Intelligence)
- `id`: Long (Primary Key)
- `name`: String
- `coordinates`: GEOGRAPHY(POINT) (PostGIS)
- `category`: Enum (Historical, Museum, Food, SafeZone)
- `cultural_summary`: Text
- `historical_details`: JSONB
- `etiquette_tips`: JSONB
- `safety_rating`: Decimal
- `verified_status`: Boolean

### `scam_reports` Table
- `id`: UUID (Primary Key)
- `reporter_id`: UUID (FK to users)
- `location`: GEOGRAPHY(POINT)
- `scam_type`: Enum (Overpricing, FakeGuide, Theft, Trap)
- `description`: Text
- `risk_level`: Integer (1-10)
- `media_urls`: Array(String)
- `status`: Enum (Pending, Verified, Dismissed)
- `report_time`: Timestamp

### `sos_events` Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (FK to users)
- `start_time`: Timestamp
- `end_time`: Timestamp (Nullable)
- `initial_location`: GEOGRAPHY(POINT)
- `status`: Enum (Active, Resolved, FalseAlarm)
- `recording_data_url`: String (S3 link to audio/video recordings if triggered)

---

## 2. Real-Time Segment (Redis)

### `active_tracking:<user_id>` (Hash)
- `last_lat`: Float
- `last_long`: Float
- `timestamp`: Long
- `battery_level`: Integer

### `leaderboard:global` (Sorted Set)
- `score`: xp_points
- `member`: user_id

---

## 3. AI Vector Store (Pinecone)

### `cultural_intelligence` Namespace
- `id`: PlaceID
- `values`: Float1536 (OpenAI Embeddings)
- `metadata`: `{ "name": "...", "region": "...", "safety_tips": "..." }`

---

## 4. On-Device Sync (SQLite)

### `offline_places`
- Identical to `locations` but narrowed to current/downloaded region.

### `offline_scams`
- Recent and verified scam reports for the region.
