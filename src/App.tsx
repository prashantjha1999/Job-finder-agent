/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { LandingHero } from './components/LandingHero.tsx';
import { LoadingProgress } from './components/LoadingProgress.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { JobsView } from './components/JobsView.tsx';
import { ResumeModal } from './components/ResumeModal.tsx';
import {
  FullAnalysisResult,
  ProfileData,
  CareerAnalysis,
  JobItem,
  GroundingSource,
} from './types.ts';
import {
  AlertCircle,
  Briefcase,
  User,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const STORAGE_CACHE_KEY = 'profilescout_cache';
const STORAGE_RECENTS_KEY = 'profilescout_recents';
const STORAGE_THEME_KEY = 'profilescout_theme';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [result, setResult] = useState<FullAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'jobs'>('profile');
  const [loadingStep, setLoadingStep] = useState<
    'idle' | 'reading' | 'analyzing' | 'searching' | 'ranking'
  >('idle');
  const [targetQuery, setTargetQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [partialProfile, setPartialProfile] = useState<{
    profile: ProfileData;
    analysis?: CareerAnalysis;
  } | null>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_RECENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [refreshingJobs, setRefreshingJobs] = useState(false);
  const [isAugmentModalOpen, setIsAugmentModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_THEME_KEY, 'light');
    }
  }, [darkMode]);

  // Load cached search on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.profile && parsed?.jobs) {
          setResult(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load cache:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveRecentSearch = (query: string) => {
    if (!query) return;
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((item) => item !== query)].slice(0, 8);
      try {
        localStorage.setItem(STORAGE_RECENTS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }
      return updated;
    });
  };

  // Pipeline Executor
  const runPipeline = async (input: {
    urlOrUsername?: string;
    pastedText?: string;
    fileData?: { base64: string; mimeType: string; filename: string };
  }) => {
    setError(null);
    setPartialProfile(null);
    const displayQuery =
      input.urlOrUsername ||
      (input.fileData ? input.fileData.filename : 'Pasted Profile Text');
    setTargetQuery(displayQuery);
    if (input.urlOrUsername) {
      saveRecentSearch(input.urlOrUsername);
    }

    try {
      // Step 1: Read & Extract Profile
      setLoadingStep('reading');
      const extractRes = await fetch('/api/profile/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!extractRes.ok) {
        const errData = await extractRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to extract profile information.');
      }

      const { profile }: { profile: ProfileData } = await extractRes.json();
      setPartialProfile({ profile });

      // Step 2: Analyze Career Intelligence
      setLoadingStep('analyzing');
      const analyzeRes = await fetch('/api/profile/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze career background.');
      }

      const { analysis }: { analysis: CareerAnalysis } = await analyzeRes.json();
      setPartialProfile({ profile, analysis });

      // Step 3: Search active jobs
      setLoadingStep('searching');
      const jobsRes = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, analysis }),
      });

      setLoadingStep('ranking');
      let jobs: JobItem[] = [];
      let searchGroundingSources: GroundingSource[] = [];

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        jobs = jobsData.jobs || [];
        searchGroundingSources = jobsData.grounding_sources || [];
      } else {
        console.warn('Jobs search encountered an error, will present partial profile results');
      }

      const fullResult: FullAnalysisResult = {
        profile,
        analysis,
        jobs,
        search_grounding_sources: searchGroundingSources,
        timestamp: Date.now(),
      };

      setResult(fullResult);
      setLoadingStep('idle');
      setPartialProfile(null);

      // Save in localStorage cache
      try {
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(fullResult));
      } catch (err) {
        console.warn('Unable to cache results in localStorage:', err);
      }
    } catch (err: any) {
      console.error('Error running scout pipeline:', err);
      setError(err.message || 'An error occurred during scouting.');
      setLoadingStep('idle');
    }
  };

  // Refresh Jobs Only
  const handleRefreshJobs = async () => {
    if (!result) return;
    setRefreshingJobs(true);
    try {
      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: result.profile,
          analysis: result.analysis,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to refresh open jobs.');
      }

      const data = await res.json();
      const updated: FullAnalysisResult = {
        ...result,
        jobs: data.jobs || [],
        search_grounding_sources: data.grounding_sources || [],
        timestamp: Date.now(),
      };

      setResult(updated);
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(updated));
      showToast('Refreshed active job matches!');
    } catch (err: any) {
      console.error('Error refreshing jobs:', err);
      showToast(`Refresh failed: ${err.message}`);
    } finally {
      setRefreshingJobs(false);
    }
  };

  // Clear Cached Data
  const handleClearData = () => {
    localStorage.removeItem(STORAGE_CACHE_KEY);
    localStorage.removeItem(STORAGE_RECENTS_KEY);
    setResult(null);
    setPartialProfile(null);
    setRecentSearches([]);
    setError(null);
    showToast('Your scout data and search history have been cleared.');
  };

  const handleResetToLanding = () => {
    setResult(null);
    setPartialProfile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        result={result}
        onReset={handleResetToLanding}
        onClearData={handleClearData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Unable to complete scout request</h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (targetQuery) {
                  runPipeline({ urlOrUsername: targetQuery });
                } else {
                  setError(null);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Stepper */}
        {loadingStep !== 'idle' ? (
          <LoadingProgress currentStep={loadingStep} targetQuery={targetQuery} />
        ) : result ? (
          /* Results View */
          <div className="space-y-6">
            {/* Top Navigation & Subheader */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetToLanding}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Back to Search"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {result.profile.name || 'Profile Intelligence'}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Scouted {new Date(result.timestamp).toLocaleDateString()} • Verified with Google Search Grounding
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'jobs'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Top 10 Jobs</span>
                  {result.jobs.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                      {result.jobs.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'profile' ? (
              <ProfileView
                profile={result.profile}
                analysis={result.analysis}
                onOpenAugmentModal={() => setIsAugmentModalOpen(true)}
              />
            ) : (
              <JobsView
                jobs={result.jobs}
                groundingSources={result.search_grounding_sources}
                onRefreshJobs={handleRefreshJobs}
                refreshing={refreshingJobs}
              />
            )}
          </div>
        ) : partialProfile ? (
          /* Partial Profile (if jobs failed) */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span className="text-xs font-medium">
                Profile extraction succeeded, but jobs search needs a retry.
              </span>
              <button
                onClick={() => {
                  if (partialProfile.analysis) {
                    runPipeline({ urlOrUsername: targetQuery });
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry Job Search
              </button>
            </div>
            {partialProfile.analysis && (
              <ProfileView
                profile={partialProfile.profile}
                analysis={partialProfile.analysis}
                onOpenAugmentModal={() => setIsAugmentModalOpen(true)}
              />
            )}
          </div>
        ) : (
          /* Landing Screen */
          <LandingHero
            onSearchUrl={(val) => runPipeline({ urlOrUsername: val })}
            onParseText={(text) => runPipeline({ pastedText: text })}
            onUploadFile={(fileData) => runPipeline({ fileData })}
            loading={loadingStep !== 'idle'}
            recentSearches={recentSearches}
            onSelectRecent={(q) => runPipeline({ urlOrUsername: q })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ProfileScout. Grounded professional talent discovery.</p>
          <p className="mt-2 sm:mt-0">
            Compliant with public data guidelines. Verify job openings directly on employer sites.
          </p>
        </div>
      </footer>

      {/* Resume / Text Augment Modal */}
      <ResumeModal
        isOpen={isAugmentModalOpen}
        onClose={() => setIsAugmentModalOpen(false)}
        onParseText={(text) => runPipeline({ pastedText: text })}
        onUploadFile={(fileData) => runPipeline({ fileData })}
        loading={loadingStep !== 'idle'}
      />
    </div>
  );
}
