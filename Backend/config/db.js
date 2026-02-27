const mongoose = require("mongoose");
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If no MONGODB_URI provided, start an in-memory MongoDB for local development/testing
    if (!mongoUri) {
      console.warn('⚠️  MONGODB_URI not set — starting in-memory MongoDB instance');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      // expose for other scripts that may read process.env
      process.env.MONGODB_URI = mongoUri;
      // persist URI to a file so other processes (seed scripts) can reuse it
      try {
        const fs = require('fs');
        const path = require('path');
        const out = path.join(__dirname, '..', '.mongodb_memory_uri');
        fs.writeFileSync(out, mongoUri, { encoding: 'utf8' });
      } catch (e) {
        console.warn('Could not write in-memory MongoDB URI to file:', e.message);
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
