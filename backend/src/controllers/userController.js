export const getProfile = (req, res) => {
    // TODO: Fetch user profile from DB
    res.json({ email: req.user.email, name: 'Roomee User', matches: [] });
};

export const updateProfile = (req, res) => {
    // TODO: Update user profile in DB
    res.json({ success: true, profile: req.body });
};