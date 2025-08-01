import jwt from 'jsonwebtoken';

export const login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    // TODO: Verify with Firebase or DB
    // For now, accept any email/password for demo
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

export const verifyToken = (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, decoded });
    } catch (err) {
        res.status(401).json({ valid: false, error: err.message });
    }
};