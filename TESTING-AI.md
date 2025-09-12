# Testing Gemini AI Integration

This guide provides instructions for testing the Gemini AI features integrated into the ResuMate application.

## Prerequisites

Before testing, ensure you have:

1. Set up your Gemini API key in the server's `.env` file
2. Installed all required dependencies for both client and server
3. Started both the client and server applications

## Test Plan for Gemini AI Features

### 1. Resume Optimization Test

**Test Scenario**: Verify that the AI provides relevant keyword and content improvement suggestions.

**Steps**:
1. Navigate to the resume form page
2. Fill in basic resume information (name, contact info, job title, etc.)
3. Add some work experience entries with simple descriptions
4. Click on the "Resume Optimizer" tab in the AI sidebar
5. Click "Optimize Resume" button
6. Verify that the AI provides:
   - Relevant keyword suggestions
   - Content improvement recommendations
   - Skills to add based on job title
   - Improvement areas
7. Select some suggestions and click "Apply Selected Suggestions"
8. Verify that the suggestions are correctly applied to your resume

**Expected Result**: The AI should provide contextually relevant suggestions that improve the resume's ATS compatibility.

### 2. ATS Scoring Test

**Test Scenario**: Verify that the AI accurately scores the resume's ATS compatibility.

**Steps**:
1. Create a resume with varying levels of completeness
2. Click on the "ATS Score" tab in the AI sidebar
3. Observe the overall score and section scores
4. Click "Show Improvement Suggestions" to view detailed recommendations
5. Make some of the suggested improvements to your resume
6. Verify that the ATS score increases after implementing the suggestions

**Expected Result**: The ATS score should reflect the resume's compatibility with ATS systems and increase as improvements are made.

### 3. Summary Generation Test

**Test Scenario**: Verify that the AI generates professional summaries based on resume content.

**Steps**:
1. Create a resume with work experience, skills, and education
2. Click on the "Summary Generator" tab in the AI sidebar
3. Click "Generate Professional Summary"
4. Review the generated summary
5. Click "Apply Summary" to add it to your resume
6. Verify that the summary appears in your resume's summary section

**Expected Result**: The AI should generate a cohesive, professional summary that highlights key aspects of your experience and skills.

### 4. Template Recommendation Test

**Test Scenario**: Verify that the AI recommends templates based on job type and resume content.

**Steps**:
1. Create resumes for different job types (tech, non-tech, medical, diploma)
2. Navigate to the template selection page
3. Enable AI recommendations
4. Verify that the AI recommends appropriate templates for each job type
5. Review the reasoning provided for each recommendation
6. Select a recommended template and continue
7. Verify that the selected template is applied to your resume

**Expected Result**: The AI should recommend templates that are appropriate for the specific job type and resume content.

### 5. Resume Helper Chat Test

**Test Scenario**: Verify that the AI chat provides helpful responses to resume-related questions.

**Steps**:
1. Click on the chat icon in the corner of any page
2. Ask various resume-related questions:
   - "How can I improve my work experience section?"
   - "What skills should I add for a software developer role?"
   - "How long should my resume be?"
   - "What action verbs should I use?"
3. Verify that the AI provides helpful, contextual responses
4. Try asking about your specific resume by referencing sections you've filled in

**Expected Result**: The AI should provide helpful guidance tailored to resume writing best practices and your specific context.

## Performance Testing

### Response Time Test

**Test Scenario**: Verify that AI responses are returned within an acceptable timeframe.

**Steps**:
1. Use a stopwatch to time how long each AI feature takes to respond
2. Test with varying amounts of resume content (minimal, average, extensive)

**Expected Result**: AI responses should typically be returned within:
- Optimization: 3-5 seconds
- ATS Scoring: 2-4 seconds
- Summary Generation: 2-3 seconds
- Template Recommendation: 1-3 seconds
- Chat Responses: 1-2 seconds

### Cache Effectiveness Test

**Test Scenario**: Verify that the AI response caching mechanism works properly.

**Steps**:
1. Make identical AI requests in succession
2. Time the first and subsequent responses

**Expected Result**: Subsequent identical requests should return much faster (nearly instantaneous) compared to the first request.

## Edge Case Testing

### Error Handling Test

**Test Scenario**: Verify that the application handles API errors gracefully.

**Steps**:
1. Temporarily invalidate your API key in the `.env` file
2. Try to use each AI feature
3. Verify that appropriate error messages are displayed
4. Restore your valid API key

**Expected Result**: The application should display user-friendly error messages and not crash when API errors occur.

### Content Limits Test

**Test Scenario**: Verify that the application handles extremely large resume content.

**Steps**:
1. Create a resume with unusually large content in each section
2. Try to use each AI feature with this large resume

**Expected Result**: The application should handle large content appropriately, possibly by truncating or summarizing when necessary.

## Bug Reporting

If you encounter any issues during testing, please report them with:
1. The specific feature being tested
2. Steps to reproduce the issue
3. Expected vs. actual behavior
4. Screenshots if applicable
5. Browser and device information