import mongoose from 'mongoose';
let c = 2000;

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  date: { type: Date, required: true },
  timeSlot: { startTime: String, endTime: String },
  status: { type: String, enum: ['requested', 'confirmed', 'in_consultation', 'completed', 'cancelled'], default: 'requested' },
  type: { type: String, enum: ['regular', 'follow_up', 'emergency'], default: 'regular' },
  symptoms: [String],
  notes: String,
  cancelReason: String,
}, { timestamps: true });

appointmentSchema.pre('save', function (next) { if (!this.appointmentId) this.appointmentId = 'APT-' + (++c); next(); });
export default mongoose.model('Appointment', appointmentSchema);
