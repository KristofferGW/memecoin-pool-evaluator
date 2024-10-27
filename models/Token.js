const axios = require('axios');

class Token {
    constructor(id, targetMarketCap) {
        this.name = null;
        this.id = id;
        this.targetMarketCap = targetMarketCap;
        this.marketCap = null;
        this.xToTarget = null;
    }

    async fetchMetrics() {
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    ids: this.id
                }
            });
            const data = response.data[0];
            if (data) {
                this.name = data.name;
                this.marketCap = data.market_cap;
                this.xToTarget = this.targetMarketCap / this.marketCap;
            }
        } catch (error) {
            console.error(`Error fetching metrics for token ${this.id}`);
        }
    }
}

module.exports = Token;