<div align="center">
  <h1> Live Sports Events – WebSockets Backend</h1>
  <p><strong>Real-time sports event tracking with REST APIs and WebSocket broadcasting</strong></p>
  
  <img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/-Express_5-000000?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/-WebSockets-010101?style=for-the-badge&logo=Socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=React&logoColor=black" />
  <br/>
  <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white" />
  <img src="https://img.shields.io/badge/-Drizzle-C5F74F?style=for-the-badge&logo=Drizzle&logoColor=black" />
  <img src="https://img.shields.io/badge/-Zod-3E67B1?style=for-the-badge&logo=Zod&logoColor=white" />
  <br/>
  <img src="https://img.shields.io/badge/-Arcjet-5C2D91?style=for-the-badge&logo=Arcjet&logoColor=white" />
  <img src="https://img.shields.io/badge/-Site24x7-26CD66?style=for-the-badge&logo=Site24x7&logoColor=white" />
  <img src="https://img.shields.io/badge/-CodeRabbit-000000?style=for-the-badge&logo=CodeRabbit&logoColor=white" />
</div>

---

##  Overview

This project is a high-performance backend service for **live sports event tracking** and broadcasting. It combines **REST APIs** for match and commentary management with **WebSockets** for real-time score updates and play-by-play commentary.

The system is engineered to simulate and broadcast live match data efficiently while enforcing strict validation, rate limiting, and stable WebSocket behavior for optimal client experience.

---

##  Core Features

-  **REST APIs** for match and commentary CRUD operations
-  **WebSockets** for real-time live updates and broadcasting
-  **Match-based subscriptions** allowing clients to follow specific games
-  **Selective broadcasting** - only live matches receive real-time updates
-  **Strict validation** across both HTTP and WebSocket layers
-  **Rate limiting** and backpressure handling for stability
-  **Performance monitoring** with Site24x7 integration

---

##  Architecture

### HTTP Layer
- Match creation, retrieval, and listing
- Commentary creation and retrieval per match
- RESTful endpoint design with validation

### WebSocket Layer
- Real-time match-based subscriptions
- Live commentary and score broadcasts
- Heartbeat mechanisms (ping/pong)
- Backpressure and connection management

### Database Layer
- PostgreSQL with Drizzle ORM
- Relational schema for matches and commentary
- Optimized queries for real-time performance

### Seed Layer
- Simulates live games with dynamic data
- Generates realistic commentary and events
- Automated test data population

---

##  Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd live-sports-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure your database connection in .env
# DATABASE_URL=postgresql://user:password@localhost:5432/sports_db

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start the development server
npm run dev
```

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sports_db

# WebSocket
WS_MAX_SUBSCRIPTIONS=50
WS_RATE_LIMIT_BURST=20
WS_RATE_LIMIT_SUSTAINED=10
WS_MAX_PAYLOAD_SIZE=1048576
WS_BACKPRESSURE_LIMIT=1048576

# Monitoring (optional)
SITE24X7_API_KEY=your_api_key
```

---

## REST API Reference

### Matches

#### List Matches
```http
GET /matches?limit=50
```

**Query Parameters:**
- `limit` (optional): Number of matches to return (default: 50, max: 100)

**Response:**
```json
[
  {
    "id": 1,
    "sport": "football",
    "homeTeam": "FC Neon",
    "awayTeam": "Drizzle United",
    "homeScore": 2,
    "awayScore": 1,
    "status": "live",
    "startTime": "2025-02-01T12:00:00.000Z",
    "endTime": "2025-02-01T13:45:00.000Z",
    "createdAt": "2025-02-01T10:00:00.000Z"
  }
]
```

#### Create Match
```http
POST /matches
Content-Type: application/json
```

**Request Body:**
```json
{
  "sport": "football",
  "homeTeam": "FC Neon",
  "awayTeam": "Drizzle United",
  "startTime": "2025-02-01T12:00:00.000Z",
  "endTime": "2025-02-01T13:45:00.000Z"
}
```

**Status Values:**
- `scheduled` - Match hasn't started yet
- `live` - Match is currently in progress
- `finished` - Match has concluded

*Note: Status is automatically computed from `startTime` and `endTime`*

**Response:**
```json
{
  "id": 1,
  "sport": "football",
  "homeTeam": "FC Neon",
  "awayTeam": "Drizzle United",
  "homeScore": 0,
  "awayScore": 0,
  "status": "scheduled",
  "startTime": "2025-02-01T12:00:00.000Z",
  "endTime": "2025-02-01T13:45:00.000Z",
  "createdAt": "2025-02-01T10:00:00.000Z"
}
```

### Commentary

#### List Commentary for a Match
```http
GET /matches/:id/commentary?limit=100
```

**Path Parameters:**
- `id`: Match ID

**Query Parameters:**
- `limit` (optional): Number of commentary entries to return (default: 100, max: 500)

**Response:**
```json
[
  {
    "id": 1,
    "matchId": 1,
    "minute": 42,
    "sequence": 120,
    "period": "2nd half",
    "eventType": "goal",
    "actor": "Alex Morgan",
    "team": "FC Neon",
    "message": "GOAL! Powerful finish from the edge of the box.",
    "metadata": { "assist": "Sam Kerr" },
    "tags": ["goal", "shot"],
    "createdAt": "2025-02-01T12:42:00.000Z"
  }
]
```

#### Create Commentary for a Match
```http
POST /matches/:id/commentary
Content-Type: application/json
```

**Request Body:**
```json
{
  "minute": 42,
  "sequence": 120,
  "period": "2nd half",
  "eventType": "goal",
  "actor": "Alex Morgan",
  "team": "FC Neon",
  "message": "GOAL! Powerful finish from the edge of the box.",
  "metadata": { "assist": "Sam Kerr" },
  "tags": ["goal", "shot"]
}
```

**Event Types:**
- `goal` - Goal scored
- `yellow_card` - Yellow card issued
- `red_card` - Red card issued
- `substitution` - Player substitution
- `corner` - Corner kick
- `free_kick` - Free kick
- `penalty` - Penalty kick
- `offside` - Offside call
- `injury` - Player injury
- `var_review` - VAR review
- `general` - General commentary

---

## 🔌 WebSocket Protocol

### Connection

```javascript
// Basic connection
const ws = new WebSocket('ws://localhost:3000/ws');

// Auto-subscribe on connect
const ws = new WebSocket('ws://localhost:3000/ws?matchId=123');
```

### Client → Server Messages

#### Subscribe to a Match
```json
{
  "type": "subscribe",
  "matchId": 123
}
```

#### Unsubscribe from a Match
```json
{
  "type": "unsubscribe",
  "matchId": 123
}
```

#### Set Multiple Subscriptions
```json
{
  "type": "setSubscriptions",
  "matchIds": [1, 2, 3]
}
```

#### Heartbeat Ping
```json
{
  "type": "ping"
}
```

### Server → Client Messages

#### Welcome Message
```json
{
  "type": "welcome"
}
```

#### Subscription Confirmed
```json
{
  "type": "subscribed",
  "matchId": 123
}
```

#### Unsubscription Confirmed
```json
{
  "type": "unsubscribed",
  "matchId": 123
}
```

#### Current Subscriptions
```json
{
  "type": "subscriptions",
  "matchIds": [1, 2, 3]
}
```

#### Live Commentary Update
```json
{
  "type": "commentary",
  "data": {
    "id": 1,
    "matchId": 123,
    "minute": 42,
    "eventType": "goal",
    "message": "GOAL! Incredible strike from distance!",
    "actor": "Alex Morgan",
    "team": "FC Neon"
  }
}
```

#### Heartbeat Pong
```json
{
  "type": "pong"
}
```

#### Error Message
```json
{
  "type": "error",
  "code": "match_not_found",
  "message": "Match 999 not found",
  "matchIds": [999]
}
```

**Error Codes:**
- `match_not_found` - Requested match doesn't exist
- `max_subscriptions_exceeded` - Client exceeded subscription limit
- `rate_limit_exceeded` - Message rate limit exceeded
- `invalid_message` - Malformed message payload
- `payload_too_large` - Message payload exceeds size limit

### WebSocket Limits

| Limit | Value | Description |
|-------|-------|-------------|
| Max Subscriptions | 50 | Maximum matches per client |
| Rate Limit (Burst) | 20 | Initial burst allowance |
| Rate Limit (Sustained) | 10/sec | Sustained message rate |
| Max Payload Size | 1 MB | Maximum message size |
| Backpressure Limit | 1 MB | Connection closes if buffer exceeds |

---

## 📊 Performance Monitoring

The backend is actively monitored using **Site24x7**, providing real-time insights into:

- API response times
- WebSocket connection stability
- Database query performance
- Error rates and availability

**Current Performance Metrics:**
- Average response time: **~100ms**
- 99th percentile: **<200ms**
- Uptime: **99.9%**

![Site24x7 Response Time](https://res.cloudinary.com/dcj7zg7vi/image/upload/v1770029995/Screenshot_2026-02-02_162743_naxrso.png)

---

##  Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run WebSocket tests
npm run test:ws
```

---

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:reset         # Reset database

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking
```

---

##  Security

- **Rate Limiting**: Arcjet integration for DDoS protection
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **WebSocket Security**: Connection limits and backpressure handling
- **CORS Configuration**: Configurable allowed origins
- **Environment Variables**: Sensitive data in `.env` files

---


##  Acknowledgments

- Built with [Express 5](https://expressjs.com/)
- Real-time communication powered by native WebSockets
- Database management with [Drizzle ORM](https://orm.drizzle.team/)
- Validation with [Zod](https://zod.dev/)
- Security by [Arcjet](https://arcjet.com/)
- Monitoring by [Site24x7](https://www.site24x7.com/)
- Code review by [CodeRabbit](https://coderabbit.ai/)

---
