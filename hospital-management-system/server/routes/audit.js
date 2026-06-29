import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    if (!['super_admin', 'hospital_admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const { startDate, endDate, userId, action } = req.query;
    const filter = {};
    if (startDate && endDate) filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
