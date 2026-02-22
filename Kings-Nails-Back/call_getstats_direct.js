const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const adminStats = require('./controllers/adminStatsController');

async function run() {
  try {
    await connectDB();

    const req = {}; // no necesita datos
    const res = {
      json(payload) {
        console.log('Stats result:');
        console.log(JSON.stringify(payload, null, 2));
        process.exit(0);
      },
      status(code) {
        this._status = code;
        return this;
      }
    };

    // adminStats.getStats está envuelto con express-async-handler
    // Llamamos directamente y capturamos cualquier excepción
    await adminStats.getStats(req, res);
  } catch (err) {
    console.error('Error calling getStats directly:', err);
    process.exit(1);
  }
}

run();
