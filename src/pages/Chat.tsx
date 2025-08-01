import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Chat: React.FC = () => {
  const { matchId } = useParams();
  const [messages, setMessages] = useState<{user: string, text: string, timestamp: number}[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err: any) {
        setError('Failed to load messages');
      }
    };
    fetchMessages();
  }, [matchId, token]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`http://localhost:5000/api/chat/${matchId}`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText('');
      // Refresh messages
      const res = await axios.get(`http://localhost:5000/api/chat/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err: any) {
      setError('Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow dark:bg-gradient-to-r dark:from-pink-900 dark:via-pink-800 dark:to-pink-900">
      <h2 className="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-200">Chat with your Match</h2>
      <div className="mb-4 h-64 overflow-y-auto bg-pink-50 dark:bg-pink-950 rounded p-4">
        {messages.length === 0 ? (
          <div className="text-gray-500">No messages yet.</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <span className="font-bold text-pink-700 dark:text-pink-200">{msg.user}:</span>
              <span className="ml-2 text-gray-800 dark:text-pink-100">{msg.text}</span>
              <span className="ml-2 text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-200"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message..."
          required
        />
        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 dark:bg-pink-800 dark:hover:bg-pink-900"
          disabled={loading}
        >
          Send
        </button>
      </form>
      {error && <div className="mt-4 text-red-600 dark:text-red-400">{error}</div>}
    </div>
  );
};

export default Chat;
