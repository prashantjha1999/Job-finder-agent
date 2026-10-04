import React from 'react';
import {
  Compass,
  Moon,
  Sun,
  Download,
  Copy,
  Trash2,
  Search,
  Check,
  Sparkles,
} from 'lucide-react';
import { FullAnalysisResult } from '../types.ts';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  result: FullAnalysisResult | null;
  onReset: () => void;
  onClearData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  result,
  onReset,
  onClearData,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!result) return;
    const { profile, analysis, jobs } = result;

    const text = `
=== PROFILESCOUT REPORT ===
Candidate: ${profile.name}
Headline: ${profile.headline}
Location: ${profile.location}
Seniority: ${analysis.seniority_level} | Domain: ${analysis.primary_domain}
Total Experience: ${profile.total_years_experience} years

--- PROFESSIONAL SUMMARY ---
${analysis.professional_summary}

--- KEY STRENGTHS ---
${analysis.strengths.map((s) => `• ${s}`).join('\n')}

--- TARGET TITLES ---
${analysis.target_job_titles.join(', ')}

--- TOP 10 MATCHED JOBS ---
${jobs
  .map(
    (j, i) =>
      `${i + 1}. ${j.title} @ ${j.company} [${j.match_score}% Match]
   Location: ${j.location} ${j.remote ? '(Remote)' : ''}
   Source: ${j.source} | Posted: ${j.posted_date}
   Apply: ${j.apply_url}
   Fit: ${j.match_reason}`
  )
  .join('\n\n')}

Note: Verify postings are still open on the employer's site.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedName = (result.profile.name || 'candidate')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    a.download = `profilescout-${sanitizedName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Profile<span className="text-blue-600 dark:text-blue-400">Scout</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                AI Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              LinkedIn & Career Opportunity Scout
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {result && (
            <>
              <button
                onClick={onReset}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Start a new search"
              >
                <Search className="w-3.5 h-3.5" />
                <span>New Scout</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Copy full report as text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="hidden md:inline">Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Export as typed JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="hidden md:inline">Export JSON</span>
              </button>

              <button
                onClick={onClearData}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
                title="Clear cached data"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Clear Data</span>
              </button>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
