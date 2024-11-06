// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Chat = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = React.useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Connect to Socket.io server
    socket.current = io('http://localhost:5000'); // Replace with actual server URL

    // Join conversation room
    socket.current.emit('joinConversation', conversationId);

    // Listen for incoming messages
    socket.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, [conversationId]);

  // Fetch initial messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${conversationId}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };
    fetchMessages();
  }, [conversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    const messageData = {
      conversationId,
      sender: user._id,
      text: newMessage,
    };

    try {
      const res = await axios.post('/api/messages', messageData);

      // Emit the message to the Socket.io server
      socket.current.emit('sendMessage', res.data);

      // Add message to local state
      setMessages((prevMessages) => [...prevMessages, res.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id} className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}>
            <p>{msg.text}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
