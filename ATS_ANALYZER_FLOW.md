# ATS Analyzer - How It Works

## 🔄 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER UPLOADS RESUME                      │
│                     (PDF, DOCX, TXT, JSON)                       │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ATSScanner Component                                     │   │
│  │  • Parses PDF/DOCX to text                               │   │
│  │  • Calls getExactATSScore()                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ POST /api/ai/exact-ats-score
                               │ { resumeData, jobDescription }
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Route: /exact-ats-score                             │   │
│  │  • Receives resume data                                   │   │
│  │  • Extracts keywords from job description                 │   │
│  └─────────────┬────────────────────────────────────────────┘   │
│                │                                                 │
│                ▼                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ATS Analyzer Service (atsAnalyzer.js)                   │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  1. SECTION CHECK (50 points)                      │  │   │
│  │  │     ✓ Summary     (10 pts)                         │  │   │
│  │  │     ✓ Skills      (10 pts)                         │  │   │
│  │  │     ✓ Education   (10 pts)                         │  │   │
│  │  │     ✓ Experience  (10 pts)                         │  │   │
│  │  │     ✓ Projects    (10 pts)                         │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  2. KEYWORD MATCH (40 points)                      │  │   │
│  │  │     • Extract from job description                 │  │   │
│  │  │     • Match against resume                         │  │   │
│  │  │     • Calculate percentage                         │  │   │
│  │  │     Example: 12/15 = 32 points                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  3. FORMATTING CHECK (10 points)                   │  │   │
│  │  │     ✓ Bullet points    (2 pts)                     │  │   │
│  │  │     ✓ Proper length    (2 pts)                     │  │   │
│  │  │     ✓ Has numbers      (2 pts)                     │  │   │
│  │  │     ✓ Email present    (2 pts)                     │  │   │
│  │  │     ✓ Phone present    (2 pts)                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  Returns: { total: 92, rating: "Excellent",              │   │
│  │            breakdown: {...}, issues: [...] }              │   │
│  └─────────────┬──────────────────────────────────────────────┘│
│                │                                                 │
│                ▼                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Gemini AI Service (Optional)                            │   │
│  │  • Gets improvement suggestions                           │   │
│  │  • Identifies missing keywords                            │   │
│  │  • Recommends action verbs                                │   │
│  │  • Provides content improvements                          │   │
│  └─────────────┬────────────────────────────────────────────┘   │
└────────────────┼────────────────────────────────────────────────┘
                 │
                 │ Returns combined result
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE TO FRONTEND                          │
│  {                                                               │
│    success: true,                                                │
│    data: {                                                       │
│      atsScore: {                                                 │
│        totalScore: 92,                                           │
│        rating: "Excellent",                                      │
│        breakdown: {                                              │
│          summary: "Present ✓",                                   │
│          skills: "Present ✓",                                    │
│          keywordMatch: "12/15 matched",                          │
│          formatting: "Excellent"                                 │
│        }                                                         │
│      },                                                          │
│      parseRate: 95,                                              │
│      issues: ["Add more metrics", "Missing: DevOps"],           │
│      geminiSuggestions: "Add action verbs..."                   │
│    }                                                             │
│  }                                                               │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND DISPLAY                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ┌─────────────────────┐  ┌──────────────────────────┐  │   │
│  │  │  ATS SCORE          │  │  BREAKDOWN               │  │   │
│  │  │  ██████████░░ 92/100│  │  ✓ Summary               │  │   │
│  │  │  Excellent          │  │  ✓ Skills                │  │   │
│  │  │                     │  │  ✓ Education             │  │   │
│  │  │  2 Issues Found     │  │  ✓ Experience            │  │   │
│  │  └─────────────────────┘  │  ✓ Projects              │  │   │
│  │                            │  Keywords: 12/15         │  │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  AI SUGGESTIONS                                   │  │   │
│  │  │  • Add keywords: DevOps, CI/CD                    │  │   │
│  │  │  • Use action verbs: Architected, Led            │  │   │
│  │  │  • Quantify achievements with metrics            │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  ISSUES FOUND                                     │  │   │
│  │  │  1. Add more quantifiable metrics                │  │   │
│  │  │  2. Missing keywords: DevOps, Testing            │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Scoring Algorithm Details

### Total Score = Section Score + Keyword Score + Format Score

#### 1. Section Score (0-50 points)
```
For each section in ["summary", "skills", "education", "experience", "projects"]:
  If section found in resume:
    score += 10 points
  Else:
    score += 0 points
```

**Example:**
- Summary: ✓ (10 points)
- Skills: ✓ (10 points)
- Education: ✓ (10 points)
- Experience: ✓ (10 points)
- Projects: ✗ (0 points)
- **Total: 40 points**

---

#### 2. Keyword Score (0-40 points)
```
matched_keywords = count of JD keywords found in resume
total_keywords = total JD keywords
score = (matched_keywords / total_keywords) * 40
```

**Example:**
- Job Description Keywords: 15
- Matched in Resume: 12
- Score: (12/15) * 40 = 32 points

---

#### 3. Format Score (0-10 points)
```
Bullet Points Present: +2 points
Proper Length (500-2000 words): +2 points
Has Numbers/Metrics: +2 points
Email Present: +2 points
Phone Present: +2 points
```

**Example:**
- Bullet Points: ✓ (2 points)
- Proper Length: ✓ (2 points)
- Has Metrics: ✓ (2 points)
- Email: ✓ (2 points)
- Phone: ✓ (2 points)
- **Total: 10 points**

---

### Final Score Example:
```
Section Score:  40 points
Keyword Score:  32 points
Format Score:   10 points
─────────────────────────
TOTAL SCORE:    82/100
RATING:         Excellent
```

---

## 🎯 Rating System

| Score Range | Rating      | Description                        |
|-------------|-------------|------------------------------------|
| 80-100      | Excellent   | Great match, likely to pass ATS    |
| 60-79       | Good        | Should pass most ATS systems       |
| 40-59       | Fair        | Needs improvement                  |
| 0-39        | Poor        | Likely to be filtered out          |

---

## 🔍 Keyword Extraction from Job Description

The system automatically extracts technical keywords from job descriptions:

**Input:**
```
We need a Full Stack Developer with:
- React, Node.js, Express
- MongoDB, SQL
- Docker, Kubernetes
- REST API development
```

**Extracted Keywords:**
```javascript
["react", "node", "express", "mongodb", "sql", "docker", 
 "kubernetes", "rest", "api"]
```

These keywords are then matched against the resume to calculate the keyword score.

---

## ⚠️ Common Issues Detected

1. **Missing Sections**
   - "Missing experience section. Add your work history."
   
2. **Low Keyword Match**
   - "Only 4/15 keywords matched. Add relevant keywords."
   
3. **Formatting Problems**
   - "No bullet points detected. Use bullets for readability."
   - "Resume is too short. Add more details."
   
4. **Missing Contact Info**
   - "No email address detected."
   - "No phone number detected."
   
5. **Lack of Metrics**
   - "Add quantifiable achievements (%, numbers, metrics)."

---

## 🤖 Gemini AI Integration

While the algorithm provides the **exact score**, Gemini AI enhances the analysis with:

1. **Context-Aware Suggestions**
   - Understands the job description context
   - Provides role-specific recommendations

2. **Missing Keywords**
   - Identifies important keywords not in resume
   - Suggests industry-standard terms

3. **Content Improvements**
   - Rewrites summary for impact
   - Suggests stronger action verbs
   - Recommends quantifiable achievements

4. **Formatting Tips**
   - Structure improvements
   - Section organization
   - Layout optimization

---

## 🚀 Performance

- **Algorithm Speed**: < 50ms
- **Gemini API**: ~1-3 seconds
- **Total Time**: ~1-3 seconds (mostly Gemini)
- **Accuracy**: Deterministic (same input = same score)

---

## 🔧 Customization Options

### 1. Change Default Keywords
Edit `server/services/atsAnalyzer.js`:
```javascript
const DEFAULT_JD_KEYWORDS = [
  'Your', 'Custom', 'Keywords', 'Here'
];
```

### 2. Adjust Scoring Weights
```javascript
// Current weights:
sections.forEach(sec => {
  if (found) score += 10;  // Change this value
});

const keywordScore = (foundKeywords.length / total) * 40;  // Or this
```

### 3. Add New Checks
```javascript
// In calculateATSScore function:
if (text.includes('your_custom_check')) {
  score += 5;
  breakdown['customCheck'] = 'Present ✓';
}
```

---

**Made with ❤️ for Resumate**
**Date:** October 4, 2025
