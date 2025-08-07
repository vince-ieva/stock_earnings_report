// Use API configuration from config.js
const FMP_API_KEY = API_CONFIG.FMP_API_KEY;
const FMP_BASE_URL = API_CONFIG.FMP_BASE_URL;

// Predefined stock list
const PREDEFINED_STOCKS = ['AMD', 'GOOG', 'PNNT', 'SCM', 'AMZN', 'IBM', 'SERV', 'DELL', 'SMCI', 'SYM', 'KMI', 'INOD', 'HUM', 'PANW', 'FTNT', 'FI'];

// DOM Elements
const stocksGrid = document.getElementById('stocks-grid');
const loadingSection = document.getElementById('loading-section');
const tickerInput = document.getElementById('ticker-input');
const searchBtn = document.getElementById('search-btn');
const showMoreBtn = document.getElementById('show-more-tickers');
const allTickers = document.querySelector('.all-tickers');

// Track loaded stocks
let loadedStocks = new Set();

// API Functions
async function fetchStockQuote(symbol) {
    try {
        const url = `${FMP_BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data[0]; // Returns first result
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return null;
    }
}

async function fetchStockProfile(symbol) {
    try {
        const url = `${FMP_BASE_URL}/profile/${symbol}?apikey=${FMP_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data[0];
        
    } catch (error) {
        console.error(`Error fetching profile for ${symbol}:`, error);
        return null;
    }
}

async function fetchStockEarningsHistory(symbol) {
    try {
        const url = `https://financialmodelingprep.com/stable/earnings?symbol=${symbol}&apikey=${FMP_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Find the most recent earnings with actual EPS (not null)
        const lastReportedEarnings = data.find(item => item.epsActual !== null);
        
        return lastReportedEarnings;
        
    } catch (error) {
        console.error(`Error fetching ${symbol} earnings history:`, error);
        return null;
    }
}

// Helper Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function getTimeUntilEarnings(dateString) {
    const earningsDate = new Date(dateString);
    const today = new Date('2025-08-07');
    const diffTime = earningsDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Tomorrow';
    } else if (diffDays > 0) {
        return `In ${diffDays} days`;
    } else {
        return `${Math.abs(diffDays)} days ago`;
    }
}

function createStockCard(symbol, quoteData, profileData, lastEarnings) {
    const companyName = quoteData?.name || profileData?.companyName || symbol;
    const currentPrice = quoteData?.price || 0;
    const priceChange = quoteData?.change || 0;
    const priceChangePercent = quoteData?.changesPercentage || 0;
    const currentEPS = quoteData?.eps || 0;
    const earningsAnnouncement = quoteData?.earningsAnnouncement;

    const priceChangeClass = priceChange >= 0 ? 'positive' : 'negative';
    const priceChangeIcon = priceChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';

    let html = `
        <div class="individual-stock-card" id="card-${symbol}">
            <div class="stock-header">
                <div class="stock-info">
                    <h2>${symbol}</h2>
                    <div class="company-name">${companyName}</div>
                </div>
                <div class="stock-price">
                    <div class="current-price">$${parseFloat(currentPrice).toFixed(2)}</div>
                    <div class="price-change ${priceChangeClass}">
                        <i class="fas ${priceChangeIcon}"></i>
                        $${Math.abs(parseFloat(priceChange)).toFixed(2)} (${Math.abs(parseFloat(priceChangePercent)).toFixed(2)}%)
                    </div>
                </div>
            </div>
    `;

    // Last Reported Earnings Section
    if (lastEarnings) {
        const lastEarningsDate = formatDate(lastEarnings.date);
        
        const epsActual = parseFloat(lastEarnings.epsActual);
        const epsEstimated = parseFloat(lastEarnings.epsEstimated);
        const revenueActual = parseFloat(lastEarnings.revenueActual) / 1000000000; // Convert to billions
        const revenueEstimated = parseFloat(lastEarnings.revenueEstimated) / 1000000000; // Convert to billions
        
        // Calculate EPS performance (Green only if beat by 1%+, red otherwise)
        const epsPerformance = ((epsActual - epsEstimated) / epsEstimated * 100).toFixed(1);
        const epsPerformanceClass = epsPerformance >= 1 ? 'positive' : 'negative';
        const epsPerformanceText = epsActual >= epsEstimated ? 
            `Beat by ${epsPerformance}%` : `Missed by ${Math.abs(epsPerformance)}%`;
        const epsIcon = epsPerformance >= 1 ? 'fa-arrow-up' : 'fa-arrow-down';

        // Calculate Revenue performance
        const revenuePerformance = ((revenueActual - revenueEstimated) / revenueEstimated * 100).toFixed(1);
        const revenuePerformanceClass = revenueActual >= revenueEstimated ? 'positive' : 'negative';
        const revenuePerformanceText = revenueActual >= revenueEstimated ? 
            `Beat by ${revenuePerformance}%` : `Missed by ${Math.abs(revenuePerformance)}%`;
        const revenueIcon = revenueActual >= revenueEstimated ? 'fa-arrow-up' : 'fa-arrow-down';

        html += `
            <div class="earnings-section">
                <h3 class="section-title">
                    <i class="fas fa-chart-line"></i>
                    Last Earnings
                </h3>
                <div class="earnings-list">
                    <div class="earnings-item">
                        <div class="earnings-date">
                            <i class="fas fa-calendar-check"></i>
                            ${lastEarningsDate}
                            <span style="font-size: 0.8rem; color: #666; margin-left: 8px;">(${getTimeUntilEarnings(lastEarnings.date)})</span>
                        </div>
                        
                        <div class="earnings-details">
                            <div class="detail-item">
                                <div class="detail-label">EPS</div>
                                <div class="detail-value">
                                    $${epsActual.toFixed(2)} vs $${epsEstimated.toFixed(2)}
                                    <span class="performance-indicator ${epsPerformanceClass}">
                                        <i class="fas ${epsIcon}"></i>
                                        ${epsPerformanceText}
                                    </span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Revenue</div>
                                <div class="detail-value">
                                    $${revenueActual.toFixed(1)}B vs $${revenueEstimated.toFixed(1)}B
                                    <span class="performance-indicator ${revenuePerformanceClass}">
                                        <i class="fas ${revenueIcon}"></i>
                                        ${revenuePerformanceText}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Next Earnings Section
    html += `
        <div class="earnings-section">
            <h3 class="section-title">
                <i class="fas fa-calendar-alt"></i>
                Next Earnings
            </h3>
            <div class="earnings-list">
    `;

    if (earningsAnnouncement) {
        const earningsDate = earningsAnnouncement.split('T')[0];
        const formattedDate = formatDate(earningsDate);
        const timeUntil = getTimeUntilEarnings(earningsDate);

        html += `
            <div class="earnings-item">
                <div class="earnings-date">
                    <i class="fas fa-calendar-day"></i>
                    ${formattedDate}
                    <span style="font-size: 0.8rem; color: #666; margin-left: 8px;">(${timeUntil})</span>
                </div>
                
                <div class="earnings-details">
                    <div class="detail-item">
                        <div class="detail-label">EPS</div>
                        <div class="detail-value">$${parseFloat(currentEPS).toFixed(2)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Market Cap</div>
                        <div class="detail-value">$${(quoteData.marketCap / 1000000000).toFixed(1)}B</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="no-data">
                <i class="fas fa-calendar-times" style="font-size: 1.5rem; margin-bottom: 10px; color: #666;"></i>
                <h4>No earnings date available</h4>
            </div>
        `;
    }

    html += `
            </div>
        </div>
        </div>
    `;

    return html;
}

function showStockError(symbol, message) {
    return `
        <div class="individual-stock-card">
            <div class="error">
                <h3>${symbol}</h3>
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin: 15px 0; color: #ef4444;"></i>
                <p style="font-size: 0.9rem;">${message}</p>
            </div>
        </div>
    `;
}

async function loadStockData(symbol) {
    console.log(`Loading ${symbol} data...`);
    
    try {
        // Fetch all stock data in parallel
        const [quoteData, profileData, lastEarnings] = await Promise.all([
            fetchStockQuote(symbol),
            fetchStockProfile(symbol),
            fetchStockEarningsHistory(symbol)
        ]);
        
        if (!quoteData) {
            return showStockError(symbol, 'Failed to fetch stock data');
        }
        
        console.log(`${symbol} loaded successfully`);
        return createStockCard(symbol, quoteData, profileData, lastEarnings);
        
    } catch (error) {
        console.error(`Error loading ${symbol} data:`, error);
        return showStockError(symbol, 'Error loading data');
    }
}

async function loadAllPredefinedStocks() {
    console.log('Loading all predefined stocks...');
    
    // Check if API key is configured
    if (FMP_API_KEY === 'YOUR_FMP_API_KEY') {
        stocksGrid.innerHTML = `
            <div style="grid-column: 1 / -1; background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 15px; padding: 30px; text-align: center;">
                <h3 style="color: #856404; margin-bottom: 15px;">🔑 Configure API Key</h3>
                <p style="color: #856404; margin-bottom: 20px;">To get real stock earnings data:</p>
                <ol style="color: #856404; text-align: left; max-width: 500px; margin: 0 auto; line-height: 1.6;">
                    <li>Sign up at <a href="https://financialmodelingprep.com" target="_blank" style="color: #856404;">Financial Modeling Prep</a></li>
                    <li>Get your free API key</li>
                    <li>Update the API key in config.js</li>
                    <li>Refresh this page</li>
                </ol>
            </div>
        `;
        return;
    }
    
    // Show loading
    loadingSection.style.display = 'block';
    stocksGrid.innerHTML = '';
    
    try {
        // Load stocks in batches to avoid overwhelming the API
        const batchSize = 5;
        const batches = [];
        
        for (let i = 0; i < PREDEFINED_STOCKS.length; i += batchSize) {
            batches.push(PREDEFINED_STOCKS.slice(i, i + batchSize));
        }
        
        for (const batch of batches) {
            const stockPromises = batch.map(symbol => loadStockData(symbol));
            const stockCards = await Promise.all(stockPromises);
            
            // Add cards to grid
            stockCards.forEach((cardHtml, index) => {
                const symbol = batch[index];
                loadedStocks.add(symbol);
                stocksGrid.innerHTML += cardHtml;
            });
            
            // Small delay between batches to be nice to the API
            if (batches.indexOf(batch) < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        loadingSection.style.display = 'none';
        console.log('All stocks loaded successfully');
        
    } catch (error) {
        console.error('Error loading stocks:', error);
        loadingSection.style.display = 'none';
        stocksGrid.innerHTML = `
            <div style="grid-column: 1 / -1;" class="error">
                <h3>Error Loading Stocks</h3>
                <p>Failed to load stock data. Please try refreshing the page.</p>
            </div>
        `;
    }
}

async function addSingleStock(symbol) {
    if (loadedStocks.has(symbol)) {
        // Remove existing card
        const existingCard = document.getElementById(`card-${symbol}`);
        if (existingCard) {
            existingCard.remove();
        }
    }
    
    // Add loading placeholder
    const loadingCard = document.createElement('div');
    loadingCard.className = 'individual-stock-card';
    loadingCard.id = `card-${symbol}`;
    loadingCard.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <div>Loading ${symbol}...</div>
        </div>
    `;
    stocksGrid.appendChild(loadingCard);
    
    // Load data and replace placeholder
    const cardHtml = await loadStockData(symbol);
    loadingCard.outerHTML = cardHtml;
    loadedStocks.add(symbol);
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const ticker = tickerInput.value.trim().toUpperCase();
    if (ticker) {
        addSingleStock(ticker);
        tickerInput.value = '';
    }
});

tickerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const ticker = tickerInput.value.trim().toUpperCase();
        if (ticker) {
            addSingleStock(ticker);
            tickerInput.value = '';
        }
    }
});

// Ticker button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('ticker-btn')) {
        const ticker = e.target.dataset.ticker;
        addSingleStock(ticker);
    }
});

// Show more tickers toggle
showMoreBtn.addEventListener('click', () => {
    const isVisible = allTickers.style.display !== 'none';
    allTickers.style.display = isVisible ? 'none' : 'flex';
    showMoreBtn.textContent = isVisible ? 'Show More Tickers' : 'Show Less Tickers';
});

// Auto-convert input to uppercase
tickerInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadAllPredefinedStocks();
});