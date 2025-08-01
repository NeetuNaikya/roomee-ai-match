export const getRoomDocumentation = (req, res) => {
    // TODO: Fetch documentation from DB
    res.json({ title: 'Room Documentation', content: 'Details about rooms and matching.' });
};