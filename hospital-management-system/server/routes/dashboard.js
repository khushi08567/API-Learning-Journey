import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

router.get('/stats', verifyToken, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [totalPatients, todayAppointments, totalAppointments] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments({ date: { $gte: today } }),
      Appointment.countDocuments(),
    ]);
    const revenueAgg = await Invoice.aggregate([{ $match: { paymentStatus: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
    const monthlyRevenue = revenueAgg[0]?.total || 0;
    res.json({ success: true, data: { totalPatients, todayAppointments, totalAppointments, monthlyRevenue, bedOccupancy: 78, totalDoctors: 85, departments: 8, pendingTests: 23 } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/revenue', verifyToken, async (req, res) => {
  try {
    const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const revenue = await Invoice.aggregate([
      { $match: { paymentStatus: 'completed', createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$totalAmount' } } },
      { $sort: { '_id': 1 } },
    ]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    res.json({ success: true, data: { labels: revenue.map(r => months[r._id - 1]), values: revenue.map(r => r.total) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/department-performance', verifyToken, async (req, res) => {
  try {
    const perf = await Appointment.aggregate([
      { $lookup: { from: 'departments', localField: 'department', foreignField: '_id', as: 'dept' } },
      { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$dept.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: { labels: perf.map(p => p._id || 'Unknown'), values: perf.map(p => p.count) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
