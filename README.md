# Web Host Manager

A full-stack application for managing web hosting clients, websites, domains, and email accounts.

## Project Structure

```
web-host-manager/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── assets/      # Static assets
│   │   └── styles/      # CSS styles
│   └── package.json
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── config/     # Configuration files
│   │   ├── controllers/# Route controllers
│   │   ├── models/     # Database models
│   │   ├── routes/     # API routes
│   │   └── server.js   # Main server file
│   └── package.json
└── package.json      # Root package.json for monorepo
```

## Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Create a `.env` file in the backend directory with the following variables:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=webhostmanager
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Starting the Development Servers

To run the application locally, you need to start both the backend and frontend development servers.

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
The backend server will run on `http://127.0.0.1:5000` (by default, if configured in `.env`).

### 2. Start the Frontend Server
```bash
cd frontend
npm install
npm start
```
The React application will launch at `http://localhost:3000`. 

> [!NOTE]
> The frontend is configured to proxy API requests to `http://127.0.0.1:5000` automatically.

## Features

- Client Management
- Website Management
- Domain Management
- Email Account Management
- User Authentication
- Dashboard with Statistics 