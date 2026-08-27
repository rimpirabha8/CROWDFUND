const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr || connStr.includes('<db_password>')) {
      console.warn('⚠️ Warning: MONGODB_URI contains <db_password>. Please update backend/.env with your actual password.');
    }
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not exit process completely in dev so server can handle fallback or notify
  }
};

module.exports = connectDB;
