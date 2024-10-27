const { getTokensToProvideMetrics } = require('./controllers/metricsController');

(async () => {
    console.log("Fetching token metrics...");
    try {
        await getTokensToProvideMetrics();
        console.log("Token metrics fetched successfully.");
    } catch (error) {
        console.error("Error fetching token metrics:", error);
    }
})();
