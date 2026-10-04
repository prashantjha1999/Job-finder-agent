import React, { useState } from 'react';
import {
  Search,
  FileText,
  Upload,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Briefcase,
  Target,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface LandingHeroProps {
  onSearchUrl: (urlOrUsername: string) => void;
  onParseText: (text: string) => void;
  onUploadFile: (fileData: { base64: string; mimeType: string; filename: string }) => void;
  loading: boolean;
  recentSearches: string[];
  onSelectRecent: (query: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSearchUrl,
  onParseText,
  onUploadFile,
  loading,
  recentSearches,
  onSelectRecent,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const exampleProfiles = [
    { label: 'Satya Nadella', value: 'satyanadella', role: 'Chairman & CEO @ Microsoft' },
    { label: 'Reid Hoffman', value: 'reidhoffman', role: 'Co-Founder LinkedIn & Partner @ Greylock' },
    { label: 'Shantanu Narayen', value: 'shantanu-narayen', role: 'Chair & CEO @ Adobe' },
    { label: 'Bill Gates', value: 'williamhgates', role: 'Co-Chair Bill & Melinda Gates Foundation' },
  ];

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onSearchUrl(urlInput.trim());
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onParseText(textInput.trim());
  };

  const processFile = (selectedFile: File) => {
    setFileError(null);
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf');
    const isTxt = selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt');

    if (!isPdf && !isTxt && !validTypes.includes(selectedFile.type)) {
      setFileError('Please upload a PDF or TXT resume document.');
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setFileError('File size must be under 15MB.');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onUploadFile({
        base64,
        mimeType: selectedFile.type || (isPdf ? 'application/pdf' : 'text/plain'),
        filename: selectedFile.name,
      });
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="py-12 sm:py-16 md:py-20 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero Badge & Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span>Real-Time Public Career Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-5">
          Scout any LinkedIn profile & match with{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            top 10 live job openings
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Extract verified public professional profiles, compute seniority and skill gaps, and discover active, high-match job vacancies with real direct apply links.
        </p>
      </div>

      {/* Main Card with Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Method Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>LinkedIn URL or Username</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Profile / Bio Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume (PDF / TXT)</span>
          </button>
        </div>

        {/* Tab 1: URL / Username */}
        {activeTab === 'url' && (
          <div className="p-6 sm:p-8">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="relative flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste a LinkedIn profile URL (e.g. linkedin.com/in/satyanadella or username)"
                    className="w-full pl-11 pr-4 py-3.5 text-sm sm:text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !urlInput.trim()}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Scout Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Example Shortcuts */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Try an example profile:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exampleProfiles.map((ex) => (
                    <button
                      key={ex.value}
                      type="button"
                      onClick={() => {
                        setUrlInput(`https://www.linkedin.com/in/${ex.value}`);
                        onSearchUrl(ex.value);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 transition-colors cursor-pointer"
                      title={ex.role}
                    >
                      <span>{ex.label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">({ex.value})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">
                    Recent scouts:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.slice(0, 5).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => onSelectRecent(q)}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-800/40 px-2 py-1 rounded border border-slate-200 dark:border-slate-700/60 cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 2: Paste Profile Text */}
        {activeTab === 'text' && (
          <div className="p-6 sm:p-8">
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Paste LinkedIn About / Experience / Resume text
                </label>
                <textarea
                  rows={6}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste profile text, summary, work history, or skills here... ProfileScout will parse it into the exact structured schema."
                  className="w-full p-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {textInput.length > 0 ? `${textInput.length} characters` : 'Supports unformatted text'}
                </span>
                <button
                  type="submit"
                  disabled={loading || textInput.trim().length < 20}
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Parse & Match Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Upload Resume */}
        {activeTab === 'upload' && (
          <div className="p-6 sm:p-8">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/20 hover:border-slate-400 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Drag and drop your resume or bio document
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Supported formats: PDF, TXT (up to 15MB)
              </p>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm">
                <span>Browse File</span>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processFile(e.target.files[0]);
                    }
                  }}
                  disabled={loading}
                />
              </label>

              {file && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selected: {file.name}</span>
                </div>
              )}

              {fileError && (
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compliance & Privacy Notice */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Privacy Notice:</span>{' '}
            Only look up profiles you have permission to view. Results come from publicly available information and may be incomplete. No direct LinkedIn credentials or scraping is used; search grounding gathers public signals.
          </p>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
            Zero Fabrication Guarantee
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Missing dates, certifications, or past roles are explicitly marked as not found rather than guessed or invented.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
            Seniority & Skills Gap Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Extracts top 10 market skills, primary domain, seniority benchmarks, and high-impact target job titles.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
            Real Direct Apply Links
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Live search grounding identifies currently open vacancies on employer career pages and job boards with direct apply links.
          </p>
        </div>
      </div>
    </div>
  );
};
