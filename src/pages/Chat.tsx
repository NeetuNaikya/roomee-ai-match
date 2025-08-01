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

  const [isTyping, setIsTyping] = useState(false);
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsTyping(false);
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl dark:bg-gradient-to-r dark:from-pink-900 dark:via-pink-800 dark:to-pink-900 relative overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute animate-pulse bg-pink-200 dark:bg-pink-900 rounded-full opacity-30 w-32 h-32 top-[-40px] left-[-40px]" />
        <div className="absolute animate-pulse bg-pink-300 dark:bg-pink-800 rounded-full opacity-20 w-24 h-24 top-20 right-[-30px]" />
        <div className="absolute animate-pulse bg-pink-400 dark:bg-pink-700 rounded-full opacity-20 w-16 h-16 bottom-10 left-10" />
        <div className="absolute animate-bounce-slow bg-pink-300 dark:bg-pink-700 rounded-full opacity-10 w-40 h-40 bottom-[-60px] right-[-60px]" />
        <div className="absolute animate-spin-slow bg-pink-200 dark:bg-pink-900 rounded-full opacity-10 w-24 h-24 top-1/2 left-1/2" />
      </div>
      <h2 className="text-3xl font-extrabold mb-6 text-pink-600 dark:text-pink-200 text-center drop-shadow">💬 Chat with your Match</h2>
      <div className="mb-4 h-72 overflow-y-auto bg-pink-50 dark:bg-pink-950 rounded-xl p-4 z-10 relative flex flex-col gap-2">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center animate-fade-in">No messages yet.</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${msg.user === 'You' ? 'justify-end' : 'justify-start'} animate-bubble-in`}
            >
              {msg.user !== 'You' && (
                <div className="w-8 h-8 rounded-full bg-pink-300 dark:bg-pink-700 flex items-center justify-center text-white font-bold shadow animate-avatar-in">
                  {msg.user[0]}
                </div>
              )}
              <div className={`px-4 py-2 rounded-2xl shadow text-base font-medium ${msg.user === 'You' ? 'bg-pink-500 text-white animate-bubble-right' : 'bg-white dark:bg-pink-800 text-pink-700 dark:text-pink-100 animate-bubble-left'}`}
                style={{ transition: 'all 0.3s' }}>
                {msg.text}
                <span className="block text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              {msg.user === 'You' && (
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold shadow animate-avatar-in">
                  {msg.user[0]}
                </div>
              )}
            </div>
          ))
        )}
        {/* Typing indicator animation */}
        {isTyping && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-pink-300 dark:bg-pink-700 flex items-center justify-center text-white font-bold shadow animate-avatar-in">...</div>
            <div className="px-4 py-2 rounded-2xl shadow bg-white dark:bg-pink-800 text-pink-700 dark:text-pink-100 animate-bubble-left">
              <span className="dot-typing">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 z-10 relative animate-fade-in">
        <input
          type="text"
          className="flex-1 p-3 border-2 border-pink-300 rounded-xl bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={text}
          onChange={e => {
            setText(e.target.value);
            setIsTyping(e.target.value.length > 0);
          }}
          placeholder="Type your message..."
          required
        />
        <button
          type="submit"
          className={`bg-pink-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-200 relative overflow-hidden ${loading ? 'animate-send' : 'hover:bg-pink-700 dark:bg-pink-800 dark:hover:bg-pink-900 hover:scale-105'}`}
          disabled={loading}
        >
          <span className="inline-block animate-send-icon">{loading ? '...' : 'Send'}</span>
        </button>
      </form>
      {error && <div className="mt-4 text-red-600 dark:text-red-400 text-center animate-fade-in">{error}</div>}
      {/* More chat animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.5s ease; }
        @keyframes bubble-in { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-bubble-in { animation: bubble-in 0.5s cubic-bezier(.4,2,.3,1) both; }
        @keyframes bubble-left { from { transform: translateX(-30px); opacity: 0; } to { transform: none; opacity: 1; } }
        .animate-bubble-left { animation: bubble-left 0.5s cubic-bezier(.4,2,.3,1) both; }
        @keyframes bubble-right { from { transform: translateX(30px); opacity: 0; } to { transform: none; opacity: 1; } }
        .animate-bubble-right { animation: bubble-right 0.5s cubic-bezier(.4,2,.3,1) both; }
        @keyframes avatar-in { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .animate-avatar-in { animation: avatar-in 0.5s cubic-bezier(.4,2,.3,1) both; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite; }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        @keyframes send { 0% { background: #ec4899; } 100% { background: #f472b6; } }
        .animate-send { animation: send 0.7s alternate infinite; }
        @keyframes send-icon { 0% { transform: translateY(0); } 50% { transform: translateY(-3px); } 100% { transform: translateY(0); } }
        .animate-send-icon { animation: send-icon 0.7s infinite; }
        .dot-typing span { display: inline-block; animation: dot-typing 1.2s infinite; }
        .dot-typing span:nth-child(2) { animation-delay: 0.2s; }
        .dot-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-typing { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Chat;
