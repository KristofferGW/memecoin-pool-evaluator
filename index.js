const express = require('express');
const TokenManager = require('./controllers/TokenManager');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/tokens', async (req, res) => {
    const allTokens = TokenManager.getAllTokens();
    res.status(200).json(allTokens.sort((a, b) => b.xToTarget - a.xToTarget));
});

app.get('/update-market-cap', async (req, res) => {
    try {
        await TokenManager.updateMarketCaps();
        res.status(200).json({ message: "All token metrics refreshed successfully", tokens: TokenManager.getAllTokens() });
    } catch (error) {
        console.error("Error refreshing token metrics:", error.message);
        res.status(500).json({ error: "Failed to refresh token metrics" });
    }
});

app.post('/add-token', async (req, res) => {
    const { tokenId, targetMarketCap } = req.body;
    console.log("tokenId + targetMarketCap", tokenId + targetMarketCap);

    if (!tokenId || !targetMarketCap) {
        return res.status(400).json({ error: "Please provide tokenId and targetMarketCap"});
    }

    try {
        const newToken = await TokenManager.addToken(tokenId, targetMarketCap);
        res.status(201).json({ message: `Token ${tokenId} added successfully`, token: newToken});
    } catch (error) {
        console.error("Error adding token:", error.message);
        res.status(500).json({ error: "Failed to add token"});
    }
});

app.delete('/remove-token', (req, res) => {
    const { tokenId } = req.body;

    if (!tokenId) {
        return res.status(400).json({ error: "Please provide tokenId" });
    }

    try {
        const removedToken = TokenManager.removeToken(tokenId);
        res.status(200).json({ message: `Token ${tokenId} removed successfully`, token: removedToken });
    } catch (error) {
        console.error("Error removing token:", error.message);
        res.status(404).json({ error: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
