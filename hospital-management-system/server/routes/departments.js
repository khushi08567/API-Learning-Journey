import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Department from '../models/Department.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).populate('headDoctor');
    res.json({ success: true, data: departments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id).populate('headDoctor');
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Department deactivated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
