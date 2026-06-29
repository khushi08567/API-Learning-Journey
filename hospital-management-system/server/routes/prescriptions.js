const express = require('express');
const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Medicine = require('../models/Medicine');
const { verifyToken } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

// GET /api/prescriptions — filtered by role
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, patientId, doctorId, isDispensed } = req.query;
    const query = {};

    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (isDispensed !== undefined) query.isDispensed = isDispensed === 'true';

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) query.patientId = patient._id;
      else return res.json({ success: true, data: { prescriptions: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } } });
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) query.doctorId = doctor._id;
      else return res.json({ success: true, data: { prescriptions: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } } });
    }

    const total = await Prescription.countDocuments(query);
    const prescriptions = await Prescription.find(query)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('appointmentId')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        prescriptions,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/prescriptions/:id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } })
      .populate('appointmentId');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    res.json({ success: true, data: { prescription } });
  } catch (error) {
    next(error);
  }
});

// POST /api/prescriptions — doctor only
router.post('/', verifyToken, roleGuard(['doctor', 'super_admin']), async (req, res, next) => {
  try {
    const { appointmentId, patientId, diagnosis, treatmentPlan, medicines, additionalInstructions, followUpDate } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Patient ID and diagnosis are required.' });
    }

    let resolvedDoctorId;
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
      resolvedDoctorId = doctor._id;
    } else {
      resolvedDoctorId = req.body.doctorId;
      if (!resolvedDoctorId) return res.status(400).json({ success: false, message: 'Doctor ID is required.' });
    }

    const prescription = await Prescription.create({
      appointmentId,
      patientId,
      doctorId: resolvedDoctorId,
      diagnosis,
      treatmentPlan,
      medicines,
      additionalInstructions,
      followUpDate,
    });

    const populated = await Prescription.findById(prescription._id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully.',
      data: { prescription: populated },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/prescriptions/:id/dispense — pharmacist
router.put('/:id/dispense', verifyToken, roleGuard(['pharmacist', 'super_admin', 'hospital_admin']), async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    if (prescription.isDispensed) {
      return res.status(400).json({ success: false, message: 'Prescription already dispensed.' });
    }

    // Deduct stock for each medicine
    for (const med of prescription.medicines) {
      const medicine = await Medicine.findOne({ name: { $regex: new RegExp(`^${med.name}$`, 'i') } });
      if (medicine && medicine.stock > 0) {
        medicine.stock = Math.max(0, medicine.stock - 1);
        await medicine.save();
      }
    }

    prescription.isDispensed = true;
    await prescription.save();

    const populated = await Prescription.findById(prescription._id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });

    res.json({
      success: true,
      message: 'Prescription dispensed successfully.',
      data: { prescription: populated },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
