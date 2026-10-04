import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Building,
  Sparkles,
  Search,
  Globe,
} from 'lucide-react';
import { JobItem, GroundingSource } from '../types.ts';

interface JobsViewProps {
  jobs: JobItem[];
  groundingSources: GroundingSource[];
  onRefreshJobs: () => void;
  refreshing: boolean;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  groundingSources,
  onRefreshJobs,
  refreshing,
}) => {
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'company' | 'title'>('score');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique locations for suggestions
  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.location && j.location.toLowerCase() !== 'remote') {
        set.add(j.location);
      }
    });
    return Array.from(set);
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (remoteOnly && !job.remote) return false;
        if (job.match_score < minScore) return false;
        if (
          locationSearch &&
          !job.location.toLowerCase().includes(locationSearch.toLowerCase())
        ) {
          return false;
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.company.toLowerCase().includes(q);
          const matchReason = job.match_reason.toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchReason) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return (b.match_score || 0) - (a.match_score || 0);
        if (sortBy === 'company') return a.company.localeCompare(b.company);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [jobs, remoteOnly, locationSearch, minScore, sortBy, searchQuery]);

  // Badge color based on match score
  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        label: 'Exceptional Fit',
      };
    }
    if (score >= 80) {
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/60',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        label: 'Strong Fit',
      };
    }
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800',
      label: 'Moderate Fit',
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Notice Header */}
      <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong className="font-semibold">Candidate Match Engine:</strong> Showing verified active openings matching target roles and skills.
          </span>
        </div>

        <button
          type="button"
          onClick={onRefreshJobs}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 border border-blue-200 dark:border-blue-800 shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Jobs'}</span>
        </button>
      </div>

      {/* 2. Filters & Sort Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Quick Search in Jobs */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, company, or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Remote Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
              />
              <span>Remote Only</span>
            </label>

            {/* Min Match Score */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span>Min Fit:</span>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={0}>All Scores</option>
                <option value={75}>75%+</option>
                <option value={85}>85%+</option>
                <option value={90}>90%+</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="score">Highest Match Score</option>
                <option value="company">Company (A-Z)</option>
                <option value="title">Job Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location tags if any */}
        {availableLocations.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">Locations:</span>
            <button
              type="button"
              onClick={() => setLocationSearch('')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                locationSearch === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {availableLocations.slice(0, 5).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocationSearch(loc === locationSearch ? '' : loc)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  locationSearch === loc
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Job Cards Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredJobs.length}</strong> of{' '}
          <strong className="text-slate-800 dark:text-slate-200">{jobs.length}</strong> matched positions
        </span>
      </div>

      {/* 4. Job Cards List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const badge = getScoreBadge(job.match_score);

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800/80 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                      {job.remote && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Remote
                        </span>
                      )}
                    </div>

                    {/* Company & Meta */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 dark:text-slate-300 mb-3">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.company}</span>
                      </span>

                      {job.location && (
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.location}</span>
                        </span>
                      )}

                      {job.posted_date && (
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.posted_date}</span>
                        </span>
                      )}

                      {job.source && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          via {job.source}
                        </span>
                      )}
                    </div>

                    {/* Why this matches */}
                    {job.match_reason && (
                      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 mb-3 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-slate-900 dark:text-white">Why it matches: </strong>
                          {job.match_reason}
                        </div>
                      </div>
                    )}

                    {/* Matched skills chips */}
                    {job.key_requirements_matched && job.key_requirements_matched.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className="text-[11px] text-slate-400 font-medium">Matched:</span>
                        {job.key_requirements_matched.map((req) => (
                          <span
                            key={req}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Mandatory Employer Site Verification Notice */}
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Verify the posting is still open on the employer's site</span>
                    </div>
                  </div>

                  {/* Score & Apply Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    <div
                      className={`px-3 py-1.5 rounded-xl border ${badge.bg} ${badge.border} flex flex-col items-center justify-center text-center`}
                    >
                      <div className="text-base font-extrabold leading-none mb-0.5">
                        <span className={badge.text}>{job.match_score}%</span>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${badge.text}`}>
                        {badge.label}
                      </span>
                    </div>

                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer group-hover:scale-[1.02]"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            No matching jobs for current filters
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing the location filter, or toggling remote only.
          </p>
          <button
            type="button"
            onClick={() => {
              setRemoteOnly(false);
              setLocationSearch('');
              setMinScore(0);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 5. Job Search Grounding Citations */}
      {groundingSources && groundingSources.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2.5">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Live Job Search Grounding Sources
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {groundingSources.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 max-w-xs truncate"
                title={s.url}
              >
                <span className="truncate">{s.title || s.url}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
