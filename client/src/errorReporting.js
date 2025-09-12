// Simple error reporting/telemetry service
// In a production environment, this would send data to an analytics service like Sentry, LogRocket, etc.

// Anonymize data before sending
const anonymizeData = (data) => {
  if (!data) return null;
  
  // Create a deep copy to avoid modifying the original
  const anonymized = JSON.parse(JSON.stringify(data));
  
  // Remove potentially sensitive fields from user data
  const sensitiveFields = ['name', 'email', 'phone', 'address', 'profilePic'];
  
  sensitiveFields.forEach(field => {
    if (anonymized[field]) {
      if (typeof anonymized[field] === 'string') {
        anonymized[field] = anonymized[field].length > 0 ? '[REDACTED]' : '';
      } else {
        delete anonymized[field];
      }
    }
  });
  
  return anonymized;
};

// Report error to monitoring service
export const reportError = (error, context = {}, level = 'error') => {
  // Don't send reports in development mode
  if (process.env.NODE_ENV === 'development') {
    console.debug('Error report (dev mode only):', { error, context, level });
    return;
  }
  
  // Anonymize any user data in context
  const safeContext = anonymizeData(context);
  
  // In production, this would send to a service like Sentry or LogRocket
  // For now, just log to console in a structured way
  console[level]('Error Report:', {
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      message: error.message,
      name: error.name,
      stack: error.stack
    } : error,
    context: safeContext,
    level,
    appVersion: '1.0.0', // Should match your app version
    userAgent: navigator.userAgent,
  });
  
  // To implement actual reporting to a service:
  // fetch('https://your-error-reporting-service.com/api/log', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     error, context: safeContext, level, timestamp: new Date().toISOString()
  //   })
  // }).catch(e => console.error('Failed to send error report:', e));
};

// Report feature usage for analytics
export const reportUsage = (feature, metadata = {}) => {
  // For future implementation of usage analytics
  if (process.env.NODE_ENV === 'development') {
    console.debug('Usage report (dev mode only):', { feature, metadata });
  }
};

export default {
  reportError,
  reportUsage
};
