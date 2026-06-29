import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: notifications });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, data: n });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/read-all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const n = await Notification.create(req.body);
    res.status(201).json({ success: true, data: n });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

export default router;
