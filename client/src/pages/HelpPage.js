import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import './HelpPage.css'; // Import our new CSS

const HelpPage = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageListRef = useRef(null);

  useEffect(() => {
    // Connect to the socket server
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    // Clean up the connection when the component unmounts
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on('receive-help-message', (message) => {
        setMessages((prevMessages) => [...prevMessages, { ...message, type: 'received' }]);
      });
    }
  }, [socket]);

  // Scroll to the bottom of the message list when new messages arrive
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        text: newMessage,
        sender: 'user', // In a real app, you'd have user info here
        timestamp: new Date(),
      };
      // Add the message to our own list
      setMessages([...messages, { ...messageData, type: 'sent' }]);
      // Send the message to the server
      socket.emit('send-help-message', messageData);
      setNewMessage('');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="help-page-container">
        <h1>Help & Support</h1>
        <p>Welcome to the SyncSpace help center. Chat with us live!</p>
        
        <div className="chat-window">
          <div className="message-list" ref={messageListRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>

        <Link to="/dashboard" style={{ marginTop: '2rem', display: 'inline-block' }}>Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default HelpPage;