import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { analyzeSymptoms, summarizePatientHistory, explainPrescription, assistAppointment, analyzeOperations } from '../services/aiService.js';

const router = express.Router();

router.post('/symptom-analysis', verifyToken, async (req, res) => {
  try {
    const result = await analyzeSymptoms(req.body.symptoms);
    res.json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/summarize-records', verifyToken, async (req, res) => {
  try {
    const result = await summarizePatientHistory(req.body.patientData);
    res.json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/explain-prescription', verifyToken, async (req, res) => {
  try {
    const result = await explainPrescription(req.body.prescription, req.body.question);
    res.json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/appointment-assist', verifyToken, async (req, res) => {
  try {
    const result = await assistAppointment(req.body.query, req.body.availableDoctors);
    res.json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/operations-insights', verifyToken, async (req, res) => {
  try {
    const result = await analyzeOperations(req.body.metrics);
    res.json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
