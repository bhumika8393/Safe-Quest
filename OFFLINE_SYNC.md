# SafeQuest: Offline Synchronization Logic

## 1. Data Packaging (Backend)
To provide offline travel data, the server pre-bundles data based on Regions (Zones).

- **Region Definitions**: Handled via bounding boxes or administrative boundaries (e.g., Paris City).
- **Bundle Content**:
    - `regional_map_data.pbf` (Map tiles/vectors).
    - `places.sqlite` (Cultural details, safe restaurants).
    - `emergency_contacts.json`.
    - `scam_indices.json` (Local risk clusters).

---

## 2. Sync Engine (Mobile Client)

### A. Initial Download
- User selects a "SafePack" (e.g., "Paris Safety Bundle").
- App downloads and extracts the SQLite bundle to local storage using **RN-FS**.
- Data is accessed via **SQLite / WatermelonDB** for high performance.

### B. Delta Updates (When Online)
- **Timestamp Strategy**: Client stores `last_updated_at` for its local dataset.
- **Request**: Client sends `/sync/delta?region_id=PAR&since=1715340000`.
- **Server Response**: Only provides records for that region that changed after the timestamp.
- **Conflict Handling**:
    - **Scam Reports**: Additive sync.
    - **Places Intelligence**: Server data overrides local data to ensure safety accuracy.

---

## 3. Background Monitoring
Even when the main app is "offline" relative to the server, it can:
- Trigger **Local SOS Alerts** (SMS doesn't need data, just cellular).
- Show **Proximity Alerts** for scams stored in the local `offline_scams` table.
- Calculate **Distance to nearest SOS point** (Medical/Police) using local PostGIS-enabled SQLite (SpatiaLite).
