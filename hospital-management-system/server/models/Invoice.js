import mongoose from 'mongoose';
let c = 6000;
const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  items: [{ description: String, category: { type: String, enum: ['consultation', 'lab_test', 'medicine', 'admission', 'other'] }, quantity: { type: Number, default: 1 }, unitPrice: Number, amount: Number }],
  subtotal: Number,
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['upi', 'card', 'cash', 'insurance'] },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  insuranceClaim: { claimId: String, provider: String, amount: Number, status: String },
  paidAt: Date,
}, { timestamps: true });
invoiceSchema.pre('save', function (next) { if (!this.invoiceId) this.invoiceId = 'INV-' + (++c); next(); });
export default mongoose.model('Invoice', invoiceSchema);
