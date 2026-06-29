import mongoose from 'mongoose';
let c = 4000;
const labTestSchema = new mongoose.Schema({
  testId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  testType: { type: String, enum: ['blood_test', 'xray', 'mri', 'ct_scan', 'urine_test', 'ecg', 'other'], required: true },
  testName: { type: String, required: true },
  status: { type: String, enum: ['ordered', 'sample_collected', 'testing', 'report_generated', 'reviewed'], default: 'ordered' },
  priority: { type: String, enum: ['routine', 'urgent', 'emergency'], default: 'routine' },
  results: { summary: String, detailedReport: String, attachmentUrl: String, normalRange: String, actualValue: String },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sampleCollectedAt: Date, reportGeneratedAt: Date, reviewedAt: Date,
}, { timestamps: true });
labTestSchema.pre('save', function (next) { if (!this.testId) this.testId = 'LAB-' + (++c); next(); });
export default mongoose.model('LabTest', labTestSchema);
