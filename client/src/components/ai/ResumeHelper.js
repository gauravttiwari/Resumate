// components/ai/ResumeHelper.js
import React, { useState, useRef, useEffect } from 'react';
import { getResumeHelp } from '../../services/aiService';

/**
 * Component for AI-powered resume help chat interface
 */
const ResumeHelper = ({ resumeData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Welcome to Resumate AI Assistant! How can I help you with your resume today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat is shown
  useEffect(() => {
    if (showChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessageId = Date.now();
    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        type: 'user',
        content: inputMessage
      }
    ]);
    
    // Clear input field
    setInputMessage('');
    
    // Start loading state
    setLoading(true);
    
    try {
      // Get AI response
      const response = await getResumeHelp(inputMessage, resumeData);
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev,
        {
          id: userMessageId + 1,
          type: 'assistant',
          content: response
        }
      ]);
    } catch (error) {
      console.error('Error getting AI help:', error);
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          id: userMessageId + 1,
          type: 'system',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setShowChat(prev => !prev);
  };

  return (
    <div className={`resume-helper ${showChat ? 'open' : 'closed'}`}>
      {!showChat && (
        <button className="chat-toggle-button" onClick={toggleChat}>
          <span className="chat-icon">💬</span>
          <span className="chat-toggle-text">Resume AI Help</span>
        </button>
      )}
      
      {showChat && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>Resume AI Helper</h3>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          
          <div className="chat-messages" ref={chatContainerRef}>
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.type}`}
              >
                {message.type === 'assistant' && <span className="ai-avatar">AI</span>}
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message assistant loading">
                <span className="ai-avatar">AI</span>
                <div className="message-content">
                  <span className="typing-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Ask me about resume writing..."
              value={inputMessage}
              onChange={handleInputChange}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={loading || !inputMessage.trim()}
            >
              Send
            </button>
          </form>
          
          <div className="suggested-questions">
            <p>Try asking:</p>
            <div className="question-chips">
              {[
                "How can I improve my work experience section?",
                "What skills should I add for a tech role?",
                "How long should my resume be?",
                "What action verbs should I use?"
              ].map((question, index) => (
                <button 
                  key={index}
                  className="question-chip"
                  onClick={() => setInputMessage(question)}
                  disabled={loading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeHelper;