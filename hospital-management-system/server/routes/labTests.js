const express = require('express');
const LabTest = require('../models/LabTest');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { verifyToken } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

// GET /api/lab-tests — filtered by role
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, testType, patientId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (testType) query.testType = testType;
    if (patientId) query.patientId = patientId;

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) query.patientId = patient._id;
      else return res.json({ success: true, data: { labTests: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } } });
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) query.doctorId = doctor._id;
    } else if (req.user.role === 'lab_technician') {
      // Lab techs see all tests — no additional filter
    }

    const total = await LabTest.countDocuments(query);
    const labTests = await LabTest.find(query)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('technicianId', 'name email')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        labTests,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/lab-tests/:id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const labTest = await LabTest.findById(req.params.id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('technicianId', 'name email');

    if (!labTest) {
      return res.status(404).json({ success: false, message: 'Lab test not found.' });
    }

    res.json({ success: true, data: { labTest } });
  } catch (error) {
    next(error);
  }
});

// POST /api/lab-tests — doctor orders
router.post('/', verifyToken, roleGuard(['doctor', 'super_admin', 'hospital_admin']), async (req, res, next) => {
  try {
    const { patientId, testType, testName, priority } = req.body;

    if (!patientId || !testType || !testName) {
      return res.status(400).json({ success: false, message: 'Patient ID, test type, and test name are required.' });
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

    const labTest = await LabTest.create({
      patientId,
      doctorId: resolvedDoctorId,
      testType,
      testName,
      priority: priority || 'routine',
    });

    const populated = await LabTest.findById(labTest._id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });

    res.status(201).json({
      success: true,
      message: 'Lab test ordered successfully.',
      data: { labTest: populated },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/lab-tests/:id/status
router.put('/:id/status', verifyToken, roleGuard(['lab_technician', 'doctor', 'super_admin', 'hospital_admin']), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const validStatuses = ['ordered', 'sample_collected', 'testing', 'report_generated', 'reviewed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const update = { status };
    if (status === 'sample_collected') {
      update.sampleCollectedAt = new Date();
      update.technicianId = req.user._id;
    }
    if (status === 'report_generated') update.reportGeneratedAt = new Date();
    if (status === 'reviewed') update.reviewedAt = new Date();

    const labTest = await LabTest.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('technicianId', 'name email');

    if (!labTest) {
      return res.status(404).json({ success: false, message: 'Lab test not found.' });
    }

    res.json({
      success: true,
      message: `Lab test status updated to ${status}.`,
      data: { labTest },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/lab-tests/:id/results
router.put('/:id/results', verifyToken, roleGuard(['lab_technician', 'doctor', 'super_admin']), async (req, res, next) => {
  try {
    const { results } = req.body;
    if (!results) {
      return res.status(400).json({ success: false, message: 'Results data is required.' });
    }

    const labTest = await LabTest.findByIdAndUpdate(
      req.params.id,
      {
        results,
        status: 'report_generated',
        reportGeneratedAt: new Date(),
      },
      { new: true, runValidators: true }
    )
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('technicianId', 'name email');

    if (!labTest) {
      return res.status(404).json({ success: false, message: 'Lab test not found.' });
    }

    res.json({
      success: true,
      message: 'Lab test results updated successfully.',
      data: { labTest },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
