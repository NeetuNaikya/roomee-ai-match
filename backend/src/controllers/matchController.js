export const getMatches = (req, res) => {
    // TODO: Fetch matches from DB
    res.json([
        { id: 1, name: 'Alice', score: 95 },
        { id: 2, name: 'Bob', score: 90 }
    ]);
};