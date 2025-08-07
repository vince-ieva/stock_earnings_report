// API Configuration
// To get real earnings data, sign up for a free account at https://financialmodelingprep.com
// Configure your API key by creating a file named 'api-key.js' with:
// window.FMP_API_KEY = 'your_actual_api_key_here';

// Function to get API key from various sources
function getApiKey() {
    // Try to get from environment-like sources
    if (typeof window !== 'undefined' && window.FMP_API_KEY) {
        return window.FMP_API_KEY;
    }
    
    // For Node.js environment (if used for testing)
    if (typeof process !== 'undefined' && process.env && process.env.FMP_API_KEY) {
        return process.env.FMP_API_KEY;
    }
    
    // Return null if no API key is configured
    return null;
}

const API_CONFIG = {
    // Financial Modeling Prep API Configuration
    FMP_API_KEY: getApiKey(), // Will be null if not configured
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