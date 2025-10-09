import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as aiService from '../services/aiService';
import './AIChatModal.css';

const AIChatModal = ({ isOpen, onClose, onAutoFill }) => {
  console.log('AIChatModal render - isOpen=', isOpen);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '👋 Hi! I\'m your AI Resume Assistant. I can help you with:\n\n• Skills recommendations\n• Professional summary writing\n• Experience description improvement\n• Template selection\n• ATS optimization tips\n\nWhat would you like help with today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.chatWithAI(input.trim());
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.message,
        suggestions: response.suggestions || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again. 😅',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.action === 'auto-fill' && onAutoFill) {
      onAutoFill(suggestion.data);
    } else if (suggestion.action === 'ask') {
      setInput(suggestion.text);
    }
  };

  const quickQuestions = [
    "What skills should I include for a Software Engineer?",
    "How do I write a professional summary?",
    "Which template is best for my experience level?",
    "What action verbs should I use in Experience section?",
    "How can I optimize my resume for ATS?",
    "What keywords are important for my industry?"
  ];

  if (!isOpen) return null;

  const modalContent = (
    <div className="chat-modal-overlay" style={{ zIndex: 99999 }}>
      <div className="chat-modal">
        <div className="chat-header">
          <div className="chat-title">
            <span className="ai-icon">🤖</span>
            <h3>AI Resume Assistant</h3>
          </div>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="suggestions">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.icon} {suggestion.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-questions">
          <p>Quick questions:</p>
          <div className="quick-questions-grid">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => setInput(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about resume writing..."
            disabled={isLoading}
            rows="3"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="send-btn"
            title="Send message"
          >
            {isLoading ? '⏳' : '✏️'}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return ReactDOM.createPortal(modalContent, document.body);
  }

  return modalContent;
};

export default AIChatModal;