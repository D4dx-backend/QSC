// models/LoginLog.js

const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  },
  loginTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  status:{
    type: String,
    required: true
  }
});

const LoginLog = mongoose.model('LoginLog', loginLogSchema);

module.exports = LoginLog;
