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

3. Start the development servers:
```bash
npm start
```

This will start both the frontend (port 3000) and backend (port 5000) servers concurrently.

## Features

- Client Management
- Website Management
- Domain Management
- Email Account Management
- User Authentication
- Dashboard with Statistics 