const Token = require('../models/Token');
const { fetchMarketDataFromApi } = require('../services/fetchMarketDataFromApi');

class TokenManager {
    constructor() {
        this.tokens = [];
    }

    async addToken(id, targetMarketCap) {
        const token = new Token(id, targetMarketCap);
        await token.fetchMetrics();
        this.tokens.push(token);
    }

    removeToken(tokenId) {
        const index = this.getIndex(tokenId);
        if (index === -1) {
            throw new Error(`Token with id ${tokenId} not found`);
        }
        return this.tokens.splice(index, 1)[0];
    }

    getAllTokens() {
        return this.tokens;
    }

    async updateMarketCaps() {
        const tokenIds = [];
        this.tokens.forEach((token) => {
            tokenIds.push(token.id);
        });

        const currentMarketData = await fetchMarketDataFromApi(tokenIds);
        for (let i = 0; i < this.tokens.length; i++) {
            const newTokenData = currentMarketData.find((token) => token.id === this.tokens[i].id)
            this.tokens[i].marketCap = newTokenData.market_cap;
        }
        
    }

    updateTargetMarketCap(tokenId, newTargetMarketCap) {
        const tokenIndex = this.getIndex(tokenId);
        this.tokens[tokenIndex].targetMarketCap = newTargetMarketCap;
    }

    getIndex(tokenId) {
        return this.tokens.findIndex(token => token.id === tokenId);
    }
}

module.exports = new TokenManager;