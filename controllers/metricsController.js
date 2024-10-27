const tokensToProvide = require('../config/tokens');
const { fetchMarketData } = require('../services/apiService');

const getTokensToProvideMetrics = async () => {
    const tokenIds = tokensToProvide.map(token => token.id);
    console.log("Token ids in getTokensToProvideMetrics", tokenIds);
    const marketData = await fetchMarketData(tokenIds);
    console.log("marketData", marketData);

    if (marketData && marketData.length > 0) {
        tokensToProvide.forEach(token => {
            const apiTokenData = marketData.find(item => item.id === token.id);
            if (apiTokenData) {
                token.marketCap = apiTokenData.market_cap;
                token.xToTarget = token.targetMarketCap / token.marketCap;
                token.hasReachedTarget = apiTokenData.market_cap >= token.targetMarketCap;

                if (token.hasReachedTarget) {
                    token.athDate = apiTokenData.ath_date;
                }
            }
        });

        console.log("Updated tokens with market cap:", tokensToProvide.sort((a, b) => b.xToTarget - a.xToTarget));
    } else {
        console.log("No data found.");
    }
};

module.exports = { getTokensToProvideMetrics };
