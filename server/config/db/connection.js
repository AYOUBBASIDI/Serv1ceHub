const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_USER, MONGO_PASS, MONGO_DBNAME } = process.env;
// const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.eoqwdpr.mongodb.net`;

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://ayoubbasidi1:ayoubbsdservicehub@cluster0.xmmiveb.mongodb.net/servicehub`);
    console.log('Connected to MongoDB:', MONGO_DBNAME);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connectDB;

