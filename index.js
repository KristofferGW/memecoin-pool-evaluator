const express = require('express');
const { getTokensToProvideMetrics } = require('./controllers/metricsController');
const tokensToProvide = require('./config/tokens');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/metrics', async (req, res) => {
    console.log("Fetching token metrics...");
    try {
        await getTokensToProvideMetrics();
        res.status(200).json(tokensToProvide);
    } catch (error) {
        console.error("Error fetching token metrics:", error);
        res.status(500).json({ error: "Failed to fetch token metrics" });
    }
});

app.post('/add-token', (req, res) => {
    const { tokenId, targetMarketCap } = req.body;

    if (!tokenId || !targetMarketCap) {
        return res.status(400).json({ error: "Please provide tokenId and targetMarketCap"});
    }

    const newToken = {
        id: tokenId,
        targetMarketCap: targetMarketCap
    };
    tokensToProvide.push(newToken);

    console.log(`Added new token: ${tokenId} with target market cap of ${targetMarketCap}`);
    res.status(201).json({ message: `Token ${tokenId} added successfully`, token: newToken });
});

app.delete('/remove-token', (req, res) => {
    const { tokenId } = req.body;

    if (!tokenId) {
        return res.status(400).json({ error: "Please provide tokenId" });
    }

    const tokenIndex = tokensToProvide.findIndex(token => token.id === tokenId);

    if (tokenIndex === -1) {
        return res.status(404).json({ error: `Token with id ${tokenId} not found` });
    };

    const removedToken = tokensToProvide.splice(tokenIndex, 1);
    console.log(`Removed token ${tokenId}`);
    res.status(200).json({ message: `Token ${tokenId} removed successfully`, token: removedToken[0] });
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
