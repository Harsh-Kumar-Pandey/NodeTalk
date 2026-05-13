<div align="center">

# 💬 NodeTalk

**A real-time chat application built with the MERN stack and WebSockets**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

</div>

---

## 📖 Overview

NodeTalk is a full-stack real-time messaging application supporting 1-on-1 and group conversations. It combines WebSocket-based instant delivery, Redis server-side caching, and React Query client-state management to deliver a snappy, low-latency chat experience.

---

## ✨ Features

- **Real-time messaging** via Socket.io — zero-refresh instant delivery
- **1-on-1 & group chats** with participant role management (member / admin)
- **Google OAuth 2.0** authentication alongside traditional email/password login
- **JWT-based auth** for secure, stateless session handling
- **Read receipts** with per-user last-read timestamps and unread counts
- **Media messages** — send images, videos, and files alongside text
- **Per-user soft delete** — remove chats from your inbox without affecting others
- **Friend system** with pending / accepted / rejected request states
- **Online presence** — live online status and last seen timestamps
- **Redis caching** on the backend, cutting MongoDB reads by over 40%
- **React Query** on the frontend for intelligent client-state caching and background refetching
- **Framer Motion** animations for fluid layout transitions

---

## ⚡ Performance Highlights

| Metric | Before | After |
|---|---|---|
| Session storage latency | 350 ms | 40 ms |
| UI paint time (cached data) | ~1000 ms | < 10 ms |
| MongoDB read operations | Baseline | ↓ 40%+ |

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Cache:** Redis — hot session & query caching
- **Real-time:** Socket.io (WebSockets)
- **Auth:** Passport.js (Google OAuth 2.0) + JWT

### Frontend
- **UI:** React.js
- **Data fetching & caching:** React Query (TanStack Query)
- **Animations:** Framer Motion

---

## 🗄️ Data Models

### `User`
Stores account credentials, OAuth identifiers, friend relationships, and presence state.

```
User
├── name, email, password (hashed with bcryptjs)
├── googleId              — OAuth identity
├── avatar
├── friends[]             — { friendId, status, requestedBy, createdAt }
├── isOnline, lastSeen
└── socketId
```

### `Chat`
Supports both direct (1-on-1) and group conversations.

```
Chat
├── participants[]        — { user, role, joinedAt, deletedAt, lastReadAt }
├── chatKey               — deduplication key for direct chats (sorted uid pair)
├── isGroup, groupMeta    — { name, avatarUrl }
├── lastMessage           — ref → Message
└── createdBy
```

**Indexes:**
- `(participants.user, participants.deletedAt, updatedAt)` — inbox queries
- `(isGroup, updatedAt)` — group listing / admin tooling

### `Message` + `ReadReceipt`
Tracks message content, media attachments, and per-user read state.

```
Message
├── chatId, senderId
├── content, messageType  — text | image | video | file
├── media                 — { url, filename, size }
└── deletedFor[]          — per-user soft delete

ReadReceipt
├── messageId, chatId, userId
└── readAt
```

**Indexes:**
- `(chatId, createdAt)` — paginated message history
- `(messageId, userId)` unique — prevents duplicate receipts
- `(chatId, userId)` — unread count queries

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB
- Redis

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nodetalk.git
cd nodetalk

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
```

### Running the App

```bash
# Start the backend
cd server && npm run dev

# Start the frontend (new terminal)
cd client && npm start
```

The app will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```
nodetalk/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/          # React Query hooks
│   │   ├── pages/
│   │   └── socket/         # Socket.io client setup
│   └── ...
├── server/                 # Express backend
│   ├── models/
│   │   ├── Chat.js
│   │   ├── Message.js      # Message + ReadReceipt
│   │   └── User.js
│   ├── routes/
│   ├── controllers/
│   ├── socket/             # Socket.io event handlers
│   ├── cache/              # Redis caching logic
│   └── middleware/         # JWT + auth middleware
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License.
