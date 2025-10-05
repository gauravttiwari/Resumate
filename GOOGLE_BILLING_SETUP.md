# Google Cloud Billing Setup for Resumate

## 🎯 Goal
Enable billing for your "resumate" project to activate Google Search API

## 📋 Current Status
- ✅ Project exists: `gen-lang-client-0087572152`
- ❌ Billing: Disabled
- ✅ Gemini AI API: Working
- ❌ Google Search API: Needs billing

## 🛠️ Step-by-Step Instructions

### Step 1: Enable Billing
1. In your Google Cloud Console (current tab)
2. Click on your **"resumate"** project name
3. In the left sidebar, click **"Billing"**
4. Click **"Link a billing account"**
5. Select **"Create billing account"** or use existing one
6. Use the **$300 free credit** (shown at top of your screen)
7. Enter payment method (won't be charged with free credits)

### Step 2: Enable Custom Search API
1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Custom Search API"**
3. Click on it and press **"Enable"**
4. Wait 2-3 minutes for activation

### Step 3: Verify Setup
1. Return to VS Code
2. Run the API test to confirm everything works

## ⏱️ Expected Time
- Billing setup: 3-5 minutes
- API activation: 2-3 minutes
- Total: ~8 minutes

## 💡 Notes
- Free $300 credit covers extensive development usage
- Custom Search API has generous free quotas
- Billing is required but you won't be charged initially

## 🚨 If Issues Occur
- Wait 10 minutes for full propagation
- Check API restrictions in "Credentials" section
- Verify project selection in console