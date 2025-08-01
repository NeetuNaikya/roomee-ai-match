import React, { useState } from 'react';
import axios from 'axios';

const quizQuestions = [
  { id: 1, question: 'Are you an early bird or night owl?', options: ['Early bird', 'Night owl'] },
  { id: 2, question: 'Do you prefer a quiet or social environment?', options: ['Quiet', 'Social'] },
  { id: 3, question: 'How tidy are you?', options: ['Very tidy', 'Somewhat tidy', 'Not tidy'] }
];

const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>(Array(quizQuestions.length).fill(''));
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (idx: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Replace with your JWT token logic
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/quiz/submit', { answers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get('http://localhost:5000/api/quiz/result', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScore(res.data.score);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error submitting quiz');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow dark:bg-gradient-to-r dark:from-pink-900 dark:via-pink-800 dark:to-pink-900">
      <h2 className="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-200">Roommate Compatibility Quiz</h2>
      <form onSubmit={handleSubmit}>
        {quizQuestions.map((q, idx) => (
          <div key={q.id} className="mb-4">
            <label className="block font-semibold mb-2 text-pink-700 dark:text-pink-200">{q.question}</label>
            <select
              className="w-full p-2 border rounded bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-200"
              value={answers[idx]}
              onChange={e => handleChange(idx, e.target.value)}
              required
            >
              <option value="">Select an option</option>
              {q.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 dark:bg-pink-800 dark:hover:bg-pink-900"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </form>
      {score !== null && (
        <div className="mt-6 text-lg font-bold text-pink-700 dark:text-pink-200">
          Your compatibility score: {score}
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-600 dark:text-red-400">{error}</div>
      )}
    </div>
  );
};

export default Quiz;
