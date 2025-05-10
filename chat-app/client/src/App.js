import React, { useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';

const SOCKET_SERVER_URL = 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    // Connect to socket server
    const newSocket = io(SOCKET_SERVER_URL);
    
    // Set up socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      
      // Join the chat with username
      newSocket.emit('join', username);
      
      setSocket(newSocket);
      setIsLoggedIn(true);
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      alert('Error connecting to chat server. Please try again.');
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Real-Time Chat App</h1>
      </header>
      
      {!isLoggedIn ? (
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Join the Chat</h2>
            <input
              type="text"
              placeholder="Enter your username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit" className="login-button">
              Join
            </button>
          </form>
        </div>
      ) : (
        <Chat socket={socket} username={username} />
      )}
    </div>
  );
}

export default App;