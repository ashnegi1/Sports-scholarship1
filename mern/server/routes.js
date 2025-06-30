const express = require('express');
const router = express.Router();
const Applicant = require('./models/Applicant');

// POST: Add new applicant
router.post('/applicants', async (req, res) => {
  try {
    const applicant = new Applicant(req.body);
    await applicant.save();
    res.status(201).json(applicant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: List all applicants
router.get('/applicants', async (req, res) => {
  const applicants = await Applicant.find();
  res.json(applicants);
});

module.exports = router;
