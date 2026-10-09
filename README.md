# FinFlow — BFSI Digital Wallet Platform (MERN Stack)

FinFlow is a full-stack financial management and digital wallet demo application built using the MERN stack. It demonstrates core BFSI (Banking, Financial Services, and Insurance) workflows, including wallet management, internal money transfers, beneficiary management, transaction history, KYC verification, notifications, audit logs, and administrative analytics.

The project is designed to demonstrate full-stack development, REST API architecture, authentication, role-based access control, database modeling, and deployment practices.

> **Important:** FinFlow is an educational portfolio project. It is not a production banking system. All financial activities are simulated. Do not use real money, real customer personal information, or production banking credentials.

## Features

### Customer Module

- User registration, login, and logout
- JWT-based authentication
- Customer dashboard with wallet balance and recent transactions
- Simulated add-money functionality
- Internal wallet-to-wallet transfers
- Beneficiary management
- Transaction history and filtering
- KYC profile and verification status
- Profile management
- In-app notifications
- Transaction status tracking

### Admin Module

- Administrative dashboard and transaction statistics
- User listing and search
- User activation and blocking
- KYC review, approval, and rejection workflows
- Transaction monitoring
- Audit log viewing
- Customer account and status management

### Security and Backend

- Password hashing with bcrypt
- Protected API routes
- Role-based access control (RBAC)
- Request validation
- Helmet security headers
- CORS configuration
- Rate limiting
- Centralized error handling
- Environment-based configuration
- MongoDB database integration

## Technology Stack

**Frontend**
- React.js
- Vite
- React Router
- Zustand
- Axios
- HTML5, CSS3, and JavaScript

**Backend**
- Node.js
- Express.js
- RESTful APIs
- JWT authentication
- bcryptjs

**Database**
- MongoDB
- Mongoose
- MongoDB Atlas

**Security**
- Role-based access control
- Helmet
- CORS
- Rate limiting
- Input validation

**Tools and Deployment**
- Git and GitHub
- Vercel or Netlify for the frontend
- Render, Railway, or AWS for the backend
- MongoDB Atlas for cloud database hosting

## Project Architecture

```text
FinFlow-BFSI/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
├── API.md
├── package.json
└── docker-compose.yml
```

*Note: The exact files and folders may differ slightly depending on your current implementation.*

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB locally or a MongoDB Atlas account
- Git
- Visual Studio Code or another code editor

## Installation and Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/finflow-bfsi-platform.git
cd finflow-bfsi-platform
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

### 2. Configure MongoDB

You can use a local MongoDB database or MongoDB Atlas.

For local development, the database URL can be:

```env
MONGO_URI=mongodb://127.0.0.1:27017/finflow
```

For MongoDB Atlas, use your own database connection string and keep it private.

### 3. Configure the Backend

Open a terminal in the project root:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finflow
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Update the variables according to your environment.

Start the backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### 4. Configure the Frontend

Open a second terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

**Note:** Run the commands in the relevant directories. If your project already has root-level installation scripts, you can use those instead.

## Demo Accounts

Run the database seed script before using the demo accounts.

**Admin**

```text
Email: admin@finflow.demo
Password: Admin@12345
```

**Demo Customer**

```text
Email: demo@finflow.demo
Password: Demo@12345
```

Additional demo accounts may be available in the seed script for testing different KYC and account statuses.

> These credentials are intended only for local or isolated demo environments. Change or disable demo accounts before publishing a publicly accessible deployment.

## Database Seeding

The seed script populates the demo database with fictional users and sample financial records.

Run the following commands from the backend directory:

```bash
cd server
npm run seed
```

Depending on your seed script, the data may include:

- Demo administrators and customers
- Wallet transaction history
- Beneficiaries
- KYC statuses
- Notifications
- Audit log entries

**Warning:** The seed script may delete and recreate reserved demo records. Always use a dedicated demo database. Never run it against a production or real-customer database.

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for signing JWTs |
| `CLIENT_URL` | Allowed frontend origin for CORS |
| `NODE_ENV` | Application environment |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

Do not commit real environment files, passwords, API keys, JWT secrets, or database credentials to GitHub.

## Deployment Guide

### Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with an appropriately restricted role.
3. Configure network access for your deployment environment.
4. Copy the database connection string.
5. Add it as `MONGO_URI` in your backend hosting environment.

Avoid unrestricted network access in production.

### Step 2: Deploy the Backend

You can deploy the Express API using Render, Railway, or AWS.

1. Connect your GitHub repository.
2. Select the `server` directory as the root directory if your hosting platform supports monorepos.
3. Configure the build and start commands according to `server/package.json`.
4. Add the required environment variables.
5. Deploy and test the API endpoints.

### Step 3: Deploy the Frontend

You can deploy the React application using Vercel or Netlify.

1. Connect the same GitHub repository.
2. Set the frontend root directory to `client`.
3. Configure the build command and output directory for Vite.
4. Set `VITE_API_URL` to your deployed backend API URL.
5. Deploy the frontend.

### Step 4: Configure CORS

Set `CLIENT_URL` on the backend to the actual deployed frontend origin.

For example:

```env
CLIENT_URL=https://your-finflow-frontend.vercel.app
```

If authentication relies on cookies, ensure the frontend HTTP client and backend CORS configuration support credentials correctly, and configure cookie settings for HTTPS and cross-site requests as needed.

### Step 5: Test the Deployment

Verify that:

- Registration and login work.
- Protected routes reject unauthenticated requests.
- Customer and admin permissions are enforced.
- Demo wallet and transaction views load correctly.
- Beneficiaries and notifications work.
- KYC status changes are reflected in the interface.
- API failures are handled gracefully.

## Suggested Future Enhancements

The following are potential improvements, not claims that they are already implemented:

- Refresh-token rotation and session management
- Idempotency keys for money-movement APIs
- Double-entry accounting ledger
- Atomic database transactions for wallet transfers
- Payment gateway sandbox integration
- Email and SMS notifications
- Cloud storage for KYC demo documents
- Fraud detection rules and risk scoring
- AI-powered financial insights and FAQ assistant
- Redis caching and distributed rate limiting
- Automated unit and integration tests
- CI/CD workflows with GitHub Actions
- Structured logging and monitoring

## Learning Outcomes

This project provides practical experience with:

- Full-stack MERN application development
- REST API design and integration
- Authentication and authorization
- MongoDB schemas and database relationships
- Transaction-oriented workflows
- Role-based dashboards
- Security middleware and input validation
- Environment-based configuration
- Git/GitHub workflows
- Deployment of frontend and backend applications

## Disclaimer

FinFlow is a demonstration project for learning and portfolio purposes. It does not provide regulated banking, payment, lending, investment, or insurance services.

Real financial products require appropriate security engineering, independent testing, operational controls, legal and regulatory review, and applicable licenses and approvals.

## Author

**Your Name**  
Senior Full Stack MERN Developer

- GitHub: https://github.com/YOUR_GITHUB_USERNAME
- LinkedIn: Add your LinkedIn profile URL

## License

Choose and add an appropriate open-source license before distributing the project. If no license is included, do not assume others have permission to reuse or redistribute the code.
