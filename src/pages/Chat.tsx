import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
// Voice AI: browser speech recognition and synthesis
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Chat: React.FC = () => {
  // Pro user and payment modal state
  const [isPro, setIsPro] = useState(false); // Simulate user status
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [matchmakerStatus, setMatchmakerStatus] = useState<'idle' | 'calling' | 'connected'>('idle');

  // Simulate payment upgrade
  const handleUpgradeToPro = () => {
    setShowPaymentModal(false);
    setIsPro(true);
  };

  // Simulate calling matchmaker
  const handleCallMatchmaker = () => {
    setMatchmakerStatus('calling');
    setTimeout(() => setMatchmakerStatus('connected'), 2000);
  };
  const db = getFirestore();
  // Voice AI state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  // Start voice recording
  const handleVoiceStart = () => {
    setVoiceError('');
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceError('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsRecording(true);
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setVoiceError('Voice recognition error: ' + event.error);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setIsTyping(transcript.length > 0);
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Stop voice recording
  const handleVoiceStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play message with speech synthesis
  const handleSpeak = (msg: string) => {
    if (!('speechSynthesis' in window)) {
      setVoiceError('Speech synthesis not supported in this browser.');
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(msg);
    utter.lang = 'en-IN';
    window.speechSynthesis.speak(utter);
  };
  const { matchId } = useParams();
  const [user] = useState(() => auth.currentUser);
  const [messages, setMessages] = useState<{user: string, text: string, timestamp: number}[]>([]);
  // Firestore real-time listener
  useEffect(() => {
    if (!matchId) return;
    const q = query(collection(db, 'chats', String(matchId), 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        user: doc.data().user,
        text: doc.data().text,
        timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate().getTime() : Date.now()
      })));
    });
    return () => unsubscribe();
  }, [matchId, db]);
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
      } catch (err) {
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
      if (!user) throw new Error('User not authenticated');
      await addDoc(collection(db, 'chats', String(matchId), 'messages'), {
        user: user.displayName || user.email || 'You',
        text,
        timestamp: serverTimestamp()
      });
      setText('');
    } catch (err) {
      setError('Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl dark:bg-gradient-to-r dark:from-pink-900 dark:via-pink-800 dark:to-pink-900 relative overflow-hidden">
      {/* Payment Modal for Pro Upgrade */}
      {/* Payment Modal for Pro Upgrade */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-pink-950 p-8 rounded-2xl shadow-xl max-w-sm w-full flex flex-col gap-4">
            <h3 className="text-xl font-bold text-pink-700 dark:text-pink-200">Upgrade to Pro</h3>
            <p className="text-pink-700 dark:text-pink-100">Pro users can call their matchmaker directly from chat for personalized help!</p>
            <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-xl text-center">
              <span className="text-2xl font-bold text-pink-600 dark:text-pink-200">₹499</span> <span className="text-pink-700 dark:text-pink-100">/month</span>
            </div>
            <button
              className="bg-pink-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-pink-700"
              onClick={handleUpgradeToPro}
            >Pay & Upgrade (Demo)</button>
            <button
              className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded font-bold shadow hover:bg-gray-400"
              onClick={() => setShowPaymentModal(false)}
            >Cancel</button>
          </div>
        </div>
      )}
      {/* Aadhaar/Phone/OTP Verification UI */}
      <div className="mb-8">
      {/* Call Matchmaker Button (Pro only) */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isPro && <span className="bg-pink-600 text-white px-2 py-1 rounded font-bold text-xs flex items-center gap-1 animate-fade-in">💎 Pro</span>}
        </div>
        <div>
          {isPro ? (
            <button
              className={`bg-gradient-to-r from-pink-500 to-pink-700 text-white px-5 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-all animate-fade-in flex items-center gap-2 ${matchmakerStatus === 'calling' ? 'opacity-70 pointer-events-none' : ''}`}
              onClick={handleCallMatchmaker}
              title="Call your matchmaker for help"
            >
              <span>📞</span>
              {matchmakerStatus === 'idle' && 'Call Matchmaker'}
              {matchmakerStatus === 'calling' && <span className="animate-send-icon">Calling...</span>}
              {matchmakerStatus === 'connected' && <span className="animate-fade-in">Connected!</span>}
            </button>
          ) : (
            <button
              className="bg-pink-200 text-pink-700 px-5 py-2 rounded-xl font-bold shadow hover:bg-pink-300 hover:scale-105 transition-all animate-fade-in flex items-center gap-2"
              onClick={() => setShowPaymentModal(true)}
              title="Upgrade to Pro to call your matchmaker"
            >
              <span>🔒</span> Call Matchmaker (Pro)
            </button>
          )}
        </div>
      </div>
      {/* Call Matchmaker Button (Pro only) */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isPro && <span className="bg-pink-600 text-white px-2 py-1 rounded font-bold text-xs flex items-center gap-1 animate-fade-in">💎 Pro</span>}
        </div>
        <div>
          {isPro ? (
            <button
              className={`bg-gradient-to-r from-pink-500 to-pink-700 text-white px-5 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-all animate-fade-in flex items-center gap-2 ${matchmakerStatus === 'calling' ? 'opacity-70 pointer-events-none' : ''}`}
              onClick={handleCallMatchmaker}
              title="Call your matchmaker for help"
            >
              <span>📞</span>
              {matchmakerStatus === 'idle' && 'Call Matchmaker'}
              {matchmakerStatus === 'calling' && <span className="animate-send-icon">Calling...</span>}
              {matchmakerStatus === 'connected' && <span className="animate-fade-in">Connected!</span>}
            </button>
          ) : (
            <button
              className="bg-pink-200 text-pink-700 px-5 py-2 rounded-xl font-bold shadow hover:bg-pink-300 hover:scale-105 transition-all animate-fade-in flex items-center gap-2"
              onClick={() => setShowPaymentModal(true)}
              title="Upgrade to Pro to call your matchmaker"
            >
              <span>🔒</span> Call Matchmaker (Pro)
            </button>
          )}
        </div>
      </div>
      </div>
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
                style={{ transition: 'all 0.3s', position: 'relative' }}>
                {msg.text}
                <span className="block text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                {/* Voice playback button */}
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-pink-200 dark:bg-pink-700 rounded-full p-1 text-xs text-pink-700 dark:text-pink-100 shadow hover:bg-pink-300 hover:scale-110 transition"
                  title="Play message"
                  onClick={() => handleSpeak(msg.text)}
                >🔊</button>
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
        {/* Voice AI microphone button */}
        <button
          type="button"
          className={`bg-pink-400 text-white px-3 py-2 rounded-full shadow-lg transition-all duration-200 relative overflow-hidden ${isRecording ? 'animate-send' : 'hover:bg-pink-500 hover:scale-110'}`}
          style={{ minWidth: 44 }}
          onClick={isRecording ? handleVoiceStop : handleVoiceStart}
          title={isRecording ? 'Stop recording' : 'Speak'}
          disabled={loading}
        >
          {isRecording ? <span className="animate-send-icon">🎤...</span> : <span>🎤</span>}
        </button>
        <button
          type="submit"
          className={`bg-pink-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-200 relative overflow-hidden ${loading ? 'animate-send' : 'hover:bg-pink-700 dark:bg-pink-800 dark:hover:bg-pink-900 hover:scale-105'}`}
          disabled={loading}
        >
          <span className="inline-block animate-send-icon">{loading ? '...' : 'Send'}</span>
        </button>
      </form>
      {error && <div className="mt-4 text-red-600 dark:text-red-400 text-center animate-fade-in">{error}</div>}
      {voiceError && <div className="mt-2 text-red-500 text-center animate-fade-in">{voiceError}</div>}
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
