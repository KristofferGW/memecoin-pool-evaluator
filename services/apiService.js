const axios = require('axios');

const fetchMarketData = async (tokenIds) => {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
            params: {
                vs_currency: 'usd',
                ids: tokenIds.join(','),
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching market data:", error.message);
        return null;
    }
}

module.exports = { fetchMarketData };