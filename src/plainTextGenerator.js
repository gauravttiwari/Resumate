/**
 * Generate plain text version of resume for ATS systems
 * @param {Object} data - Resume data
 * @returns {string} Plain text resume
 */
const generatePlainText = (data) => {
  let plainText = '';
  
  // Personal Information
  plainText += `${data.name}\n`;
  plainText += `${data.phone ? 'Phone: ' + data.phone + ' | ' : ''}${data.email ? 'Email: ' + data.email : ''}\n`;
  if (data.address) plainText += `${data.address}\n`;
  plainText += '\n';
  
  // Objective
  if (data.objective) {
    plainText += 'CAREER OBJECTIVE\n';
    plainText += '----------------\n';
    plainText += `${data.objective}\n\n`;
  }
  
  // Education
  plainText += 'EDUCATION\n';
  plainText += '---------\n';
  data.education.forEach(edu => {
    plainText += `${edu.degree}\n`;
    plainText += `${edu.institution} | ${edu.year} | ${edu.percentage}\n\n`;
  });
  
  // Experience
  if (data.experience && data.experience.length) {
    plainText += 'PROFESSIONAL EXPERIENCE\n';
    plainText += '----------------------\n';
    data.experience.forEach(exp => {
      plainText += `${exp.role} at ${exp.company}\n`;
      plainText += `${exp.duration}\n\n`;
    });
  }
  
  // Projects
  if (data.projects && data.projects.length) {
    plainText += 'PROJECTS\n';
    plainText += '--------\n';
    data.projects.forEach(proj => {
      plainText += `${proj.title}\n`;
      plainText += `${proj.description}\n\n`;
    });
  }
  
  // Skills
  if (data.skills && data.skills.length) {
    plainText += 'SKILLS\n';
    plainText += '------\n';
    plainText += data.skills.join(', ') + '\n\n';
  }
  
  // Achievements
  if (data.achievements && data.achievements.filter(Boolean).length) {
    plainText += 'ACHIEVEMENTS\n';
    plainText += '-----------\n';
    data.achievements.filter(Boolean).forEach(ach => {
      plainText += `• ${ach}\n`;
    });
    plainText += '\n';
  }
  
  return plainText;
};

export default generatePlainText;
