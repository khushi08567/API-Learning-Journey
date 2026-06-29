import mongoose from 'mongoose';

let patientCounter = 1000;
const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  phone: { type: String, required: true },
  address: { street: String, city: String, state: String, zipCode: String },
  emergencyContact: { name: String, phone: String, relation: String },
  insurance: { provider: String, policyNumber: String, validTill: Date },
  allergies: [String],
  previousDiseases: [String],
  surgeries: [{ name: String, date: Date, hospital: String }],
  currentMedications: [String],
}, { timestamps: true });

patientSchema.pre('save', function (next) {
  if (!this.patientId) { this.patientId = 'PAT-' + (++patientCounter); }
  next();
});
export default mongoose.model('Patient', patientSchema);
