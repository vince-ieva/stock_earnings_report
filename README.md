# Stock Earnings Tracker

A modern web application that displays real-time stock earnings data with a beautiful, responsive interface.

## Features

- 📊 **Real-time earnings data** from Financial Modeling Prep API
- 📅 **Daily earnings calendar** with upcoming earnings organized by date
- 🎯 **Earnings vs expectations** tracking (beat/missed/upcoming)
- 📱 **Responsive design** that works on all devices
- 🔄 **Live stock quotes** and price changes
- 📈 **Interactive filtering** by earnings performance
- ⚡ **Fast loading** with efficient API calls

## Setup Instructions

### 1. Get Your Free API Key

1. Visit [Financial Modeling Prep](https://financialmodelingprep.com)
2. Sign up for a free account
3. Navigate to your dashboard to get your API key
4. Free tier includes 250 API calls per day

### 2. Configure the API Key (Secure Method)

1. Copy the API key template file:
   ```bash
   cp api-key.template.js api-key.js
   ```

2. Open `api-key.js` in your editor

3. Replace `'YOUR_FMP_API_KEY_HERE'` with your actual API key:
   ```javascript
   window.FMP_API_KEY = 'your_actual_api_key_here';
   ```

4. Save the file. The `api-key.js` file is automatically ignored by git and won't be committed to version control.

**Alternative: Environment Variables**
If you're running this in a Node.js environment, you can also set the `FMP_API_KEY` environment variable:
```bash
export FMP_API_KEY='your_actual_api_key_here'
```

### 3. Run the Application

1. Open `index.html` in your web browser
2. The application will automatically load real earnings data
3. If no API key is configured, it will show sample data with setup instructions

## API Features

The application fetches:

- **Earnings Calendar**: Upcoming and recent earnings announcements
- **Stock Quotes**: Real-time price data and changes
- **Company Profiles**: Company names and details
- **Earnings Data**: EPS estimates, actual results, revenue data

## Configuration Options

You can customize the application behavior in `config.js`:

```javascript
const API_CONFIG = {
    FMP_API_KEY: 'your_api_key',
    EARNINGS_DAYS_BACK: 7,      // Days to look back for reported earnings
    EARNINGS_DAYS_AHEAD: 30,    // Days to look ahead for upcoming earnings
    MAX_STOCKS: 50,             // Maximum number of stocks to display
    REQUEST_DELAY: 100          // Delay between API requests (ms)
};
```

## Data Sources

- **Financial Modeling Prep API**: Earnings calendar, stock quotes, company data
- **Real-time updates**: Data is fetched from live API endpoints
- **Fallback data**: Sample data is used when API is not configured

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Rate Limits

Free tier limitations:
- 250 API calls per day
- Real-time data updates
- All endpoints included

For higher usage, consider upgrading to a paid plan.

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly copied from the FMP dashboard
- Check that there are no extra spaces or characters
- Verify your account is active and not exceeded rate limits

### No Data Loading
- Check browser console for error messages
- Verify internet connection
- Ensure API key has proper permissions

### Rate Limit Exceeded
- Free tier has 250 calls per day
- Consider upgrading account or reducing refresh frequency

## File Structure

```
stock-website/
├── index.html              # Main HTML file
├── styles.css              # CSS styling
├── script.js               # Main JavaScript application
├── config.js               # API configuration (secure)
├── api-key.template.js     # API key template file
├── api-key.js             # Your API key (create from template, git ignored)
├── test-api.html          # API testing page
├── test-api.js            # API testing scripts
├── .gitignore             # Git ignore patterns
└── README.md              # This file
```

## License

This project is for educational and personal use. Please respect API terms of service and rate limits.