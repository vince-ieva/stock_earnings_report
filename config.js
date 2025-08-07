// API Configuration
// To get real earnings data, sign up for a free account at https://financialmodelingprep.com
// and replace 'YOUR_FMP_API_KEY' with your actual API key

const API_CONFIG = {
    // Financial Modeling Prep API Configuration
    FMP_API_KEY: 'zI77fzFLGnmDeta7cfzs9Zxflx2riZwi', // Replace with your actual API key
    FMP_BASE_URL: 'https://financialmodelingprep.com/api/v3',
    
    // API Settings
    EARNINGS_DAYS_BACK: 7,      // Number of days to look back for reported earnings
    EARNINGS_DAYS_AHEAD: 30,    // Number of days to look ahead for upcoming earnings
    MAX_STOCKS: 50,             // Maximum number of stocks to display
    
    // Rate limiting (Free tier: 250 requests per day)
    REQUEST_DELAY: 100          // Delay between requests in milliseconds
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}