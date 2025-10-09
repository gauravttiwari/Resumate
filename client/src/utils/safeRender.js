/**
 * Universal safe text rendering utility for resume templates
 * Ensures no objects are directly rendered in JSX
 */

export const safeText = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    // Handle achievement objects with text, start, end
    if (value.text !== undefined) return String(value.text || '');
    // Handle other object structures
    if (value.name) return String(value.name || '');
    if (value.title) return String(value.title || '');
    // Fallback to empty string for any other objects
    return '';
  }
  return String(value || '');
};

export const safeAchievement = (achievement) => {
  if (!achievement) return '';
  if (typeof achievement === 'string') return achievement;
  if (typeof achievement === 'object') {
    // Handle {text, start, end} structure
    if (achievement.text) {
      const text = String(achievement.text || '');
      const start = achievement.start ? String(achievement.start) : '';
      const end = achievement.end ? String(achievement.end) : '';
      
      if (start && end) {
        return `${text} (${start} - ${end})`;
      } else if (start) {
        return `${text} (${start})`;
      }
      return text;
    }
    // Handle {name, issuer} structure
    if (achievement.name) {
      const name = String(achievement.name || '');
      const issuer = achievement.issuer ? String(achievement.issuer) : '';
      return issuer ? `${name} - ${issuer}` : name;
    }
  }
  return String(achievement || '');
};

export const safeArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.filter(item => {
    const text = safeText(item);
    return text && text.trim();
  });
};