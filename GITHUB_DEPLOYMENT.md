# GitHub Pages Deployment with Environment Variables

This guide explains how to deploy your stock website to GitHub Pages with secure API key management using GitHub Secrets.

## Step 1: Set up GitHub Secret

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `FMP_API_KEY`
6. Value: Your actual Financial Modeling Prep API key
7. Click **Add secret**

## Step 2: Enable GitHub Pages

1. In your repository settings, scroll down to **Pages** section
2. Under **Source**, select **GitHub Actions**
3. The deployment workflow will automatically run

## Step 3: Deploy

1. Push your code to the `main` branch
2. GitHub Actions will automatically:
   - Build your site
   - Inject your API key from the secret
   - Deploy to GitHub Pages

## How it Works

### GitHub Actions Workflow
- Runs on every push to `main` branch
- Creates `api-key.js` file using your secret
- Deploys the complete site to GitHub Pages

### Security Features
- ✅ API key is stored securely in GitHub Secrets
- ✅ API key is never visible in your repository code
- ✅ API key is injected only during deployment
- ✅ Works with your existing code structure

### File Generation
The workflow creates an `api-key.js` file that looks like:
```javascript
// API Key Configuration
// This file is generated from GitHub Secrets during deployment

window.FMP_API_KEY = 'your_actual_api_key_here';
```

## Testing

### Local Development
- Use your existing `api-key.js` file (git-ignored)
- Or copy from `api-key.template.js`

### Production (GitHub Pages)
- API key is automatically injected from GitHub Secrets
- No manual configuration needed

## Troubleshooting

### If deployment fails:
1. Check that `FMP_API_KEY` secret is set correctly
2. Verify GitHub Pages is enabled with "GitHub Actions" source
3. Check the Actions tab for error details

### If API doesn't work on deployed site:
1. Verify your API key is valid at [Financial Modeling Prep](https://financialmodelingprep.com)
2. Check browser console for API errors
3. Ensure your secret name is exactly `FMP_API_KEY`

## Benefits

- 🔒 **Secure**: API key never appears in your code
- 🚀 **Automatic**: Deploys on every push
- 🔄 **Flexible**: Works with your existing code
- 📱 **Fast**: Static site with CDN delivery

## Your GitHub Pages URL

Once deployed, your site will be available at:
```
https://yourusername.github.io/stock-website/
```

Replace `yourusername` with your actual GitHub username.