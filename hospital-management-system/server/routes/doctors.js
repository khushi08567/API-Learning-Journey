const express = require('express');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

// GET /api/doctors — list with filters
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, specialization, department, isAvailable, search } = req.query;
    const query = {};

    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
    if (department) query.department = department;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

    if (search) {
      const userIds = await User.find({
        name: { $regex: search, $options: 'i' },
        role: 'doctor',
      }).select('_id');
      query.userId = { $in: userIds.map((u) => u._id) };
    }

    const total = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .populate('userId', 'name email phone avatar')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        doctors,
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

// GET /api/doctors/department/:deptId
router.get('/department/:deptId', verifyToken, async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ department: req.params.deptId, isAvailable: true })
      .populate('userId', 'name email phone avatar')
      .populate('department', 'name');

    res.json({ success: true, data: { doctors } });
  } catch (error) {
    next(error);
  }
});

// GET /api/doctors/:id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone avatar')
      .populate('department', 'name');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    res.json({ success: true, data: { doctor } });
  } catch (error) {
    next(error);
  }
});

// POST /api/doctors — admin creates a doctor
router.post('/', verifyToken, roleGuard(['super_admin', 'hospital_admin']), async (req, res, next) => {
  try {
    const { name, email, password, phone, specialization, department, qualifications, experience, schedule, consultationFee } = req.body;

    if (!name || !email || !password || !specialization) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and specialization are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, role: 'doctor', phone, department });

    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      department,
      qualifications,
      experience,
      schedule,
      consultationFee,
    });

    const populated = await Doctor.findById(doctor._id)
      .populate('userId', 'name email phone')
      .populate('department', 'name');

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully.',
      data: { doctor: populated },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/doctors/:id
router.put('/:id', verifyToken, roleGuard(['super_admin', 'hospital_admin', 'doctor']), async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    if (req.user.role === 'doctor' && doctor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const allowedFields = ['specialization', 'department', 'qualifications', 'experience', 'schedule', 'consultationFee', 'isAvailable'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Doctor.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('userId', 'name email phone')
      .populate('department', 'name');

    res.json({
      success: true,
      message: 'Doctor updated successfully.',
      data: { doctor: updated },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/doctors/:id/schedule
router.get('/:id/schedule', verifyToken, async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    res.json({
      success: true,
      data: {
        doctorName: doctor.userId.name,
        schedule: doctor.schedule,
        isAvailable: doctor.isAvailable,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/doctors/:id/availability?date=YYYY-MM-DD
router.get('/:id/availability', verifyToken, async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date query parameter is required.' });
    }

    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const requestedDate = new Date(date);
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const daySchedule = doctor.schedule.find((s) => s.day === dayName);
    if (!daySchedule) {
      return res.json({
        success: true,
        data: { available: false, message: `Doctor is not available on ${dayName}.`, slots: [] },
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.countDocuments({
      doctorId: req.params.id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] },
    });

    const slotsRemaining = daySchedule.maxPatients - existingAppointments;

    // Generate available time slots (30-min intervals)
    const slots = [];
    const [startH, startM] = daySchedule.startTime.split(':').map(Number);
    const [endH, endM] = daySchedule.endTime.split(':').map(Number);
    let currentH = startH;
    let currentM = startM;

    while (currentH < endH || (currentH === endH && currentM < endM)) {
      const nextM = currentM + 30;
      const nextH = currentH + Math.floor(nextM / 60);
      const slotStart = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
      const slotEnd = `${String(nextH).padStart(2, '0')}:${String(nextM % 60).padStart(2, '0')}`;
      slots.push({ startTime: slotStart, endTime: slotEnd });
      currentH = nextH;
      currentM = nextM % 60;
    }

    res.json({
      success: true,
      data: {
        doctorName: doctor.userId.name,
        date,
        day: dayName,
        available: slotsRemaining > 0,
        slotsRemaining,
        maxPatients: daySchedule.maxPatients,
        workingHours: { start: daySchedule.startTime, end: daySchedule.endTime },
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
