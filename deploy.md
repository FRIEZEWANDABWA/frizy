# Deployment Guide - Frieze Kere Wandabwa Portfolio

## Quick Deploy to Heroku (Recommended - FREE)

### Step 1: Create GitHub Repository
```bash
cd C:\Users\TEST\professional-portfolio
git init
git add .
git commit -m "Initial commit - Professional Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/frieze-portfolio.git
git push -u origin main
```

### Step 2: Deploy to Heroku
1. Go to [heroku.com](https://heroku.com) and create free account
2. Click "New" → "Create new app"
3. App name: `frieze-kere-portfolio` (or your choice)
4. Connect to GitHub and select your repository
5. Enable "Automatic deploys" from main branch
6. Click "Deploy Branch"

**Your site will be live at**: `https://frieze-kere-portfolio.herokuapp.com`

## Alternative: Render.com (Also FREE)

1. Go to [render.com](https://render.com)
2. Connect GitHub account
3. Select your repository
4. Choose "Web Service"
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `gunicorn app:app`
7. Click "Create Web Service"

## Alternative: Railway.app (FREE)

1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Select repository
4. Auto-deploys with zero config

## GitHub Commands to Upload

```bash
# Navigate to your portfolio folder
cd C:\Users\TEST\professional-portfolio

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Professional Portfolio - Frieze Kere Wandabwa"

# Create main branch
git branch -M main

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/frieze-portfolio.git

# Push to GitHub
git push -u origin main
```

## Custom Domain (Optional)
- Buy domain from Namecheap/GoDaddy
- Add CNAME record pointing to your Heroku app
- Add domain in Heroku dashboard

Your portfolio will be live and accessible worldwide!