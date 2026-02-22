const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: { 
    type: String, 
    required: true, 
    enum: ['GOOD', 'FAIL', 'ERROR', 'INFO', 'WARN'] 
  },
  message: { 
    type: String, 
    required: true 
  },
  meta: { 
    type: mongoose.Schema.Types.Mixed 
  },
  category: { 
    type: String 
  },
  highlightWords: [{ 
    type: String 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '30d' // MongoDB borrará automáticamente los documentos después de 30 días
  }
});

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);
module.exports = Log;
