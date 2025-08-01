// In-memory chat storage for demo
const chatMessages = {};

export const getMessages = (req, res) => {
    const { matchId } = req.params;
    chatMessages[matchId] = chatMessages[matchId] || [];
    res.json(chatMessages[matchId]);
};

export const sendMessage = (req, res) => {
    const { matchId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text required' });
    chatMessages[matchId] = chatMessages[matchId] || [];
    chatMessages[matchId].push({ user: req.user.email, text, timestamp: Date.now() });
    res.json({ success: true });
};