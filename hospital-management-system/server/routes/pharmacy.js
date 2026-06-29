import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Medicine from '../models/Medicine.js';

const router = express.Router();

router.get('/medicines', verifyToken, async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const medicines = await Medicine.find(filter).sort({ name: 1 });
    res.json({ success: true, data: medicines });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/medicines/low-stock', verifyToken, async (req, res) => {
  try {
    const medicines = await Medicine.find({ $expr: { $lte: ['$stock', '$reorderLevel'] } });
    res.json({ success: true, data: medicines });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/medicines/expired', verifyToken, async (req, res) => {
  try {
    const medicines = await Medicine.find({ expiryDate: { $lt: new Date() } });
    res.json({ success: true, data: medicines });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/medicines/:id', verifyToken, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.json({ success: true, data: medicine });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/medicines', verifyToken, async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, data: medicine });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/medicines/:id', verifyToken, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.json({ success: true, data: medicine });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

export default router;
