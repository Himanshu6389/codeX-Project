import React, { useState, useEffect, useRef } from 'react';
import UserList from './UserList';
import Message from './Message';
import ChatInput from './ChatInput';

function Chat({ socket, username }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for user list updates
    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    socket.on('userJoined', (data) => {
      setUsers(data.users);
      // Add system message
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), system: true, text: data.message }
      ]);
    });

    socket.on('userLeft', (data) => {
      setUsers(data.users);
      // Add system message
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), system: true, text: data.message }
      ]);
    });

    // Listen for typing indicators
    socket.on('userTyping', (user) => {
      setTypingUser(user);
    });

    socket.on('userStoppedTyping', () => {
      setTypingUser(null);
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off('message');
      socket.off('userList');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
    };
  }, [socket]);

  const sendMessage = (message) => {
    if (!socket) return;
    
    socket.emit('sendMessage', { message });
  };

  const handleTyping = (isTyping) => {
    if (!socket) return;
    
    if (isTyping) {
      socket.emit('typing');
    } else {
      socket.emit('stopTyping');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <UserList users={users} />
      </div>
      
      <div className="main-chat">
        <div className="chat-messages">
          {messages.map((message) => (
            message.system ? (
              <div className="system-message" key={message.id}>
                {message.text}
              </div>
            ) : (
              <Message
                key={message.id}
                message={message}
                isOwnMessage={message.user === username}
              />
            )
          ))}
          
          {typingUser && (
            <div className="typing-indicator">
              {typingUser} is typing...
            </div>
          )}
          
          {/* Reference for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput
          sendMessage={sendMessage}
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
}

export default Chat;