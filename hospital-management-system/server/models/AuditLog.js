import mongoose from 'mongoose';
const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  userRole: String,
  action: { type: String, enum: ['create', 'read', 'update', 'delete', 'login', 'logout'], required: true },
  resource: String,
  resourceId: String,
  details: String,
  ipAddress: String,
  userAgent: String,
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model('AuditLog', auditLogSchema);
