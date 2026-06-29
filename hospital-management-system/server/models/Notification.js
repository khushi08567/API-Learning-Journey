import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['appointment', 'prescription', 'lab_report', 'billing', 'emergency', 'system'], default: 'system' },
  isRead: { type: Boolean, default: false },
  link: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
}, { timestamps: true });
export default mongoose.model('Notification', notificationSchema);
