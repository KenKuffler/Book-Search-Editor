import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

console.log('🔌 Testing database connection...');

mongoose.connect(connectionString);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB.');
});

db.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

db.once('open', () => {
  console.log('✅ Database connection established.');
  mongoose.connection.close();
});

db.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected.');
});
