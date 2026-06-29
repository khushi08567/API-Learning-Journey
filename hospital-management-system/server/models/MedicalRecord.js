import mongoose from 'mongoose';
let c = 0;
const medicalRecordSchema = new mongoose.Schema({
  recordId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, enum: ['prescription', 'lab_report', 'xray', 'mri', 'ct_scan', 'discharge_summary', 'other'], required: true },
  title: { type: String, required: true },
  description: String,
  fileUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  tags: [String],
}, { timestamps: true });
medicalRecordSchema.pre('save', function (next) { if (!this.recordId) this.recordId = 'MR-' + (++c); next(); });
export default mongoose.model('MedicalRecord', medicalRecordSchema);
