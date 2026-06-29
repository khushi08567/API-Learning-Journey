const express = require('express');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const { verifyToken } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

// GET /api/medical-records — filtered
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, patientId, category } = req.query;
    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (patientId) query.patientId = patientId;

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) query.patientId = patient._id;
      else return res.json({ success: true, data: { records: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } } });
    }

    const total = await MedicalRecord.countDocuments(query);
    const records = await MedicalRecord.find(query)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        records,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/medical-records/patient/:patientId
router.get('/patient/:patientId', verifyToken, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    if (req.user.role === 'patient' && patient.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { records } });
  } catch (error) {
    next(error);
  }
});

// GET /api/medical-records/:id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate('uploadedBy', 'name role');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Medical record not found.' });
    }

    res.json({ success: true, data: { record } });
  } catch (error) {
    next(error);
  }
});

// POST /api/medical-records — upload
router.post('/', verifyToken, roleGuard(['super_admin', 'hospital_admin', 'doctor', 'nurse', 'lab_technician']), async (req, res, next) => {
  try {
    const { patientId, type, title, description, fileUrl, category, tags } = req.body;

    if (!patientId || !type || !title) {
      return res.status(400).json({ success: false, message: 'Patient ID, type, and title are required.' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const record = await MedicalRecord.create({
      patientId,
      type,
      title,
      description,
      fileUrl,
      uploadedBy: req.user._id,
      category,
      tags,
    });

    const populated = await MedicalRecord.findById(record._id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate('uploadedBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully.',
      data: { record: populated },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
