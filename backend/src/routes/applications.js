const express = require('express');
const { 
  createApplication, 
  getApplications, 
  getApplication, 
  updateApplication, 
  deleteApplication, 
  updateStatus 
} = require('../controllers/applications');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Public routes for logged in users
router.route('/')
  .post(createApplication)
  .get(getApplications);

router.route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

// Admin only routes
router.put('/:id/status', authorize('admin'), updateStatus);

module.exports = router; 