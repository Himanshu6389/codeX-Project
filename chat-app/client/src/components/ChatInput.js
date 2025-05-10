import React, { useState, useEffect, useRef } from 'react';

function ChatInput({ sendMessage, onTyping }) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    onTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage('');
    
    // Clear typing indicator
    onTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        className="chat-input"
        value={message}
        onChange={handleChange}
      />
      <button type="submit" className="send-button">
        Send
      </button>
    </form>
  );
}

export default ChatInput;