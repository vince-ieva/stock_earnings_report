// 24-Hour Caching System for GitHub Pages
// Uses localStorage to cache API responses for exactly 24 hours

class StockCache {
    constructor() {
        this.cachePrefix = 'stockCache_';
        this.cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.init();
    }

    init() {
        // Clean up expired cache on startup
        this.cleanExpiredCache();
        console.log('📦 Stock cache system initialized (24-hour duration)');
    }

    // Generate cache key for a stock symbol
    getCacheKey(symbol) {
        return `${this.cachePrefix}${symbol}`;
    }

    // Check if cached data exists and is still fresh
    isCacheFresh(symbol) {
        const cacheKey = this.getCacheKey(symbol);
        const cachedData = localStorage.getItem(cacheKey);
        
        if (!cachedData) {
            return false;
        }

        try {
            const data = JSON.parse(cachedData);
            const now = Date.now();
            const age = now - data.timestamp;
            
            if (age > this.cacheDuration) {
                // Cache expired, remove it
                localStorage.removeItem(cacheKey);
                return false;
            }
            
            return true;
        } catch (error) {
            // Invalid cache data, remove it
            localStorage.removeItem(cacheKey);
            return false;
        }
    }

    // Get cached data if it exists and is fresh
    getCachedData(symbol) {
        if (!this.isCacheFresh(symbol)) {
            return null;
        }

        const cacheKey = this.getCacheKey(symbol);
        const cachedData = localStorage.getItem(cacheKey);
        
        try {
            const data = JSON.parse(cachedData);
            const ageHours = Math.round((Date.now() - data.timestamp) / (1000 * 60 * 60));
            console.log(`📦 Using cached data for ${symbol} (${ageHours}h old)`);
            return data.stockData;
        } catch (error) {
            localStorage.removeItem(cacheKey);
            return null;
        }
    }

    // Store data in cache with timestamp
    setCachedData(symbol, stockData) {
        const cacheKey = this.getCacheKey(symbol);
        const cacheEntry = {
            symbol: symbol,
            stockData: stockData,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.cacheDuration
        };

        try {
            localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
            console.log(`💾 Cached data for ${symbol} (valid for 24 hours)`);
        } catch (error) {
            console.warn(`Failed to cache data for ${symbol}:`, error);
            // If localStorage is full, try clearing old cache
            this.cleanExpiredCache();
            try {
                localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
                console.log(`💾 Cached data for ${symbol} after cleanup`);
            } catch (retryError) {
                console.error(`Unable to cache data for ${symbol}:`, retryError);
            }
        }
    }

    // Remove cache for specific symbol
    clearCache(symbol) {
        const cacheKey = this.getCacheKey(symbol);
        localStorage.removeItem(cacheKey);
        console.log(`🗑️ Cleared cache for ${symbol}`);
    }

    // Clean all expired cache entries
    cleanExpiredCache() {
        const now = Date.now();
        let removedCount = 0;
        
        // Get all localStorage keys
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.cachePrefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    const age = now - data.timestamp;
                    
                    if (age > this.cacheDuration) {
                        localStorage.removeItem(key);
                        removedCount++;
                    }
                } catch (error) {
                    // Remove corrupted cache entries
                    localStorage.removeItem(key);
                    removedCount++;
                }
            }
        });

        if (removedCount > 0) {
            console.log(`🧹 Cleaned ${removedCount} expired cache entries`);
        }
    }

    // Clear all cache (useful for debugging)
    clearAllCache() {
        const keys = Object.keys(localStorage);
        let removedCount = 0;
        
        keys.forEach(key => {
            if (key.startsWith(this.cachePrefix)) {
                localStorage.removeItem(key);
                removedCount++;
            }
        });
        
        console.log(`🗑️ Cleared all stock cache (${removedCount} entries)`);
        return removedCount;
    }

    // Get cache statistics
    getCacheStats() {
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
        
        let freshCount = 0;
        let expiredCount = 0;
        const stockList = [];
        let totalSizeBytes = 0;
        
        cacheKeys.forEach(key => {
            try {
                const dataString = localStorage.getItem(key);
                totalSizeBytes += dataString.length;
                
                const data = JSON.parse(dataString);
                const age = Date.now() - data.timestamp;
                const ageHours = Math.round(age / (1000 * 60 * 60));
                const remainingHours = Math.max(0, 24 - ageHours);
                
                if (age <= this.cacheDuration) {
                    freshCount++;
                    stockList.push({
                        symbol: data.symbol,
                        ageHours: ageHours,
                        remainingHours: remainingHours,
                        size: Math.round(dataString.length / 1024) + 'KB'
                    });
                } else {
                    expiredCount++;
                }
            } catch (error) {
                expiredCount++;
            }
        });

        return {
            total: cacheKeys.length,
            fresh: freshCount,
            expired: expiredCount,
            totalSizeKB: Math.round(totalSizeBytes / 1024),
            stocks: stockList
        };
    }

    // Display cache status in console
    showCacheStatus() {
        const stats = this.getCacheStats();
        
        console.log('📊 Cache Status:');
        console.log(`   Total entries: ${stats.total}`);
        console.log(`   Fresh: ${stats.fresh}`);
        console.log(`   Expired: ${stats.expired}`);
        console.log(`   Total size: ${stats.totalSizeKB}KB`);
        
        if (stats.stocks.length > 0) {
            console.log('   Cached stocks:');
            stats.stocks.forEach(stock => {
                console.log(`     ${stock.symbol}: ${stock.ageHours}h old, ${stock.remainingHours}h remaining (${stock.size})`);
            });
        }
        
        return stats;
    }
}

// Initialize the cache system
const stockCache = new StockCache();

// Make cache available globally for debugging
window.stockCache = stockCache;

// Cached API functions
async function fetchStockDataCached(symbol) {
    // Try to get from cache first
    const cachedData = stockCache.getCachedData(symbol);
    if (cachedData) {
        return cachedData;
    }

    // Not in cache or expired, fetch fresh data
    console.log(`🌐 Fetching fresh data for ${symbol} (will cache for 24h)`);
    
    try {
        // Fetch all data in parallel
        const [quoteData, profileData, earningsData] = await Promise.all([
            fetchStockQuote(symbol),
            fetchStockProfile(symbol),
            fetchStockEarningsHistory(symbol)
        ]);

        // Only cache if we got valid quote data
        if (quoteData) {
            const stockData = {
                quote: quoteData,
                profile: profileData,
                earnings: earningsData
            };
            
            stockCache.setCachedData(symbol, stockData);
            return stockData;
        }
        
        console.warn(`No quote data received for ${symbol}`);
        return null;
        
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return null;
    }
}

// Global debug functions
window.showCacheStatus = () => stockCache.showCacheStatus();
window.clearAllCache = () => {
    const count = stockCache.clearAllCache();
    console.log(`Cleared ${count} cache entries. Refresh page to reload data.`);
};
window.forceRefresh = (symbol) => {
    if (!symbol) {
        console.log('Usage: forceRefresh("SYMBOL")');
        return;
    }
    stockCache.clearCache(symbol);
    console.log(`Cache cleared for ${symbol}. Reload the stock to fetch fresh data.`);
};