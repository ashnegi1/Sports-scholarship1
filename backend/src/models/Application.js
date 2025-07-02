const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide applicant name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  mobile: {
    type: String,
    required: [true, 'Please provide a mobile number']
  },
  engineeringField: {
    type: String,
    required: [true, 'Please specify engineering field']
  },
  sportsType: {
    type: String,
    required: [true, 'Please specify sports type']
  },
  institution: {
    type: String,
    required: [true, 'Please specify institution']
  },
  nationalId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: {
    type: Number,
    default: 0
  },
  comments: [{
    type: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    actionType: {
      type: String,
      enum: ['approve', 'reject', 'comment']
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a unique application ID before saving
ApplicationSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    // Generate a unique ID like APP001, APP002, etc.
    const count = await this.constructor.countDocuments();
    this.applicationId = `APP${(count + 1).toString().padStart(3, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema); 