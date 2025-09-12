import Mustache from 'mustache';

/**
 * Enhanced Mustache rendering function that ensures LaTeX document structure integrity
 * by preventing user data from being inserted before \begin{document}
 * and fixing common LaTeX syntax errors
 * 
 * @param {string} template - The LaTeX template to render
 * @param {object} data - The data to inject into the template
 * @returns {string} - The rendered LaTeX document with proper structure
 */
export const safeRenderLatex = (template, data) => {
  if (!template || typeof template !== 'string') {
    return '';
  }

  // First, find the position of \begin{document} in the template
  const beginDocPos = template.indexOf('\\begin{document}');
  
  if (beginDocPos === -1) {
    console.error('Template is missing \\begin{document} tag');
    return template; // Return original template if no begin document tag
  }
  
  // Split the template into preamble and body
  const preamble = template.substring(0, beginDocPos + '\\begin{document}'.length);
  const body = template.substring(beginDocPos + '\\begin{document}'.length);
  
  // Process body with Mustache to replace variables with user data
  let renderedBody = Mustache.render(body, data);
  
  // Before returning, check if there are any mustache tags in the preamble
  if (preamble.includes('{{') || preamble.includes('{{{')) {
    console.warn('Warning: Found mustache tags in LaTeX preamble. These will not be processed.');
  }
  
  // Fix common LaTeX syntax errors in the rendered document
  renderedBody = fixLatexSyntaxErrors(renderedBody);
  
  // Combine the untouched preamble with the rendered body
  return preamble + renderedBody;
};

/**
 * Fixes common LaTeX syntax errors in the rendered document
 * 
 * @param {string} latex - The LaTeX content to fix
 * @returns {string} - The fixed LaTeX content
 */
const fixLatexSyntaxErrors = (latex) => {
  if (!latex) return latex;
  
  let fixed = latex;
  
  // Fix image tags that are missing braces
  fixed = fixed.replace(/\\includegraphics(\[[^\]]*\])?(data:)/g, '\\includegraphics$1{$2');
  fixed = fixed.replace(/\\includegraphics(\[[^\]]*\])?([^{])/g, '\\includegraphics$1{$2');
  
  // Fix \textbf without braces (e.g., \textbftext -> \textbf{text})
  fixed = fixed.replace(/\\textbf(\w+)/g, '\\textbf{$1}');
  
  // Fix \textit without braces
  fixed = fixed.replace(/\\textit(\w+)/g, '\\textit{$1}');
  
  // Fix missing closing braces for includegraphics with data URLs
  const imgMatches = fixed.match(/\\includegraphics(\[[^\]]*\])?{data:[^}]+/g);
  if (imgMatches) {
    imgMatches.forEach(match => {
      if (!match.endsWith('}')) {
        const fixedMatch = match + '}';
        fixed = fixed.replace(match, fixedMatch);
      }
    });
  }
  
  // Generic fix for common LaTeX commands missing braces
  const latexCommands = ['\\textbf', '\\textit', '\\textrm', '\\textsc', '\\textsl', '\\texttt', '\\emph', '\\underline'];
  latexCommands.forEach(cmd => {
    // Match command followed by text without braces
    const regex = new RegExp(cmd + '([^{\\s][^\\s]*)', 'g');
    fixed = fixed.replace(regex, cmd + '{$1}');
  });
  
  return fixed;
};

export default safeRenderLatex;
