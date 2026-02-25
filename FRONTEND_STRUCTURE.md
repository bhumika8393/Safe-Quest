# SafeQuest: Frontend Component Structure (React Native)

## 1. Directory Structure

```text
src/
├── assets/          # SVG Icons, Images, Fonts
├── components/
│   ├── common/      # SOSButton, Header, Card, CustomText
│   ├── map/         # HeatmapLayer, UserMarker, PlacePOI
│   ├── chat/        # MessageBubble, SuggestedActions
│   └── safety/      # RiskBadge, SafetyScoreMeter, EmergencyContacts
├── navigation/
│   ├── AppNavigator.tsx
│   ├── BottomTabNavigator.tsx
│   └── SOSStack.tsx
├── screens/
│   ├── Home/
│   ├── Discover/
│   ├── AIChat/
│   ├── SOS/
│   └── Profile/
├── store/           # Redux Toolkit / Zustand
├── services/        # API, WebSocket, LocationTracker
└── utils/           # GeoUtils, OfflineSync, Permissions
```

---

## 2. Key UI Components

### `SOSButton` (Critical)
- **Visuals**: High-contrast, large, pulsating border when active.
- **Behavior**: Long-press (3s) to prevent accidental triggers. Countdown UI shown.
- **State**: Tied to `sosSlice` in Redux to ensure visibility across all screens during an emergency.

### `SafetyMap` (Home Screen)
- **Integration**: `react-native-maps` with Google Maps SDK.
- **Layers**:
    - `BaseLayer`: Standard Map.
    - `ScamHeatmap`: Semi-transparent circles colored by risk level (Green-Orange-Red).
    - `VerifiedSafeZones`: Blue icons for police/medical points.

### `TravelCopilot` (Chat Screen)
- **Interface**: Smooth scrolling list with `GiftedChat` or custom implementation.
- **Quick-Actions**: Horizontal chips for "Am I Safe?", "Local Etiquette", "Emergency Numbers".

---

## 3. Sensor & API Integration
- **Geolocation**: `react-native-geolocation-service` for foreground/background tracking.
- **Sensor APIs**: `react-native-sensors` to detect sudden impacts or abnormal motion for "Impact SOS".
- **Real-time**: `socket.io-client` for live GPS streaming during active SOS.
