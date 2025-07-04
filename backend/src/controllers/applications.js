const Application = require('../models/Application');
const fs = require('fs');
const path = require('path');

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

// @desc    Upload documents for an application
// @route   POST /api/applications/:id/documents
// @access  Private
exports.uploadDocuments = async (req, res, next) => {
  try {
    console.log('uploadDocuments called');
    console.log('Request files:', req.files);
    console.log('Request body:', req.body);

    const application = await Application.findById(req.params.id);

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

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one document'
      });
    }

    // Add uploaded files to application documents
    const documents = req.files.map(file => ({
      fileName: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      path: file.path,
      documentType: req.body.documentType || 'supporting'
    }));

    console.log('Documents to add:', documents);

    // Update application with new documents
    application.documents = application.documents || [];
    application.documents.push(...documents);
    
    console.log('Saving application with documents');
    await application.save();
    console.log('Application saved successfully');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: application.documents
    });
  } catch (error) {
    console.error('Error in uploadDocuments:', error);
    next(error);
  }
};

// @desc    Delete document from an application
// @route   DELETE /api/applications/:id/documents/:docId
// @access  Private
exports.deleteDocument = async (req, res, next) => {
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
        message: `User ${req.user.id} is not authorized to delete documents from this application`
      });
    }

    // Find the document
    const document = application.documents.id(req.params.docId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(document.path)) {
        fs.unlinkSync(document.path);
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      // Continue anyway as we want to remove from DB
    }

    // Remove document from application - fix: use pull instead of remove
    application.documents.pull({ _id: req.params.docId });
    await application.save();

    res.status(200).json({
      success: true,
      data: application.documents
    });
  } catch (error) {
    console.error('Error in deleteDocument:', error);
    next(error);
  }
};

// @desc    Get document from an application
// @route   GET /api/applications/:id/documents/:docId
// @access  Private
exports.getDocument = async (req, res, next) => {
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
        message: `User ${req.user.id} is not authorized to access documents from this application`
      });
    }

    // Find the document
    const document = application.documents.id(req.params.docId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Send file
    res.sendFile(path.resolve(document.path));
  } catch (error) {
    console.error('Error in getDocument:', error);
    next(error);
  }
}; 