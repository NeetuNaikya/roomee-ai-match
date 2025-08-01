// Dummy quiz logic
const quizQuestions = [
    { id: 1, question: 'Are you an early bird or night owl?', options: ['Early bird', 'Night owl'] },
    { id: 2, question: 'Do you prefer a quiet or social environment?', options: ['Quiet', 'Social'] },
    { id: 3, question: 'How tidy are you?', options: ['Very tidy', 'Somewhat tidy', 'Not tidy'] }
];

let userQuizResults = {};

export const submitQuiz = (req, res) => {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ error: 'Answers required' });
    // Simple scoring: count matching answers
    userQuizResults[req.user.email] = answers;
    res.json({ success: true });
};

export const getQuizResult = (req, res) => {
    const answers = userQuizResults[req.user.email] || [];
    // Dummy compatibility score
    const score = answers.length * 33;
    res.json({ answers, score });
};