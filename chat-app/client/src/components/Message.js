import React from 'react';

function Message({ message, isOwnMessage }) {
  return (
    <div className={`message ${isOwnMessage ? 'message-self' : 'message-other'}`}>
      {!isOwnMessage && (
        <div className="message-user">{message.user}</div>
      )}
      <div className="message-text">{message.text}</div>
      <div className="message-time">{message.time}</div>
    </div>
  );
}

export default Message;