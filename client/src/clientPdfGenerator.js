/**
 * Client-side PDF generation fallback when LaTeX is not available
 */

const generateClientSidePdf = async (formData, previewRef) => {
  try {
    // Check if jsPDF and html2canvas are available
    if (!window.jspdf || !window.html2canvas) {
      throw new Error("Required libraries for client-side PDF generation are not loaded.");
    }
    
    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // If we have a preview ref to use as source
    if (previewRef && previewRef.current) {
      // Use the preview component as source for PDF
      const preview = previewRef.current;
      
      // Create a clone with fixed dimensions matching A4 paper
      const clone = preview.cloneNode(true);
      clone.style.width = '210mm';
      clone.style.padding = '15mm';
      clone.style.backgroundColor = 'white';
      clone.style.color = 'black';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);
      
      // Render the clone to canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Remove the clone
      document.body.removeChild(clone);
      
      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      doc.addImage(
        imgData, 'JPEG', 
        0, 0, 
        imgWidth * ratio, imgHeight * ratio
      );
      
      // Save the PDF
      const pdfBlob = doc.output('blob');
      return {
        pdf: URL.createObjectURL(pdfBlob),
        type: 'client-generated'
      };
    } else {
      // Create PDF from formData directly
      const { name, email, phone, address, objective, education, experience, skills, projects, achievements } = formData;
      
      // Add name as title
      doc.setFontSize(20);
      doc.text(name || 'Resume', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      
      // Add contact information
      doc.setFontSize(10);
      const contactInfo = [];
      if (email) contactInfo.push(email);
      if (phone) contactInfo.push(phone);
      if (address) contactInfo.push(address);
      
      doc.text(contactInfo.join(' | '), doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });
      
      // Add objective
      if (objective) {
        doc.setFontSize(12);
        doc.text('Objective', 20, 40);
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(objective, doc.internal.pageSize.getWidth() - 40), 20, 46);
      }
      
      let yPos = objective ? 60 : 40;
      
      // Add education
      if (education && education.length) {
        doc.setFontSize(12);
        doc.text('Education', 20, yPos);
        yPos += 6;
        doc.setFontSize(10);
        
        education.forEach(edu => {
          doc.text(`${edu.degree || 'Degree'}, ${edu.institution || 'Institution'}`, 20, yPos);
          yPos += 5;
          doc.text(`${edu.year || ''} ${edu.percentage ? '- ' + edu.percentage : ''}`, 20, yPos);
          yPos += 8;
        });
      }
      
      // Add experience
      if (experience && experience.length) {
        doc.setFontSize(12);
        doc.text('Experience', 20, yPos);
        yPos += 6;
        doc.setFontSize(10);
        
        experience.forEach(exp => {
          doc.text(`${exp.role || 'Role'}, ${exp.company || 'Company'}`, 20, yPos);
          yPos += 5;
          doc.text(exp.duration || '', 20, yPos);
          yPos += 8;
        });
      }
      
      // Add skills
      if (skills && skills.length) {
        doc.setFontSize(12);
        doc.text('Skills', 20, yPos);
        yPos += 6;
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(skills.join(', '), doc.internal.pageSize.getWidth() - 40), 20, yPos);
        yPos += 10;
      }
      
      // Add projects
      if (projects && projects.length) {
        doc.setFontSize(12);
        doc.text('Projects', 20, yPos);
        yPos += 6;
        doc.setFontSize(10);
        
        projects.forEach(project => {
          doc.text(project.title || 'Project', 20, yPos);
          yPos += 5;
          doc.text(doc.splitTextToSize(project.description || '', doc.internal.pageSize.getWidth() - 40), 20, yPos);
          yPos += 10;
        });
      }
      
      // Add achievements
      if (achievements && achievements.length) {
        doc.setFontSize(12);
        doc.text('Achievements', 20, yPos);
        yPos += 6;
        doc.setFontSize(10);
        
        achievements.forEach(achievement => {
          const lines = doc.splitTextToSize(achievement, doc.internal.pageSize.getWidth() - 40);
          doc.text('• ' + lines[0], 20, yPos);
          
          if (lines.length > 1) {
            for (let i = 1; i < lines.length; i++) {
              yPos += 5;
              doc.text('  ' + lines[i], 20, yPos);
            }
          }
          yPos += 8;
        });
      }
      
      // Save the PDF
      const pdfBlob = doc.output('blob');
      return {
        pdf: URL.createObjectURL(pdfBlob),
        type: 'client-generated'
      };
    }
  } catch (error) {
    console.error('Error generating client-side PDF:', error);
    throw error;
  }
};

export default generateClientSidePdf;
