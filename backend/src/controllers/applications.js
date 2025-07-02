const Application = require('../models/Application');

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check for existing application
    const existingApplication = await Application.findOne({ 
      user: req.user.id, 
      status: { $in: ['pending', 'under_review'] } 
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending application'
      });
    }

    const application = await Application.create(req.body);

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
exports.getApplications = async (req, res, next) => {
  try {
    let query;

    // If user is not admin, show only their applications
    if (req.user.role !== 'admin') {
      query = Application.find({ user: req.user.id });
    } else {
      query = Application.find();
    }

    // Execute query
    const applications = await query;

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application not found with id of ${req.params.id}`
      });
    }

    // Make sure user is application owner or admin
    if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to access this application`
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
exports.updateApplication = async (req, res, next) => {
  try {
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application not found with id of ${req.params.id}`
      });
    }

    // Make sure user is application owner
    if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this application`
      });
    }

    // Don't allow status updates unless admin
    if (req.user.role !== 'admin' && req.body.status) {
      delete req.body.status;
    }

    // Update application
    application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application not found with id of ${req.params.id}`
      });
    }

    // Make sure user is application owner or admin
    if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this application`
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;
    
    if (!status || !['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status'
      });
    }
    
    let application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Only admins can update status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update application status'
      });
    }
    
    // Add comment if provided
    if (comment) {
      const commentObj = {
        content: comment,
        actionType: status === 'approved' ? 'approve' : 
                   status === 'rejected' ? 'reject' : 'comment'
      };
      
      application.comments.push(commentObj);
    }
    
    application.status = status;
    await application.save();
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
}; 