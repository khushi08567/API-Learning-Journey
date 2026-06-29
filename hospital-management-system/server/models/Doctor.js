import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  qualifications: [String],
  experience: { type: Number },
  schedule: [{ day: String, startTime: String, endTime: String, maxPatients: { type: Number, default: 20 } }],
  consultationFee: { type: Number, default: 500 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('Doctor', doctorSchema);
