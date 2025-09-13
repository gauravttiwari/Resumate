import React, { useState } from 'react';
import './styles/InterviewPrep.css';

const InterviewPrep = () => {
  document.title = "ResuMate - Interview Preparation";
  
  const [profileData, setProfileData] = useState({
    field: '',
    jobRole: '',
    qualification: ''
  });
  
  const [interviewData, setInterviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMockInterview, setShowMockInterview] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const fields = [
    { value: 'medical', label: 'Medical', icon: '🏥' },
    { value: 'tech', label: 'Technology', icon: '💻' },
    { value: 'non-tech', label: 'Non-Technical', icon: '💼' },
    { value: 'diploma', label: 'Diploma/Trade', icon: '🎓' }
  ];
  
  const qualifications = [
    { value: 'diploma', label: 'Diploma' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'postgraduate', label: 'Post Graduate' },
    { value: 'certification', label: 'Professional Certification' }
  ];
  
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
  
  const generateInterviewPrep = async () => {
    if (!profileData.field || !profileData.qualification) {
      alert('Please select field and qualification');
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: profileData.field,
          jobRole: profileData.jobRole,
          qualification: profileData.qualification
        })
      });
      
      const data = await response.json();
      setInterviewData(data);
    } catch (error) {
      console.error('Error generating interview prep:', error);
      // Fallback data for demo
      setInterviewData({
        questions: [
          `What interests you most about working in the ${profileData.field} field?`,
          `How does your ${profileData.qualification} prepare you for this role?`,
          `Describe a challenging situation and how you handled it.`,
          `Where do you see yourself in 5 years in this field?`,
          `What are your key strengths relevant to this position?`
        ],
        sampleAnswers: [
          `I'm passionate about ${profileData.field} because it allows me to make a meaningful impact while utilizing my technical skills.`,
          `My ${profileData.qualification} has provided me with both theoretical knowledge and practical experience essential for this role.`,
          `I approach challenges methodically by breaking them down, researching solutions, and collaborating with team members when needed.`
        ],
        tips: [
          `Research the company's recent developments in ${profileData.field}`,
          `Prepare specific examples from your ${profileData.qualification} experience`,
          `Practice explaining technical concepts in simple terms`,
          `Show enthusiasm for continuous learning`,
          `Prepare thoughtful questions about the role and company`
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const startMockInterview = () => {
    setShowMockInterview(true);
    setCurrentQuestion(0);
    setUserAnswer('');
    setFeedback('');
  };
  
  const submitAnswer = async () => {
    try {
      const response = await fetch('/api/ai/mock-interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: interviewData.questions[currentQuestion],
          answer: userAnswer,
          field: profileData.field,
          jobRole: profileData.jobRole
        })
      });
      
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      setFeedback('Good answer! Try to be more specific with examples and show your passion for the field.');
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestion < interviewData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setFeedback('');
    } else {
      setShowMockInterview(false);
      alert('Mock interview completed! Great job practicing.');
    }
  };
  
  return (
    <div className="interview-prep">
      <div className="interview-header">
        <h1>🎯 Interview Preparation Assistant</h1>
        <p>Get personalized interview questions and practice based on your field and qualification</p>
      </div>
      
      {!interviewData && !showMockInterview && (
        <div className="profile-form">
          <h2>📋 Tell us about your profile</h2>
          
          <div className="form-section">
            <label>Field of Interest:</label>
            <div className="field-options">
              {fields.map(field => (
                <div 
                  key={field.value}
                  className={`field-option ${profileData.field === field.value ? 'selected' : ''}`}
                  onClick={() => handleInputChange('field', field.value)}
                >
                  <span className="field-icon">{field.icon}</span>
                  <span>{field.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <label>Job Role (Optional):</label>
            <input
              type="text"
              className="job-role-input"
              placeholder="e.g., Software Engineer, Nurse, Sales Associate"
              value={profileData.jobRole}
              onChange={(e) => handleInputChange('jobRole', e.target.value)}
            />
          </div>
          
          <div className="form-section">
            <label>Qualification Level:</label>
            <select 
              className="qualification-select"
              value={profileData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
            >
              <option value="">Select Qualification</option>
              {qualifications.map(qual => (
                <option key={qual.value} value={qual.value}>{qual.label}</option>
              ))}
            </select>
          </div>
          
          <button 
            className={`generate-btn ${isGenerating ? 'loading' : ''}`}
            onClick={generateInterviewPrep}
            disabled={isGenerating || !profileData.field || !profileData.qualification}
          >
            {isGenerating ? '🤖 Generating...' : '🚀 Generate Interview Prep'}
          </button>
        </div>
      )}
      
      {interviewData && !showMockInterview && (
        <div className="interview-content">
          <div className="content-header">
            <h2>📝 Interview Questions for {profileData.jobRole || profileData.field} ({profileData.qualification})</h2>
            <div className="action-buttons">
              <button 
                className="mock-interview-btn"
                onClick={startMockInterview}
              >
                🎙️ Start Mock Interview
              </button>
              <button 
                className="regenerate-btn"
                onClick={generateInterviewPrep}
              >
                🔄 Generate New Questions
              </button>
            </div>
          </div>
          
          <div className="content-sections">
            <div className="questions-section">
              <h3>❓ Common Interview Questions</h3>
              <div className="questions-list">
                {interviewData.questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <span className="question-number">{index + 1}</span>
                    <span className="question-text">{question}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="answers-section">
              <h3>💡 Sample Answers</h3>
              <div className="answers-list">
                {interviewData.sampleAnswers.map((answer, index) => (
                  <div key={index} className="answer-item">
                    <p>{answer}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="tips-section">
              <h3>🎯 Pro Tips</h3>
              <div className="tips-list">
                {interviewData.tips.map((tip, index) => (
                  <div key={index} className="tip-item">
                    <span className="tip-icon">✅</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showMockInterview && (
        <div className="mock-interview">
          <div className="mock-header">
            <h2>🎙️ Mock Interview - Question {currentQuestion + 1} of {interviewData.questions.length}</h2>
            <button 
              className="exit-mock-btn"
              onClick={() => setShowMockInterview(false)}
            >
              ❌ Exit Mock
            </button>
          </div>
          
          <div className="mock-content">
            <div className="current-question">
              <h3>Question:</h3>
              <p>{interviewData.questions[currentQuestion]}</p>
            </div>
            
            <div className="answer-input">
              <h3>Your Answer:</h3>
              <textarea
                className="answer-textarea"
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={6}
              />
            </div>
            
            <div className="mock-actions">
              <button 
                className="submit-answer-btn"
                onClick={submitAnswer}
                disabled={!userAnswer.trim()}
              >
                📤 Submit Answer
              </button>
              
              {feedback && (
                <button 
                  className="next-question-btn"
                  onClick={nextQuestion}
                >
                  ➡️ Next Question
                </button>
              )}
            </div>
            
            {feedback && (
              <div className="feedback-section">
                <h3>🤖 AI Feedback:</h3>
                <p>{feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {(interviewData || showMockInterview) && (
        <button 
          className="back-btn"
          onClick={() => {
            setInterviewData(null);
            setShowMockInterview(false);
            setProfileData({ field: '', jobRole: '', qualification: '' });
          }}
        >
          ← Start New Interview Prep
        </button>
      )}
    </div>
  );
};

export default InterviewPrep;