# FinFlow — BFSI / Digital Wallet Platform (MERN)

A portfolio-grade BFSI demo application inspired by digital banking/wallet platforms. It demonstrates secure authentication, role-based access, wallets, internal transfers, beneficiaries, transaction history, KYC workflow, notifications, audit logs, and admin analytics.

> **Important:** This is an educational/demo financial application. It is not a production banking system and should not be used with real money, real customer PII, or real financial transactions without extensive security, compliance, legal, and infrastructure work.

## Stack

- Frontend: React + Vite + React Router + Zustand + Axios
- Backend: Node.js + Express + Mongoose
- Database: MongoDB / MongoDB Atlas
- Auth: JWT access token + bcrypt password hashing
- Security: Helmet, CORS, rate limiting, validation, role-based access control
- Deployment-ready: Vercel/Netlify for client, Render/Railway/AWS for server

## Features

### Customer
- Registration / login / logout
- Dashboard with wallet balance and recent activity
- Add-money simulation for demo purposes
- Send money to another user
- Beneficiary management
- Transaction history with filters
- KYC profile and verification status
- Profile management
- Notifications

### Admin
- Admin dashboard
- User listing and search
- KYC review / approve / reject
- Transaction monitoring
- Audit log viewing
- User activation/deactivation

### Architecture

```text
FinFlow-BFSI/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── lib/
│       ├── pages/
│       ├── store/
│       └── styles/
├── server/                 # Express API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
├── .env.example
└── README.md
```

## Local setup

### 1. MongoDB

Create a MongoDB database locally or in MongoDB Atlas.

### 2. Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 3. Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

### Demo admin

Run the seed script after the server is configured:

```bash
cd server
npm run seed
```

Admin: `admin@finflow.demo`
Password: `Admin@12345`

Demo customer: `demo@finflow.demo`
Password: `Demo@12345`

## Environment variables

Server `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finflow
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Client `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

1. Create a MongoDB Atlas database and network rule.
2. Deploy the `server` directory to Render/Railway/AWS.
3. Set the server environment variables in the hosting dashboard.
4. Deploy the `client` directory to Vercel/Netlify.
5. Set `VITE_API_URL` to the deployed API URL.
6. Add the client URL to `CLIENT_URL` on the API server.

## Suggested portfolio upgrades

- Refresh-token rotation and device/session management
- Redis caching and distributed rate limiting
- Idempotency keys for money-movement APIs
- Double-entry ledger instead of a single-balance model
- Webhooks from a sandbox payment provider
- KYC document storage in S3/Cloudinary
- Email/SMS/WhatsApp notifications
- Fraud rules engine and risk scoring
- OpenAI/Claude RAG assistant using a separate AI service
- Docker, CI/CD, automated tests, structured logging and observability
