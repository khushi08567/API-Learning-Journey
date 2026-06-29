const AuditLog = require('../models/AuditLog');

const methodToAction = {
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'delete',
};

const auditLogger = async (req, res, next) => {
  const method = req.method.toUpperCase();
  const action = methodToAction[method];

  if (!action) {
    return next();
  }

  res.on('finish', async () => {
    try {
      if (res.statusCode >= 400) return;

      const logEntry = {
        userId: req.user ? req.user._id : null,
        userName: req.user ? req.user.name : 'Anonymous',
        userRole: req.user ? req.user.role : 'unknown',
        action,
        resource: req.baseUrl + req.path,
        resourceId: req.params.id || null,
        details: {
          method: req.method,
          statusCode: res.statusCode,
          body: action === 'delete' ? undefined : req.body,
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      };

      await AuditLog.create(logEntry);
    } catch (error) {
      console.error('Audit logging error:', error.message);
    }
  });

  next();
};

module.exports = auditLogger;
