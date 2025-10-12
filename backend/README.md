Switching to MongoDB
--------------------

This project uses Sequelize/Postgres by default. To run the backend with MongoDB (Mongoose):

1. Set environment variables (for example in a .env file):

   DB_TYPE=mongo
   MONGO_URI=mongodb://localhost:27017/webhost_manager

2. Install dependencies and start the server in the `backend` folder:

   npm install
   npm run dev

When `DB_TYPE` is set to `mongo`, the server will connect using Mongoose. Existing controllers still use Sequelize models; you'll need to switch controller imports to use models from `src/models/mongoose` (or adapt a small adapter) to use MongoDB-backed models.
