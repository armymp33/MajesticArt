# GitHub Pages Deployment Setup

## ✅ What's Been Configured

1. **Vite Configuration**: Updated to use the correct base path (`/MajesticArt/`)
2. **GitHub Actions Workflow**: Automatic build and deployment on every push to `main`

## 🔧 Important: Update Your GitHub Pages Settings

Since this is a Vite React app, you need to deploy the **built files** (not the source code). 

### Option 1: Use GitHub Actions (Recommended - Already Set Up!)

1. Go to your repository: https://github.com/armymp33/MajesticArt
2. Click **Settings** → **Pages**
3. Under **Source**, change it to:
   - **Source**: `GitHub Actions` (not "Deploy from a branch")
4. Save

The GitHub Actions workflow will automatically:
- Build your app when you push to `main`
- Deploy the built files to GitHub Pages

### Option 2: Manual Deployment (If you prefer)

If you want to keep "Deploy from a branch":
1. Change **Source** to: `Deploy from a branch`
2. Set **Branch** to: `gh-pages` (not `main`)
3. Set **Folder** to: `/ (root)`
4. You'll need to manually build and push the `dist` folder to a `gh-pages` branch

## 🌐 Your Site URL

Once deployed, your site will be available at:
**https://armymp33.github.io/MajesticArt/**

Note the `/MajesticArt/` at the end - this is required for project pages on GitHub.

## 🚀 How It Works

1. You (or your daughter) push code to the `main` branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Builds the React app
   - Deploys to GitHub Pages
3. Your site updates within 1-2 minutes!

## 📝 Testing Locally

To test the production build locally:
```bash
npm run build
npm run preview
```

This will show you exactly how it will look on GitHub Pages.

## ⚠️ Important Notes

- The base path is set to `/MajesticArt/` - all your routes will work with this prefix
- Make sure to use relative paths for images and assets
- The workflow runs automatically on every push to `main`

