# Customizing Resume Templates

This guide explains how to create and customize resume templates for ResuMate.

## Template Structure

Each resume template consists of:

1. A React component file (`TemplateNameResume.js`)
2. A CSS file for styling (`TemplateName.css`)

## Creating a New Template

### 1. Create the React Component

Create a new file in `client/src/components/templates/` with naming convention `TemplateNameResume.js`:

```jsx
import React from 'react';
import '../../styles/templates/TemplateName.css';

const TemplateNameResume = ({ resumeData }) => {
  const {
    personalInfo,
    experience,
    education,
    skills,
    summary,
    // other resume sections
  } = resumeData;

  return (
    <div className="template-name-container">
      {/* Template structure goes here */}
      <div className="header">
        {personalInfo.name && <h1>{personalInfo.name}</h1>}
        {/* Other personal info */}
      </div>
      
      {/* Resume sections */}
    </div>
  );
};

export default TemplateNameResume;
```

### 2. Create the CSS File

Create a new file in `client/src/styles/templates/` with naming convention `TemplateName.css`:

```css
/* Template specific styles */
.template-name-container {
  /* Container styles */
}

.template-name-container .header {
  /* Header styles */
}

/* Additional section styles */
```

### 3. Register the Template

Add your template to the `TemplateSelector.js` component:

```jsx
// In TemplateSelector.js
import TemplateNameResume from './templates/TemplateNameResume';

// Add to templates array
const templates = [
  // ... existing templates
  {
    id: 'template-name',
    name: 'Template Name',
    component: TemplateNameResume,
    thumbnail: 'template-name-thumbnail.jpg'
  }
];
```

### 4. Update App.js

Make sure your template is included in the App component's rendering logic:

```jsx
// In App.js
import TemplateNameResume from './components/templates/TemplateNameResume';

// Add to the renderTemplate function
const renderTemplate = () => {
  switch(selectedTemplate) {
    // ... existing cases
    case 'template-name':
      return <TemplateNameResume resumeData={resumeData} />;
    default:
      // ... default case
  }
};
```

## Tailwind CSS Integration

If using Tailwind CSS for your template:

1. Use Tailwind utility classes directly in your template component
2. For template-specific styles that can't be handled with utilities, use:

```jsx
// In your template component
import '../../styles/templates/TemplateName.css';
```

With CSS file containing:

```css
@layer components {
  .template-name-specific-component {
    @apply flex flex-col bg-gray-100 p-4 rounded;
    /* any CSS properties not available in Tailwind */
  }
}
```

## Template Guidelines

For consistency across templates:

1. **Responsive Design**: Ensure your template works on all screen sizes and prints properly
2. **Section Consistency**: Include standard sections (personal info, summary, experience, education, skills)
3. **Data Handling**: Gracefully handle missing data (don't show empty sections)
4. **Print Optimization**: Include print media queries for proper PDF export
5. **Accessibility**: Use semantic HTML and ensure adequate contrast

## Example: ProProfile Template

The ProProfile template demonstrates a two-column layout with a dark sidebar:

```jsx
// ProProfileResume.js (simplified)
import React from 'react';
import '../../styles/templates/ProProfile.css';

const ProProfileResume = ({ resumeData }) => {
  return (
    <div className="pro-profile-container">
      <div className="sidebar">
        {/* Skills & contact info */}
      </div>
      <div className="main-content">
        {/* Work experience & education */}
      </div>
    </div>
  );
};
```

With CSS:

```css
/* ProProfile.css (simplified) */
.pro-profile-container {
  display: flex;
  min-height: 100%;
}

.pro-profile-container .sidebar {
  width: 30%;
  background-color: #1a365d;
  color: white;
  padding: 2rem;
}

.pro-profile-container .main-content {
  width: 70%;
  padding: 2rem;
}
```

## Testing Your Template

Once your template is created:

1. Test with various data sets to ensure it handles different content lengths
2. Test responsiveness on different screen sizes
3. Test printing/PDF export
4. Get user feedback on design and usability
