// In-memory chat storage for demo
const chatMessages = {};

export const getMessages = (req, res) => {
    const { matchId } = req.params;
    if (!chatMessages[matchId]) {
        // Add more demo bubbles/messages for new chats
        chatMessages[matchId] = [
            { user: "Priya", text: "Hi! Excited to connect with you 😊", timestamp: Date.now() - 60000 },
            { user: "You", text: "Hey Priya! Nice to meet you.", timestamp: Date.now() - 50000 },
            { user: "Priya", text: "What are your hobbies?", timestamp: Date.now() - 40000 },
            { user: "You", text: "I love music and cooking!", timestamp: Date.now() - 30000 },
            { user: "Priya", text: "Awesome! I enjoy painting and yoga.", timestamp: Date.now() - 20000 },
            { user: "You", text: "We should hang out sometime!", timestamp: Date.now() - 10000 },
            { user: "Priya", text: "Definitely! 😊", timestamp: Date.now() - 5000 },
        ];
    }
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