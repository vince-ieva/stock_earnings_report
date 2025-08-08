// Build Configuration Script
// This script helps generate the api-key.js file for different environments

const fs = require('fs');
const path = require('path');

function generateApiKeyFile() {
    const apiKey = process.env.FMP_API_KEY;
    const outputPath = path.join(__dirname, 'api-key.js');
    
    let content;
    if (apiKey && apiKey !== 'YOUR_FMP_API_KEY_HERE') {
        content = `// API Key Configuration
// This file is generated from environment variables during build
// Generated at: ${new Date().toISOString()}

window.FMP_API_KEY = '${apiKey}';`;
        console.log('✅ API key configured from environment variable');
    } else {
        content = `// API Key Configuration
// No API key found in environment - using demo mode
// Generated at: ${new Date().toISOString()}

window.FMP_API_KEY = null;`;
        console.log('⚠️  Warning: No API key found in environment. Using demo mode.');
    }
    
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`📝 Generated api-key.js at ${outputPath}`);
}

// Run if called directly
if (require.main === module) {
    generateApiKeyFile();
}

module.exports = { generateApiKeyFile };