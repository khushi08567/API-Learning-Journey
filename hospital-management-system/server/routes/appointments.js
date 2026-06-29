const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { verifyToken } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

// GET /api/appointments — filtered by role
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, type, date, doctorId, patientId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) query.patientId = patient._id;
      else return res.json({ success: true, data: { appointments: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } } });
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) query.doctorId = doctor._id;
      else return res.json({ success: true, data: { appointments: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } } });
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } })
      .populate('department', 'name')
      .sort({ date: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        appointments,
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

// GET /api/appointments/doctor/:doctorId/slots?date=
router.get('/doctor/:doctorId/slots', verifyToken, async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required.' });
    }

    const doctor = await Doctor.findById(req.params.doctorId).populate('userId', 'name');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const requestedDate = new Date(date);
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = doctor.schedule.find((s) => s.day === dayName);

    if (!daySchedule) {
      return res.json({ success: true, data: { slots: [], message: `Doctor not available on ${dayName}.` } });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booked = await Appointment.find({
      doctorId: req.params.doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] },
    }).select('timeSlot');

    const bookedSlots = booked.map((a) => a.timeSlot.startTime);

    const allSlots = [];
    const [startH, startM] = daySchedule.startTime.split(':').map(Number);
    const [endH, endM] = daySchedule.endTime.split(':').map(Number);
    let cH = startH, cM = startM;

    while (cH < endH || (cH === endH && cM < endM)) {
      const nM = cM + 30;
      const nH = cH + Math.floor(nM / 60);
      const slotStart = `${String(cH).padStart(2, '0')}:${String(cM).padStart(2, '0')}`;
      const slotEnd = `${String(nH).padStart(2, '0')}:${String(nM % 60).padStart(2, '0')}`;
      allSlots.push({
        startTime: slotStart,
        endTime: slotEnd,
        isBooked: bookedSlots.includes(slotStart),
      });
      cH = nH;
      cM = nM % 60;
    }

    res.json({
      success: true,
      data: {
        doctorName: doctor.userId.name,
        date,
        slots: allSlots,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/appointments/:id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } })
      .populate('department', 'name');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.json({ success: true, data: { appointment } });
  } catch (error) {
    next(error);
  }
});

// POST /api/appointments — book
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { patientId, doctorId, department, date, timeSlot, type, symptoms } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Doctor, date, and time slot are required.' });
    }

    let resolvedPatientId = patientId;
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient profile not found.' });
      }
      resolvedPatientId = patient._id;
    }

    if (!resolvedPatientId) {
      return res.status(400).json({ success: false, message: 'Patient ID is required.' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Check for conflicting appointments
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      'timeSlot.startTime': timeSlot.startTime,
      status: { $nin: ['cancelled'] },
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked.' });
    }

    const appointment = await Appointment.create({
      patientId: resolvedPatientId,
      doctorId,
      department: department || doctor.department,
      date,
      timeSlot,
      type: type || 'regular',
      symptoms,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .populate('department', 'name');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: { appointment: populated },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/appointments/:id/status
router.put('/:id/status', verifyToken, roleGuard(['super_admin', 'hospital_admin', 'doctor', 'receptionist']), async (req, res, next) => {
  try {
    const { status, cancelReason, notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const validStatuses = ['requested', 'confirmed', 'in_consultation', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const update = { status };
    if (status === 'cancelled' && cancelReason) update.cancelReason = cancelReason;
    if (notes) update.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.json({
      success: true,
      message: `Appointment ${status} successfully.`,
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/appointments/:id/reschedule
router.put('/:id/reschedule', verifyToken, async (req, res, next) => {
  try {
    const { date, timeSlot } = req.body;
    if (!date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'New date and time slot are required.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: `Cannot reschedule a ${appointment.status} appointment.` });
    }

    // Check conflicts
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctorId: appointment.doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      'timeSlot.startTime': timeSlot.startTime,
      status: { $nin: ['cancelled'] },
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'The new time slot is already booked.' });
    }

    appointment.date = date;
    appointment.timeSlot = timeSlot;
    appointment.status = 'requested';
    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully.',
      data: { appointment: updated },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
