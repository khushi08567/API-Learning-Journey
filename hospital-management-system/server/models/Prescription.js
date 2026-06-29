import mongoose from 'mongoose';
let c = 3000;
const prescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, unique: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  diagnosis: { type: String, required: true },
  treatmentPlan: String,
  medicines: [{ name: String, dosage: String, frequency: String, duration: String, instructions: String }],
  additionalInstructions: String,
  followUpDate: Date,
  isDispensed: { type: Boolean, default: false },
}, { timestamps: true });
prescriptionSchema.pre('save', function (next) { if (!this.prescriptionId) this.prescriptionId = 'PRE-' + (++c); next(); });
export default mongoose.model('Prescription', prescriptionSchema);
