// Test API call to earnings calendar endpoint
const API_KEY = 'zI77fzFLGnmDeta7cfzs9Zxflx2riZwi';
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

async function testEarningsCalendarAPI() {
    try {
        // Set date range from August 7th, 2025
        const today = new Date('2025-08-07');
        const fromDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
        const toDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        const from = fromDate.toISOString().split('T')[0];
        const to = toDate.toISOString().split('T')[0];
        
        const url = `${BASE_URL}/earning_calendar?from=${from}&to=${to}&apikey=${API_KEY}`;
        
        console.log('Testing API URL:', url);
        console.log('Date range:', from, 'to', to);
        
        const response = await fetch(url);
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('API Response received:');
        console.log('Total records:', data.length);
        console.log('First 3 records:', data.slice(0, 3));
        
        // Filter for AMD specifically
        const amdEarnings = data.filter(item => item.symbol === 'AMD');
        console.log('AMD earnings found:', amdEarnings.length);
        console.log('AMD earnings data:', amdEarnings);
        
        return {
            success: true,
            totalRecords: data.length,
            amdRecords: amdEarnings.length,
            amdData: amdEarnings,
            sampleData: data.slice(0, 3)
        };
        
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message,
            errorType: error.name
        };
    }
}

// Run the test
testEarningsCalendarAPI().then(result => {
    console.log('Test Result:', result);
});