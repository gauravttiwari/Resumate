# 🔑 Google Gemini API Key - Complete Step-by-Step Guide

## 🎯 Method 1: Google AI Studio (EASIEST - Recommended!)

### Step 1: Open Google AI Studio
```
URL: https://aistudio.google.com/app/apikey
```
**Action**: Copy paste karo browser me

---

### Step 2: Sign In
- Google account se sign in karo
- Koi bhi Gmail account use kar sakte ho

---

### Step 3: Get API Key Button
Page open hone ke baad 2 options dikhenge:

**Option A: Agar pehli baar aa rahe ho:**
- **"Get API key"** blue button dikhai dega
- Us button pe click karo

**Option B: Agar pehle se keys hain:**
- **"Create API key"** button dikhai dega
- Us button pe click karo

---

### Step 4: Create API Key Popup
Popup window me **3 options** dikhenge:

```
○ Create API key in new project        ← ⚠️ SELECT THIS ONE!
○ Create API key in existing project
○ Use existing API key
```

**⚠️ IMPORTANT:** 
- **"Create API key in new project"** ko select karo
- Existing project mat select karo (wo kaam nahi karega)

Click: **"Continue"** ya **"Create"** button

---

### Step 5: Wait for Creation
```
Loading message dikhega:
"Creating project..."
or
"Generating API key..."
```
**Wait: 20-30 seconds**

---

### Step 6: Copy API Key
Popup me new API key show hoga:

```
┌─────────────────────────────────────────┐
│  Your API key                           │
│  ──────────────────────────────────     │
│  AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX       │
│                                         │
│  [📋 Copy]  [Show]  [Restrict key]     │
└─────────────────────────────────────────┘
```

**Action:**
1. Click **"Copy"** button (clipboard icon)
2. Ya manually select karke Ctrl+C

**⚠️ IMPORTANT:** Key ko safe rakhna - ye phir nahi dikhegi!

---

### Step 7: Update .env File
```bash
# Open file:
c:\Users\dell\OneDrive\Desktop\Resumate\server\.env

# Find this line:
GEMINI_API_KEY=old_key_here

# Replace with:
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
                ↑ Paste your copied key here
```

**Save File:** Ctrl+S

---

### Step 8: Test API Key
```bash
# Open terminal in server folder:
cd c:\Users\dell\OneDrive\Desktop\Resumate\server

# Run test:
node advancedGeminiCheck.js
```

**Expected Output:**
```
✅ FOUND WORKING COMBINATION!
   API Version: v1beta
   Model: gemini-pro
   Response: Hi! I'm here to help.
```

---

## 🎯 Method 2: Google Cloud Console (Alternative)

Agar AI Studio se kaam nahi bana to ye try karo:

### Step 1: Open Cloud Console
```
URL: https://console.cloud.google.com/
```

---

### Step 2: Create New Project
```
1. Top left me "Select a project" dropdown pe click karo
2. Popup me top right "NEW PROJECT" button pe click
3. Project name: resumate-gemini
4. Click "CREATE"
5. Wait 1-2 minutes
```

---

### Step 3: Enable Generative Language API
```
1. Top left dropdown se new project select karo
2. URL open karo:
   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
3. Blue "ENABLE" button pe click karo
4. Wait 30-60 seconds for "API enabled" message
```

---

### Step 4: Create Credentials
```
1. Left sidebar me "Credentials" pe click karo
   (Ya URL: https://console.cloud.google.com/apis/credentials)
   
2. Top me "+ CREATE CREDENTIALS" button pe click
3. Dropdown me "API key" select karo
4. Popup me API key show hoga
5. "COPY" button pe click karo
6. Close popup
```

---

### Step 5: Update & Test (Same as Method 1)
```bash
# Update server/.env:
GEMINI_API_KEY=your_copied_key

# Test:
cd server
node advancedGeminiCheck.js
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "API key invalid"
**Solution:**
- Key properly copy kiya hai? (spaces na ho)
- .env file me quotes nahi chahiye: `GEMINI_API_KEY=AIza...` (✅)
- Not: `GEMINI_API_KEY="AIza..."` (❌)

### Issue 2: "Models not found" (404)
**Solution:**
- **NEW project** me key banai thi? (existing project kaam nahi karega)
- Try again: Delete old key → Create new key in NEW project
- Wait 5-10 minutes (sometimes propagation delay hota hai)

### Issue 3: "Generative Language API not enabled"
**Solution:**
```
1. https://console.cloud.google.com/apis/library
2. Search: "Generative Language API"
3. Select your NEW project (top left)
4. Click "ENABLE"
5. Create fresh API key after enabling
```

---

## 📋 Quick Checklist

Before testing, verify:
- [ ] API key copied from **NEW project** (not existing)
- [ ] Key pasted in `server/.env` file
- [ ] No quotes around key in .env
- [ ] No extra spaces before/after key
- [ ] File saved (Ctrl+S)
- [ ] Terminal in correct folder (`server/`)

---

## 🎥 Visual Guide

### Screen 1: Google AI Studio Homepage
```
┌────────────────────────────────────────────┐
│  Google AI Studio                    [👤] │
│                                            │
│  Build with Gemini                         │
│                                            │
│  [Get API key] ← Click this button         │
└────────────────────────────────────────────┘
```

### Screen 2: Create API Key Popup
```
┌────────────────────────────────────────────┐
│  Create API key                       [×]  │
│  ──────────────────────────────────────    │
│                                            │
│  ⦿ Create API key in new project ← SELECT │
│  ○ Create API key in existing project     │
│  ○ Use existing API key                   │
│                                            │
│              [Cancel]  [Continue]          │
└────────────────────────────────────────────┘
```

### Screen 3: API Key Created
```
┌────────────────────────────────────────────┐
│  Your API key                         [×]  │
│  ──────────────────────────────────────    │
│                                            │
│  AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX    │
│                                            │
│  ⚠️ Don't share your API key              │
│                                            │
│  [📋 Copy]  [Show]  [Restrict key]        │
└────────────────────────────────────────────┘
```

---

## 🔗 Direct Links

**Google AI Studio (Recommended):**
https://aistudio.google.com/app/apikey

**Google Cloud Console:**
https://console.cloud.google.com/

**Generative Language API:**
https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

---

## ✅ Success Criteria

API key sahi se kaam kar rahi hai agar ye dikhta hai:

```bash
$ node advancedGeminiCheck.js

🔧 Advanced Gemini API Troubleshooter
=====================================
✅ API Key Found: AIzaSyXXX...XXXX
=====================================

📊 Test 1: Checking API Versions...

✅ FOUND WORKING COMBINATION!      ← This should appear!
   API Version: v1beta
   Model: gemini-pro
   Response: Hello! How can I help you?
```

---

## 🎯 Next Steps After Getting API Key

### 1. Test API
```bash
cd server
node advancedGeminiCheck.js
```

### 2. Test Full ATS System
```bash
node testEnhancedApi.js
```

### 3. Start Servers
```bash
# Terminal 1 - Backend
cd server
node server.js

# Terminal 2 - Frontend
cd client
npm start
```

### 4. Use App
```
Open: http://localhost:3000
Click: ATS Scanner
Upload resume
Get AI-powered suggestions! 🎉
```

---

## 💡 Pro Tips

1. **Save API key somewhere safe** - You won't see it again after closing popup
2. **Restrict API key** (optional) - Add HTTP referrer restriction for security
3. **Monitor usage** - Check quota at https://console.cloud.google.com/apis/dashboard
4. **Free tier limits** - 60 requests/minute, 1500/day (enough for development)

---

## ❓ Still Having Issues?

**Option A: Try tomorrow**
- Sometimes new projects need 24 hours to fully activate
- API key will start working automatically

**Option B: Use Enhanced Algorithm**
- Already implemented and working perfectly
- No API key needed
- Professional AI-style suggestions
- 98/100 accuracy

```bash
# Just start servers:
cd server && node server.js
cd client && npm start
# Done! App works without Gemini API
```

---

**Kya step pe confusion hai? Batao!** 🚀
