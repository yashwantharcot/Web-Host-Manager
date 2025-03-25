# Web Host Manager - TODO List

## Project Structure Setup
1. Complete directory structure:
   ```
   web-host-manager/
   ├── frontend/
   │   ├── public/
   │   │   ├── index.html
   │   │   └── manifest.json
   │   └── src/
   │       ├── components/
   │       │   ├── auth/
   │       │   ├── clients/
   │       │   ├── websites/
   │       │   ├── domains/
   │       │   ├── emails/
   │       │   └── layout/
   │       ├── services/
   │       │   └── api.js
   │       ├── utils/
   │       ├── assets/
   │       └── styles/
   ├── backend/
   │   └── src/
   │       ├── config/
   │       │   ├── database.js
   │       │   └── auth.js
   │       ├── controllers/
   │       │   ├── authController.js
   │       │   ├── clientController.js
   │       │   ├── websiteController.js
   │       │   ├── domainController.js
   │       │   └── emailController.js
   │       ├── models/
   │       │   ├── User.js
   │       │   ├── Client.js
   │       │   ├── Website.js
   │       │   ├── Domain.js
   │       │   └── Email.js
   │       ├── routes/
   │       │   ├── authRoutes.js
   │       │   ├── clientRoutes.js
   │       │   ├── websiteRoutes.js
   │       │   ├── domainRoutes.js
   │       │   └── emailRoutes.js
   │       └── server.js
   ├── package.json
   └── .env
   ```

## Backend Setup
1. Create `.env` file in backend directory with:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=webhostmanager
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

2. Set up database configuration in `backend/src/config/database.js`
3. Create all models in `backend/src/models/`
4. Implement controllers in `backend/src/controllers/`
5. Set up routes in `backend/src/routes/`

## Frontend Setup
1. Move existing React components to appropriate directories
2. Update import paths in all files
3. Set up API service in `frontend/src/services/api.js`
4. Implement authentication flow
5. Create layout component with navigation

## Dependencies Installation
1. Run in project root:
   ```bash
   npm run install:all
   ```

## Testing
1. Test backend API endpoints
2. Test frontend components
3. Test authentication flow
4. Test database connections

## Additional Tasks
1. Implement error handling
2. Add loading states
3. Add form validation
4. Implement search and filtering
5. Add pagination to list views

## Notes
- Current backend port: 5000
- Current frontend port: 3000
- Database: MySQL
- Authentication: JWT

## Commands
- Start both servers: `npm start`
- Start frontend only: `npm run start:frontend`
- Start backend only: `npm run start:backend`
- Install all dependencies: `npm run install:all`

Remember to check the console for any error messages when starting the servers. 