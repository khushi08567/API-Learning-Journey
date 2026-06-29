import mongoose from 'mongoose';
let c = 5000;
const medicineSchema = new mongoose.Schema({
  medicineId: { type: String, unique: true },
  name: { type: String, required: true },
  genericName: String,
  manufacturer: String,
  category: { type: String, enum: ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler', 'other'], default: 'tablet' },
  stock: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 50 },
  price: { type: Number, required: true },
  expiryDate: Date,
  supplier: { name: String, contact: String },
  batchNumber: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
medicineSchema.pre('save', function (next) { if (!this.medicineId) this.medicineId = 'MED-' + (++c); next(); });
export default mongoose.model('Medicine', medicineSchema);
