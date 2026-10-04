import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Search, Cpu, Briefcase, Sparkles } from 'lucide-react';

interface LoadingProgressProps {
  currentStep: 'reading' | 'analyzing' | 'searching' | 'ranking';
  targetQuery?: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  currentStep,
  targetQuery,
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 'reading',
      title: 'Reading Profile',
      desc: 'Gathering publicly available signals and URL context without scraping',
      icon: Search,
    },
    {
      id: 'analyzing',
      title: 'Career Intelligence Analysis',
      desc: 'Synthesizing professional summary, seniority level, and skill gaps',
      icon: Cpu,
    },
    {
      id: 'searching',
      title: 'Searching Active Jobs',
      desc: 'Querying employer career portals and job boards via Google Search Grounding',
      icon: Briefcase,
    },
    {
      id: 'ranking',
      title: 'Scoring & Verifying Links',
      desc: 'Validating direct apply URLs and computing fit scores (0-100)',
      icon: Sparkles,
    },
  ];

  const getStepStatus = (stepId: string) => {
    const order = ['reading', 'analyzing', 'searching', 'ranking'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Scouting Talent & Opportunities{dots}
          </h2>
          {targetQuery && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-md mx-auto">
              Analyzing: <span className="font-medium text-slate-700 dark:text-slate-300">{targetQuery}</span>
            </p>
          )}
        </div>

        {/* Stepper list */}
        <div className="space-y-5">
          {steps.map((s, idx) => {
            const status = getStepStatus(s.id);
            const Icon = s.icon;

            return (
              <div
                key={s.id}
                className={`flex items-start gap-4 p-3.5 rounded-xl transition-all duration-300 ${
                  status === 'active'
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60'
                    : 'opacity-70'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {status === 'completed' ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : status === 'active' ? (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse shadow-sm shadow-blue-500/30">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center text-xs font-semibold">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-semibold ${
                        status === 'active'
                          ? 'text-blue-900 dark:text-blue-200'
                          : status === 'completed'
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-500 dark:text-slate-500'
                      }`}
                    >
                      {s.title}
                    </h4>
                    {status === 'active' && (
                      <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 animate-pulse">
                        In progress...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skeleton Preview Placeholder */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-3">
            Preparing profile & job cards
          </div>
          <div className="space-y-2.5 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-1/2"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
