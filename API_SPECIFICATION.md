# SafeQuest: API Endpoint Structure

## Base URL: `https://api.safequest.com/v1`

---

### 1. Authentication Service
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register new traveler | No |
| POST | `/auth/login` | Login and get JWT | No |
| POST | `/auth/refresh` | Refresh expired access token | Yes |
| GET | `/auth/me` | Get current user profile | Yes |

### 2. Safety & SOS Service
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/sos/trigger` | Manually initiate SOS alert | Yes |
| GET | `/sos/active` | Check if current user has active SOS | Yes |
| POST | `/sos/resolve` | Mark SOS as safe/resolved | Yes |
| WSS | `/sos/stream` | WebSocket for real-time GPS stream | Yes |

### 3. Scam Detection AI
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/scams/report` | Submit a new scam report | Yes |
| GET | `/scams/nearby` | Get scams in radius of 5km | Yes |
| GET | `/scams/heatmap` | Get geo-json for scam intensity | No |
| POST | `/scams/analyze` | AI analysis of a specific text report | Yes |

### 4. Place Intelligence (RAG)
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/places/discover` | Get list of places with safety scores | No |
| GET | `/places/:id` | Detailed cultural & safety intel | No |
| POST | `/chat/copilot` | Conversational RAG travel assistant | Yes |

### 5. Gamification
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/rewards/status` | Current XP, Level, and Badges | Yes |
| POST | `/rewards/check-in` | Earn XP for visiting a safe location | Yes |
| GET | `/rewards/leaderboard`| Global or Regional ranking | Yes |

---

## Response Format
```json
{
  "status": "success",
  "data": { ... },
  "metadata": {
    "timestamp": "2024-05-10T12:00:00Z",
    "region": "Rome"
  }
}
```
