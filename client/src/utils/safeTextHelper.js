// Universal helper function to safely convert any value to text
export const safeText = (value) => {
  if (!value) return '';
  
  // Handle strings directly
  if (typeof value === 'string') return value;
  
  // Handle objects - especially {text, start, end} from rich text editor
  if (typeof value === 'object') {
    // Handle {text, start, end} objects from achievements/certifications
    if (value.text !== undefined) return String(value.text || '');
    
    // Handle other object structures
    if (value.toString && value.toString !== Object.prototype.toString) {
      return value.toString();
    }
    
    // If object has no meaningful text representation
    return '';
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(v => safeText(v)).filter(Boolean).join(', ');
  }
  
  // Convert anything else to string
  return String(value || '');
};

// Helper to safely render achievement objects
export const safeAchievement = (achievement) => {
  if (!achievement) return '';
  
  if (typeof achievement === 'string') return achievement;
  
  if (typeof achievement === 'object' && achievement.text !== undefined) {
    return achievement.text || '';
  }
  
  return String(achievement);
};

export default safeText;