export interface ExperienceItem {
  title: string;
  company: string;
  location?: string;
  dates: string;
  description: string;
}

export interface EducationItem {
  school: string;
  degree?: string;
  field_of_study?: string;
  dates?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year?: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  link?: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ProfileData {
  name: string;
  headline: string;
  location: string;
  about: string;
  current_role: string;
  current_company: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  languages: string[];
  total_years_experience: number;
  not_found_fields: string[];
  is_thin_or_private: boolean;
  profile_url?: string;
  grounding_sources?: GroundingSource[];
}

export interface CareerAnalysis {
  professional_summary: string;
  seniority_level: string;
  primary_domain: string;
  top_skills: string[];
  strengths: string[];
  skill_gaps: string[];
  target_job_titles: string[];
  search_keywords: string[];
  preferred_locations: string[];
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  posted_date: string;
  source: string;
  apply_url: string;
  match_score: number;
  match_reason: string;
  key_requirements_matched?: string[];
}

export interface FullAnalysisResult {
  profile: ProfileData;
  analysis: CareerAnalysis;
  jobs: JobItem[];
  search_grounding_sources: GroundingSource[];
  timestamp: number;
}
