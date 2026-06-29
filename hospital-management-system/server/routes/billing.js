import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

router.get('/invoices', verifyToken, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'patient') filter.patientId = req.user._id;
    const invoices = await Invoice.find(filter).populate('patientId').sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/invoices/:id', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('patientId appointmentId');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/invoices', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/invoices/:id/payment', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { paymentStatus: 'completed', paymentMethod: req.body.paymentMethod, paidAt: new Date() }, { new: true });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.get('/invoices/patient/:patientId', verifyToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
