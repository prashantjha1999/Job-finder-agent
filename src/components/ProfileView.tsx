import React from 'react';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  FolderGit2,
  Globe,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  FileText,
  CheckCircle,
  TrendingUp,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { ProfileData, CareerAnalysis } from '../types.ts';

interface ProfileViewProps {
  profile: ProfileData;
  analysis: CareerAnalysis;
  onOpenAugmentModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  analysis,
  onOpenAugmentModal,
}) => {
  // Generate initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'PS';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg shadow-blue-500/20 shrink-0">
              {getInitials(profile.name)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {profile.name || 'Candidate Profile'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Public Signals</span>
                </span>
              </div>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-2xl leading-snug">
                {profile.headline || `${profile.current_role} at ${profile.current_company}`}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.location}</span>
                  </span>
                )}
                {profile.current_company && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {profile.current_role ? `${profile.current_role} • ` : ''}
                      {profile.current_company}
                    </span>
                  </span>
                )}
                {profile.total_years_experience > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    {profile.total_years_experience}+ Years Exp.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* External Profile Link */}
          {profile.profile_url && (
            <a
              href={profile.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 transition-colors"
            >
              <span>View Source Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* About Section */}
        {profile.about && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              About & Background
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {profile.about}
            </p>
          </div>
        )}
      </div>

      {/* 2. Thin/Private Data Alert & Augment Trigger */}
      {profile.is_thin_or_private && (
        <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Limited Public Profile Data Detected
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5 max-w-xl leading-relaxed">
                LinkedIn privacy settings or login walls restricted some sections for this profile. We never invent missing data. You can augment this profile right now with full resume text or a PDF for enhanced job matching.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAugmentModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-sm flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Augment with Resume / Text</span>
          </button>
        </div>
      )}

      {/* 3. Fields Not Found (Honesty & Anti-Fabrication Guarantee) */}
      {profile.not_found_fields && profile.not_found_fields.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 mt-2 shrink-0"></div>
          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Not publicly listed or omitted in source data:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {profile.not_found_fields.map((field) => (
                <span
                  key={field}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. AI Career Intelligence Report */}
      <div className="bg-gradient-to-br from-blue-900/90 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold uppercase tracking-wider text-cyan-300">
            AI Career Architecture & Analysis
          </h3>
        </div>

        {/* 4-5 line summary */}
        <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal mb-6">
          {analysis.professional_summary}
        </p>

        {/* Seniority & Domain Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cyan-300 block mb-1">
              Seniority Level
            </span>
            <span className="text-base font-bold text-white">
              {analysis.seniority_level}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-cyan-300 block mb-1">
              Primary Domain
            </span>
            <span className="text-base font-bold text-white">
              {analysis.primary_domain}
            </span>
          </div>
        </div>

        {/* Strengths & Skill Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Career Strengths</span>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-100 leading-relaxed">
              {analysis.strengths.map((st, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Gaps */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Growth & Advancement Targets</span>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-100 leading-relaxed">
              {analysis.skill_gaps.map((sg, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{sg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Target Job Titles */}
        <div className="pt-4 border-t border-white/10">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Target Job Match Titles
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.target_job_titles.map((title) => (
              <span
                key={title}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Work Experience Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Professional Experience
          </h3>
        </div>

        {profile.experience && profile.experience.length > 0 ? (
          <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-slate-900">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {exp.title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                      {exp.dates}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            No verified past work history entries found in public search results.
          </div>
        )}
      </div>

      {/* 6. Skills, Education & Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Matrix */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Top Market & Technical Skills
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {(analysis.top_skills || profile.skills || []).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Education & Degrees
            </h4>
          </div>

          {profile.education && profile.education.length > 0 ? (
            <div className="space-y-3">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="border-b border-slate-100 dark:border-slate-800/80 pb-2.5 last:border-0 last:pb-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {edu.school}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                  </div>
                  {edu.dates && (
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {edu.dates}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Education details not publicly verified or private.
            </div>
          )}
        </div>
      </div>

      {/* 7. Certifications & Projects (if available) */}
      {((profile.certifications && profile.certifications.length > 0) ||
        (profile.projects && profile.projects.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Certifications
                </h4>
              </div>
              <div className="space-y-2.5">
                {profile.certifications.map((c, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{c.name}</span>
                    <span className="text-slate-500 dark:text-slate-400"> — {c.issuer} {c.year ? `(${c.year})` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.projects && profile.projects.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <FolderGit2 className="w-4 h-4 text-indigo-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Featured Projects
                </h4>
              </div>
              <div className="space-y-3">
                {profile.projects.map((p, i) => (
                  <div key={i} className="text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{p.title}</span>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center gap-0.5">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. Public Grounding Sources / Citations */}
      {profile.grounding_sources && profile.grounding_sources.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2.5">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Grounding Citations & Web Sources
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.grounding_sources.map((s, idx) => (
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
