const express = require('express');
const Patient = require('../models/Patient');
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const LabTest = require('../models/LabTest');
const { verifyToken } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

// GET /api/patients — list with pagination and search
router.get('/', verifyToken, roleGuard(['super_admin', 'hospital_admin', 'doctor', 'nurse', 'receptionist']), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, gender, bloodGroup } = req.query;
    const query = {};

    if (gender) query.gender = gender;
    if (bloodGroup) query.bloodGroup = bloodGroup;

    let patients;
    if (search) {
      const userIds = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      query.userId = { $in: userIds.map((u) => u._id) };
    }

    const total = await Patient.countDocuments(query);
    patients = await Patient.find(query)
      .populate('userId', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/patients/:id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name email phone avatar role');

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    if (req.user.role === 'patient' && patient.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: { patient } });
  } catch (error) {
    next(error);
  }
});

// POST /api/patients — admin creates a patient
router.post('/', verifyToken, roleGuard(['super_admin', 'hospital_admin', 'receptionist']), async (req, res, next) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact, insurance, allergies } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, role: 'patient', phone });

    const patient = await Patient.create({
      userId: user._id,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
      insurance,
      allergies,
    });

    const populated = await Patient.findById(patient._id).populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Patient created successfully.',
      data: { patient: populated },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/patients/:id
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    if (req.user.role === 'patient' && patient.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const allowedFields = ['dateOfBirth', 'gender', 'bloodGroup', 'phone', 'address', 'emergencyContact', 'insurance', 'allergies', 'previousDiseases', 'surgeries', 'currentMedications'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Patient.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('userId', 'name email phone');

    res.json({
      success: true,
      message: 'Patient updated successfully.',
      data: { patient: updated },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/patients/:id/medical-history
router.get('/:id/medical-history', verifyToken, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    if (req.user.role === 'patient' && patient.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const [records, prescriptions, labTests] = await Promise.all([
      MedicalRecord.find({ patientId: patient._id }).populate('uploadedBy', 'name role').sort({ createdAt: -1 }),
      Prescription.find({ patientId: patient._id }).populate('doctorId').sort({ createdAt: -1 }),
      LabTest.find({ patientId: patient._id }).populate('doctorId technicianId').sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      data: {
        patient: {
          allergies: patient.allergies,
          previousDiseases: patient.previousDiseases,
          surgeries: patient.surgeries,
          currentMedications: patient.currentMedications,
        },
        records,
        prescriptions,
        labTests,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
