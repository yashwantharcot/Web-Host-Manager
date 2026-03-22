const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGOURI || process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/webhost_manager';

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI);
    const UserSchema = new mongoose.Schema({ username: String, email: String });
    const User = mongoose.model('User', UserSchema);
    const user = await User.findOne({ 
      $or: [{ username: 'yashwanth@123' }, { email: 'yashwanth@123' }]
    });
    console.log('User found:', user);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
