# 🎯 Resumate ATS Scanner - Testing Guide

## ⚠️ IMPORTANT: Aap Wrong Website Use Kar Rahe The!

**Problem:** Aap Enhancv website (app.enhancv.com) use kar rahe the, jo ek external third-party service hai.

**Solution:** Aapko **apna local Resumate app** use karna hai!

---

## ✅ Correct Testing Steps:

### Step 1: Backend Start Karo

```bash
# Terminal 1
cd c:\Users\dell\OneDrive\Desktop\Resumate\server
node server.js
```

**Expected Output:**
```
Server running on port 5000
```

---

### Step 2: Frontend Start Karo

```bash
# Terminal 2 (New Terminal)
cd c:\Users\dell\OneDrive\Desktop\Resumate\client
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view resumate-client in the browser.
Local: http://localhost:3000
```

---

### Step 3: Browser Me Open Karo

**URL:** `http://localhost:3000`

---

### Step 4: ATS Scanner Page Pe Jao

1. **Top Navigation Bar** me "🔎 ATS Scan" button dikhega
2. Us button pe **click** karo
3. ATS Scanner page open hoga

---

### Step 5: Resume Upload Karo

1. **"Upload Your Resume"** button pe click karo
2. Apna PDF/DOCX resume select karo
3. Wait karo analysis ke liye (2-5 seconds)

---

## 📊 Expected Results:

### Good Resume (80-100/100):
```
Your Score: 92/100
Rating: Excellent
2 Issues

Breakdown:
✓ Summary: Present ✓
✓ Skills: Present ✓
✓ Education: Present ✓
✓ Experience: Present ✓
✓ Projects: Present ✓
✓ Keyword Match: 12/15 matched
✓ Formatting: Excellent

Issues Found:
1. Add more quantifiable metrics
2. Missing keyword: Kubernetes
```

### Poor Resume (10-30/100):
```
Your Score: 20/100
Rating: Poor
8 Issues

Breakdown:
✗ Summary: Missing ✗
✗ Skills: Missing ✗
✗ Education: Missing ✗
✗ Experience: Missing ✗
✓ Formatting: 20/20

Issues Found:
1. Missing summary section
2. Missing skills section
3. No keywords matched
... etc
```

---

## 🔍 Troubleshooting:

### Issue 1: Server Not Starting (Port 5000 in Use)

**Solution 1:** Kill process on port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Solution 2:** Change port in server.js
```javascript
const port = process.env.PORT || 5001; // Use different port
```

---

### Issue 2: Frontend Not Loading

**Solution:**
```bash
cd client
rm -rf node_modules
npm install
npm start
```

---

### Issue 3: Score Still Showing 20/100

**Check Console Logs:**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs like:
   ```
   [ATSScanner] analyzeResume start
   [ATSScanner] API Response: {...}
   [ATSScanner] Parsed Score: 92
   ```

4. Go to Network tab
5. Filter for "exact-ats-score"
6. Check response

---

### Issue 4: API Error (500/404)

**Check Backend Logs:**

Terminal me error message dekhega:
```
Error in exact ATS score calculation: ...
```

**Solution:**
1. Check if atsAnalyzer.js file exists in `server/services/`
2. Restart server
3. Check .env file has GEMINI_API_KEY

---

## 🧪 Quick Test (Without Frontend):

### Test Backend API Directly:

1. Open `server/test-ats-api.html` in browser
2. Paste resume text
3. Click "Test ATS Score API"
4. Check if score is correct

**OR**

Run test script:
```bash
cd server
node testAtsAnalyzer.js
```

Expected Output:
```
Test 1: Basic ATS Score
Score: 98/100
Rating: Excellent
```

---

## 📸 How Your App Should Look:

### ATS Scanner Page Layout:

```
┌─────────────────────────────────────────────────────┐
│  Navigation: Home | Form | Templates | 🔎 ATS Scan  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  RESUME CHECKER                                     │
│  Is your resume good enough?                        │
│                                                     │
│  ┌───────────────────────────────────────────┐     │
│  │  Drop your resume here or choose a file   │     │
│  │  PDF & DOCX only. Max 2MB file size.      │     │
│  │                                            │     │
│  │  [Upload Your Resume]                      │     │
│  │                                            │     │
│  │  No file chosen                            │     │
│  │  🔒 Privacy guaranteed                     │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘

After Upload:
┌─────────────────────────────────────────────────────┐
│  Your Score                    CONTENT              │
│  92/100                        2 issues found       │
│  2 Issues                                          │
│                                ATS PARSE RATE       │
│  CONTENT                       ──────────────       │
│  ✓ Summary: Present ✓          Great! We parsed    │
│  ✓ Skills: Present ✓           92% of your resume  │
│  ✓ Education: Present ✓                            │
│  ✓ Experience: Present ✓       Top issues          │
│  ✓ Projects: Present ✓         • Add metrics       │
│  ✓ Keywords: 12/15 matched     • Missing: Docker   │
│  ✓ Formatting: Excellent                           │
│                                                     │
│  [Unlock Full Report]          [Show raw response] │
└─────────────────────────────────────────────────────┘
```

---

## 🎬 Video Guide (Steps):

1. **Open Terminal 1** → `cd server` → `node server.js`
2. **Open Terminal 2** → `cd client` → `npm start`
3. **Browser opens** → `http://localhost:3000`
4. **Click** "🔎 ATS Scan" in navigation
5. **Click** "Upload Your Resume"
6. **Select** your PDF/DOCX file
7. **Wait** 2-5 seconds
8. **See** results with score 80-100/100 (for good resume)

---

## ✅ Verification Checklist:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Opened `http://localhost:3000` (NOT enhancv.com!)
- [ ] Clicked "ATS Scan" button in navigation
- [ ] Uploaded resume file
- [ ] Score showing 80-100 for good resume
- [ ] Breakdown showing all sections
- [ ] Issues list populated
- [ ] No console errors

---

## 🚫 Common Mistakes:

1. ❌ Using Enhancv website instead of local app
2. ❌ Not starting backend server
3. ❌ Not starting frontend server
4. ❌ Opening wrong URL (should be localhost:3000)
5. ❌ Not clicking "ATS Scan" button
6. ❌ Browser cache not cleared (Ctrl+Shift+R)

---

## 📞 If Still Not Working:

**Send me:**
1. Screenshot of `http://localhost:3000` (your local app)
2. Browser console logs (F12 → Console tab)
3. Terminal output (both backend and frontend)
4. Response from Network tab (F12 → Network → exact-ats-score)

**Then I can help debug the actual issue!**

---

## 💡 Pro Tip:

**Test with this sample resume text:**
```
John Doe
Email: john@example.com
Phone: +1234567890

SUMMARY
Experienced Full Stack Developer with 5 years expertise.

SKILLS
JavaScript, React, Node.js, MongoDB, SQL, AWS, Docker

EXPERIENCE
Senior Developer at Tech Corp (2020-2024)
• Built scalable web applications
• Led team of 5 developers
• Reduced costs by 40%

EDUCATION
BS Computer Science, MIT (2015-2019)

PROJECTS
• E-commerce Platform using MERN stack
• Real-time Chat Application
```

**Expected Score:** 90-100/100

---

**Date:** October 4, 2025  
**Status:** Ready for Testing  
**Remember:** Use `http://localhost:3000`, NOT enhancv.com! 🎯
