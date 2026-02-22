const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');

dotenv.config();
const connectDB = require('./config/db');
const User = require('./models/UserModel');

async function run() {
  try {
    await connectDB();

    // Buscar un admin
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('No admin found');
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const res = await axios.get('http://127.0.0.1:5000/api/admin/stats', {
      headers: { Cookie: `jwt=${token}` },
      // no withCredentials needed when cookie provided in header
    });

    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) console.error('Resp:', err.response.status, err.response.data);
  } finally {
    process.exit(0);
  }
}

run();
