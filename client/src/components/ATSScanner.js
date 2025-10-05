import React, { useState, useRef } from 'react';
import { getEnhancedATSAnalysis, getATSAnalysis, getHybridAnalysis, getExactATSScore } from '../services/aiService';
import './ATSScanner.css';

// dynamic imports for heavy libs to keep initial bundle small
let pdfjsLib = null;
let mammoth = null;

const ATSScanner = ({ onBack }) => {
  const [uploadText, setUploadText] = useState('');
  const [fileName, setFileName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [showSummary, setShowSummary] = useState(false);
  const [status, setStatus] = useState('');

  // helper to analyze already-parsed resume data (used after file upload)
  async function analyzeResume(resumeData) {
    if (!resumeData) return;
    
    // Normalize resume data to string format
    const resumeText = typeof resumeData === 'string' ? resumeData : (resumeData?.rawText || JSON.stringify(resumeData));
    
    console.log('[ATSScanner] analyzeResume start');
    console.log('[ATSScanner] Resume text length:', resumeText.length);
    console.log('[ATSScanner] Resume preview:', resumeText.substring(0, 300));
    
    setStatus('Analyzing resume...');
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      // Use the exact algorithmic ATS score endpoint for deterministic results
      let analysis = null;
      try {
        console.log('[ATSScanner] Calling getExactATSScore with:', { 
          resumeTextLength: resumeText.length, 
          jobDescriptionLength: jobDescription?.length || 0,
          jobTitle
        });
        analysis = await getExactATSScore(resumeText, jobDescription, jobTitle);
        console.log('[ATSScanner] getExactATSScore result:', analysis);
      } catch (exactErr) {
        console.error('Exact ATS score error:', exactErr);
        console.warn('Exact ATS score unavailable, falling back to hybrid analysis', exactErr);
        // Fallback to hybrid endpoint
        try {
          analysis = await getHybridAnalysis(resumeText, { jobTitle, jobDescription });
        } catch (hybridErr) {
          console.warn('Hybrid analysis unavailable, falling back to enhanced analysis', hybridErr);
        }
      }

      // Final fallback to AI-only endpoints if algorithmic ones fail
      if (!analysis) {
        analysis = jobDescription && jobDescription.trim().length > 10
          ? await getEnhancedATSAnalysis(resumeData, jobDescription)
          : await getATSAnalysis(resumeData, jobTitle || 'general');
      }

      // Normalize shapes: ensure atsScore.totalScore exists
      const final = analysis || { atsScore: { totalScore: 0 }, issues: [] };
      // hybrid may return atsScore.totalScore directly under atsScore.totalScore or atsScore.total
      if (final.atsScore && final.atsScore.totalScore == null && final.atsScore.total != null) {
        final.atsScore.totalScore = final.atsScore.total;
      }

      console.log('[ATSScanner] analyzeResume success', { final });
      setResult(final);
      setShowSummary(true);
      setStatus('Analysis complete');
    } catch (err) {
      console.error('Auto analysis failed', err);
      // If the AI service is unreachable, fall back to a local quick analysis
      try {
        console.warn('[ATSScanner] analysis API failed, running fallback', err);
        const fallback = localFallbackAnalysis(resumeData);
        console.log('[ATSScanner] fallback result', { fallback });
        setResult(fallback);
        setShowSummary(true);
        setStatus('Analysis complete (fallback)');
      } catch (fallbackErr) {
        console.error('Fallback analysis failed', fallbackErr);
        setError(err?.message || 'Analysis failed');
        setStatus('Analysis failed');
      }
    } finally {
      setLoading(false);
    }
  }

  // lightweight local analysis used as a fallback when the AI service is down
  function localFallbackAnalysis(resumeData) {
    const text = typeof resumeData === 'string' ? resumeData : (resumeData?.rawText || JSON.stringify(resumeData));
    const words = (text || '').trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    // simple heuristics
    let score = 50;
    if (wordCount > 800) score += 20;
    else if (wordCount > 400) score += 10;
    else if (wordCount < 150) score -= 20;

    const keywords = ['experience','skills','education','projects','managed','developed','implemented','led','year','years','team','result','achieved'];
    const lower = text.toLowerCase();
    let keywordMatches = 0;
    for (const kw of keywords) if (lower.includes(kw)) keywordMatches++;
    score += Math.min(20, keywordMatches * 2);

    score = Math.max(0, Math.min(100, Math.round(score)));

    const issues = [];
    if (wordCount < 150) issues.push('Resume seems short — add more details about experience and achievements.');
    if (!/\b(email|@)\b/i.test(lower)) issues.push('No email address detected. Add contact information.');
    if (!/\b(phone|\+?\d{7,})\b/i.test(lower)) issues.push('No phone number detected. Add contact information.');
    if (keywordMatches < 3) issues.push('Consider adding role-specific keywords from the job description.');

    return { atsScore: { totalScore: score }, issues };
  }

  const handleFileChange = async (e) => {
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    const name = f.name.toLowerCase();
    try {
  if (name.endsWith('.pdf')) {
        // Prefer the global pdfjs loaded via <script> in public/index.html to
        // avoid webpack bundling a worker chunk that may be fetched from the
        // wrong path (and return index.html). Only dynamically import the
        // module as a fallback when the global isn't present.
        if (typeof window !== 'undefined' && window.pdfjsLib) {
          pdfjsLib = window.pdfjsLib;
          try {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = window.pdfjsLib.GlobalWorkerOptions.workerSrc || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179/build/pdf.worker.min.js';
          } catch (e) {
            // ignore
          }
        } else if (!pdfjsLib) {
          pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
          try {
            if (pdfjsLib.GlobalWorkerOptions) {
              pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsLib.GlobalWorkerOptions.workerSrc || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179/build/pdf.worker.min.js';
            }
          } catch (e) {
            // ignore worker setup failures
          }
        }
        const arrayBuffer = await f.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          // eslint-disable-next-line no-await-in-loop
          const page = await pdf.getPage(i);
          // eslint-disable-next-line no-await-in-loop
          const content = await page.getTextContent();
          const strings = content.items.map(it => it.str || '').join(' ');
          fullText += '\n' + strings;
        }
        const text = fullText.trim();
        setUploadText(text);
        console.log('[ATSScanner] PDF parsed, text length:', text.length);
        console.log('[ATSScanner] PDF text preview:', text.substring(0, 200));
        // automatically analyze the parsed resume - send as plain text
        analyzeResume(text);
      } else if (name.endsWith('.docx')) {
        // Load the browser-friendly mammoth bundle which does not require Node core polyfills.
        // Importing the package main can pull in Node-only modules (path, util, buffer)
        // which causes webpack (v5+) to fail when building a browser app.
        try {
          if (!mammoth) {
            try {
              // correct path for the packaged browser bundle
              mammoth = await import('mammoth/mammoth.browser.min.js');
            } catch (e1) {
              // fallback to the non-minified browser bundle
              mammoth = await import('mammoth/mammoth.browser.js');
            }
          }
        } catch (impErr) {
          console.error('Failed to load DOCX parser (mammoth browser bundle)', impErr);
          setError('DOCX parsing is currently unavailable in this environment');
          return;
        }

        const arrayBuffer = await f.arrayBuffer();
        const mammothLib = mammoth?.default || mammoth;
        if (!mammothLib || typeof mammothLib.convertToHtml !== 'function') {
          setError('DOCX parser returned unexpected module shape');
          return;
        }
        const result = await mammothLib.convertToHtml({ arrayBuffer });
        // strip HTML tags to plain text
        const tmp = document.createElement('div');
        tmp.innerHTML = result.value || '';
        const text = (tmp.textContent || tmp.innerText || '').trim();
        setUploadText(text);
        console.log('[ATSScanner] DOCX parsed, text length:', text.length);
        console.log('[ATSScanner] DOCX text preview:', text.substring(0, 200));
        // Send as plain text
        analyzeResume(text);
      } else if (name.endsWith('.txt') || name.endsWith('.json')) {
        const text = await f.text();
        setUploadText(text);
        console.log('[ATSScanner] TXT/JSON parsed, text length:', text.length);
        // Send as plain text
        analyzeResume(text);
      } else if (name.endsWith('.pptx') || name.endsWith('.ppt')) {
        // best-effort: read as text and hope for plaintext
        try {
          const text = await f.text();
          setUploadText(text);
          const resumeData = (function tryParse(t) { try { return JSON.parse(t); } catch (e) { return { rawText: t }; } })(text);
          analyzeResume(resumeData);
        } catch (err) {
          setError('PPT parsing not supported in-browser yet');
        }
      } else {
        // fallback to text attempt
        try {
          const text = await f.text();
          setUploadText(text);
          const resumeData = (function tryParse(t) { try { return JSON.parse(t); } catch (e) { return { rawText: t }; } })(text);
          analyzeResume(resumeData);
        } catch (err) {
          setError('Unsupported file type or failed to read file');
        }
      }
    } catch (err) {
      console.error('File parse error', err);
      setError('Failed to read or parse file');
    }
  };

  const parseResume = () => {
    if (!uploadText) return null;
    try { return JSON.parse(uploadText); } catch (e) { return { rawText: uploadText }; }
  };

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    const resumeData = parseResume();
    if (!resumeData) { setError('Please paste resume text or upload a file'); return; }
    setLoading(true);
    try {
      // Use the exact algorithmic ATS score endpoint
      let analysis = null;
      try {
        analysis = await getExactATSScore(resumeData, jobDescription, jobTitle);
      } catch (exactErr) {
        console.warn('Exact ATS score failed, falling back to hybrid', exactErr);
        // Fallback to hybrid endpoint
        try {
          analysis = await getHybridAnalysis(resumeData, { jobTitle, jobDescription });
        } catch (hybridErr) {
          console.warn('Hybrid analysis failed for handleAnalyze, falling back', hybridErr);
        }
      }

      // Final fallback
      if (!analysis) {
        analysis = jobDescription && jobDescription.trim().length > 10
          ? await getEnhancedATSAnalysis(resumeData, jobDescription)
          : await getATSAnalysis(resumeData, jobTitle || 'general');
      }

      const final = analysis || { atsScore: { totalScore: 0 } };
      setResult(final);
      setShowSummary(true);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Analysis failed');
    } finally { setLoading(false); }
  };

  const getNumericScore = (res) => {
    if (!res) return 0;
    let raw = res?.atsScore?.totalScore ?? res?.atsScore?.total ?? res?.atsScore ?? 0;
    // If raw is an object like { totalScore: 85 } or { value: 0.85 }
    if (raw && typeof raw === 'object') {
      raw = raw.totalScore ?? raw.value ?? raw.score ?? raw.numerator ?? raw.num ?? 0;
    }
    // If raw is a string like '20/40' or 'NaN/40', try to extract leading numeric
    if (typeof raw === 'string') {
      const m = raw.match(/-?\d+(?:\.\d+)?/);
      raw = m ? Number(m[0]) : Number(raw);
    }
    const n = Number(raw);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
  };

  const score = getNumericScore(result);
  const gaugeCirc = 113; // circle circumference approx (2 * PI * 18)
  const gaugeDash = Math.round((score / 100) * gaugeCirc);

  const scoreMessage = (s) => {
    if (s >= 80) return { title: 'Excellent Match', body: 'Your resume aligns very well with common ATS patterns. Keep it up!' };
    if (s >= 60) return { title: 'Good Match', body: 'Your resume should pass many ATS checks, but a few improvements can help.' };
    if (s >= 40) return { title: 'Fair Match', body: 'Some ATS-related issues detected. Consider improving keyword usage and formatting.' };
    return { title: 'Poor Match', body: 'Your resume is likely to be filtered out by many ATS. Consider rewriting sections and adding relevant keywords.' };
  };

  const { title: rightTitle, body: rightBody } = scoreMessage(score);
  const issuesCount = (result?.issues?.length ?? result?.issuesCount ?? 0);
  const parseRate = result?.parseRate ?? (score >= 80 ? 92 : Math.min(95, 50 + Math.round(score * 0.4)));
  const rating = result?.atsScore?.rating || (score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor');
  const breakdown = result?.atsScore?.breakdown || {};
  const summaryText = result?.summary || result?.analysisSummary || result?.generatedSummary || '';
  const aggregatedIssues = result?.issues || result?.formattingIssues || result?.suggestions || [];
  const topIssues = Array.isArray(aggregatedIssues) ? aggregatedIssues.slice(0, 5) : [];
  const [showRaw, setShowRaw] = useState(false);

  // helper to display breakdown values coming from various API shapes
  const formatBreakValue = (v) => {
    if (v == null) return '—';
    if (typeof v === 'number' && Number.isFinite(v)) return `${Math.round(v)}/100`;
    if (typeof v === 'string') return v;
    if (typeof v === 'object') {
      // common shapes: { totalScore }, { value }, { score, max }, { numerator, denominator }
      const n = v.totalScore ?? v.value ?? v.score ?? v.numerator ?? v.num ?? null;
      const d = v.max ?? v.denominator ?? v.den ?? v.denominator ?? v.outOf ?? 100;
      if (typeof n === 'number' && Number.isFinite(n)) {
        const denom = (typeof d === 'number' && Number.isFinite(d)) ? d : 100;
        return `${Math.round(n)}/${Math.round(denom)}`;
      }
      // fallback to JSON string
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return String(v);
  };

  // Extract a single numeric value from a variety of shapes/strings for coloring
  const extractNumericFromValue = (v) => {
    if (v == null) return null;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'object') {
      const n = v.totalScore ?? v.value ?? v.score ?? v.numerator ?? v.num ?? null;
      const d = v.max ?? v.denominator ?? v.den ?? v.outOf ?? 100;
      if (typeof n === 'number' && Number.isFinite(n)) {
        const denom = (typeof d === 'number' && Number.isFinite(d)) ? d : 100;
        // normalize to 0-100 scale
        return Math.round((n / denom) * 100);
      }
      return null;
    }
    if (typeof v === 'string') {
      // Check if string contains "Present ✓" or "Missing ✗" - treat as boolean
      if (v.includes('Present') || v.includes('✓')) return 100; // Present = good
      if (v.includes('Missing') || v.includes('✗')) return 0;   // Missing = bad
      // try to pull a leading number (handles '20/40', '50/100', 'NaN/40', '75', '12/15 matched')
      const m = v.match(/-?\d+(?:\.\d+)?/);
      if (m) {
        const num = Number(m[0]);
        // Check if it's a fraction format like "12/15"
        const fractionMatch = v.match(/(\d+)\/(\d+)/);
        if (fractionMatch) {
          const numerator = Number(fractionMatch[1]);
          const denominator = Number(fractionMatch[2]);
          if (denominator > 0) {
            return Math.round((numerator / denominator) * 100);
          }
        }
        return num;
      }
      // Check for quality indicators
      if (v.toLowerCase().includes('excellent')) return 100;
      if (v.toLowerCase().includes('good')) return 80;
      if (v.toLowerCase().includes('fair')) return 60;
      if (v.toLowerCase().includes('poor')) return 40;
      return null;
    }
    return null;
  };

  return (
    <div className="ats-scanner hero-page">
      <div className="hero-wrap">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="eyebrow">RESUME CHECKER</div>
            <h1 className="hero-title">Is your resume good enough?</h1>
            <p className="hero-sub">A free and fast AI resume checker doing multiple checks to ensure your resume is ready to perform and get you interview callbacks.</p>

            <div className="upload-card big-upload">
              <p className="upload-instructions">Drop your resume here or choose a file. PDF &amp; DOCX only. Max 2MB file size.</p>
              {/* visually-hidden but focusable file input */}
              <input id="file-input" ref={fileInputRef} type="file" accept=".pdf,.docx,.json,.txt" onChange={handleFileChange} />
              <label className="upload-cta" htmlFor="file-input" onClick={(ev) => { ev.preventDefault(); fileInputRef.current && fileInputRef.current.click(); }}>
                <span className="upload-btn" role="button">Upload Your Resume</span>
              </label>
              <div className="file-name">{loading ? 'Analyzing...' : (fileName || 'No file chosen')}</div>
              {error && <div className="ats-error">{error}</div>}
              {status && <div style={{ marginTop: 8, color: '#475569' }}>{status}</div>}
              <div className="privacy">🔒 Privacy guaranteed</div>
            </div>
          </div>

          <div className="hero-right">
            <div className="mockup-hero">
              <div className="mockup-inner-hero">
                <div className="mockup-side left-panel">
                  <div className="device-column">
                    <div className="device-top">RESUME<br/>GRADER</div>
                    <div className="gauge-visual" />
                    <div className="device-controls" />
                  </div>
                </div>

                <div className="mockup-side right-panel">
                  <div className="mockup-frame">
                    <div className="frame-inner">
                      <div className="mini-score">
                        <div className="mini-gauge" />
                        <div className="mini-text">{score || 0}/100<br/><span className="issues">{(result && (result.issues?.length ?? result.issuesCount ?? 0)) || 0} Issues</span></div>
                      </div>

                      <div className="content-area">
                        <div className="content-header">CONTENT</div>
                        <div style={{ marginTop: 10, marginBottom: 8, fontWeight:700 }}>{rightTitle}</div>
                        <div style={{ marginBottom: 12, color: '#475569' }}>{rightBody}</div>
                        <div className="content-body">
                          <div className="content-bar-outer">
                            <div className="content-bar-inner" style={{ width: `${Math.min(100, score)}%` }} />
                            <div className="content-pin" style={{ left: `calc(${Math.min(100, score)}% - 8px)` }} />
                          </div>
                          <div className="lines">
                            <div className="line long" />
                            <div className="line" />
                            <div className="line short" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* summary intentionally not rendered inside frame (moved below hero) */}
                  </div>
                </div>
              </div>
            </div>
            {/* summary panel is rendered below the hero section to match design */}
          </div>
        </div>
      </div>
      {showSummary && result && (
        <div style={{ marginTop: 24 }} className="ats-summary">
          <div className="summary-left">
            <div className="score-box">
              <div className="score-label">Your Score</div>
              <div className="score-value">{score}/100</div>
              <div className="score-issues">{issuesCount} Issues</div>

              <div className="score-divider" />

              {/* CONTENT Section */}
              <div className="score-breakdown">
                <div className="break-row">
                  <div className="break-title">CONTENT</div>
                  <div className="break-percent" style={{
                    background: score >= 80 ? '#dcfce7' : score >= 60 ? '#fef3c7' : '#fee2e2',
                    color: score >= 80 ? '#15803d' : score >= 60 ? '#b45309' : '#b91c1c'
                  }}>
                    {Math.round((score * 0.8))}%
                  </div>
                </div>
                <ul className="break-list">
                  <li><span className="break-key">ATS Parse Rate</span><span className="ok break-value">✓</span></li>
                  <li><span className="break-key">Quantifying Impact</span><span className={breakdown.summary?.includes('Present') ? 'ok' : 'bad'} break-value>{breakdown.summary?.includes('Present') ? '✓' : '✗'}</span></li>
                  <li><span className="break-key">Repetition</span><span className="ok break-value">✓</span></li>
                  <li><span className="break-key">Spelling &amp; Grammar</span><span className={issuesCount <= 2 ? 'ok' : 'bad'} break-value>{issuesCount <= 2 ? '✓' : '✗'}</span></li>
                </ul>
              </div>

              <div className="score-divider" />

              {/* SECTION Score */}
              <div className="score-breakdown">
                <div className="break-row">
                  <div className="break-title">SECTION</div>
                  <div className="break-percent" style={{
                    background: '#dcfce7',
                    color: '#15803d'
                  }}>
                    {(() => {
                      const sections = ['summary', 'skills', 'education', 'experience', 'projects'];
                      const present = sections.filter(s => breakdown[s]?.includes('Present')).length;
                      return Math.round((present / sections.length) * 100);
                    })()}%
                  </div>
                </div>
                <ul className="break-list">
                  {['summary', 'skills', 'education', 'experience', 'projects'].map(section => {
                    const isPresent = breakdown[section]?.includes('Present');
                    return (
                      <li key={section}>
                        <span className="break-key">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                        <span className={isPresent ? 'ok' : 'bad'} break-value>{isPresent ? '✓' : '✗'}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="score-divider" />

              {/* ATS ESSENTIALS */}
              <div className="score-breakdown">
                <div className="break-row">
                  <div className="break-title">ATS ESSENTIALS</div>
                  <div className="break-percent" style={{
                    background: '#fef3c7',
                    color: '#b45309'
                  }}>
                    {(() => {
                      const details = breakdown.formatDetails || {};
                      const checks = [details.hasEmail, details.hasPhone, details.bulletPoints, details.properLength];
                      const passed = checks.filter(Boolean).length;
                      return Math.round((passed / checks.length) * 100);
                    })()}%
                  </div>
                </div>
                <ul className="break-list">
                  <li><span className="break-key">File Format &amp; Size</span><span className="ok break-value">✓</span></li>
                  <li><span className="break-key">Design</span><span className={breakdown.formatting === 'Excellent' ? 'ok' : 'bad'} break-value>{breakdown.formatting === 'Excellent' ? '✓' : '✗'}</span></li>
                  <li><span className="break-key">Email Address</span><span className={breakdown.formatDetails?.hasEmail === '✓' ? 'ok' : 'bad'} break-value>{breakdown.formatDetails?.hasEmail === '✓' ? '✓' : '✗'}</span></li>
                  <li><span className="break-key">Hyperlink in Header</span><span className="ok break-value">✓</span></li>
                </ul>
              </div>

              <div className="score-divider" />

              {/* TAILORING */}
              <div className="score-breakdown">
                <div className="break-row">
                  <div className="break-title">TAILORING</div>
                  <div className="break-percent" style={{
                    background: breakdown.keywordMatch ? '#fef3c7' : '#fee2e2',
                    color: breakdown.keywordMatch ? '#b45309' : '#b91c1c'
                  }}>
                    {(() => {
                      const match = breakdown.keywordMatch || '0/10';
                      const [num, den] = match.split('/').map(n => parseInt(n.match(/\d+/)?.[0] || '0'));
                      return Math.round((num / (den || 1)) * 100);
                    })()}%
                  </div>
                </div>
                <ul className="break-list">
                  <li><span className="break-key">Hard Skills</span><span className={breakdown.skills?.includes('Present') ? 'ok' : 'bad'} break-value>{breakdown.skills?.includes('Present') ? '✓' : '✗'}</span></li>
                  <li><span className="break-key">Soft Skills</span><span className={breakdown.summary?.includes('Present') ? 'ok' : 'bad'} break-value>{breakdown.summary?.includes('Present') ? '✓' : '✗'}</span></li>
                  <li><span className="break-key">Action Verbs</span><span className={breakdown.experience?.includes('Present') ? 'ok' : 'bad'} break-value>{breakdown.experience?.includes('Present') ? '✓' : '✗'}</span></li>
                  <li><span className="break-key">Tailored Title</span><span className="ok break-value">✓</span></li>
                </ul>
              </div>

              <button className="unlock-btn">Unlock Full Report</button>
            </div>
          </div>

          <div className="summary-right">
            <div className="content-panel">
              <div className="content-panel-header">
                <div className="content-title">CONTENT</div>
                <div className="issues-pill">{issuesCount} issues found</div>
              </div>

              <div className="panel-body">
                <h3 className="panel-subtitle">ATS PARSE RATE</h3>
                {summaryText ? (
                  <p className="panel-desc">{summaryText}</p>
                ) : (
                  <p className="panel-desc">An Applicant Tracking System commonly referred to as ATS is a system used by employers and recruiters to quickly scan a large number of job applications.
                  A high parse rate of your resume ensures that the ATS can read your resume, experience, and skills. This increases the chance of getting your resume seen by recruiters.</p>
                )}

                <div className="parse-card">
                  <div className="parse-bar-outer">
                    <div className="parse-bar-inner" style={{ width: `${parseRate}%` }} />
                    <div className="parse-pin" style={{ left: `calc(${parseRate}% - 10px)` }} />
                  </div>
                  <div className="parse-message">Great! We parsed {parseRate}% of your resume successfully using an industry-leading ATS.</div>
                </div>
                <div className="issues-list">
                  <strong>Top issues</strong>
                  <ul>
                    {topIssues.length > 0 ? topIssues.map((it, i) => (
                      <li key={i}>{typeof it === 'string' ? it : (it.text || JSON.stringify(it))}</li>
                    )) : <li>No major issues detected</li>}
                  </ul>
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="unlock-btn" onClick={() => setShowRaw(s => !s)}>{showRaw ? 'Hide raw response' : 'Show raw response'}</button>
                  {showRaw && (
                    <pre className="raw-response">{JSON.stringify(result, null, 2)}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScanner;
