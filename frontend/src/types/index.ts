// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  created_at: string;
  updated_at?: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginPayload {
  email_or_username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
  token_type?: string;
  message?: string;
}

// ─── Analysis Types ───────────────────────────────────────────────────────────
export interface Prediction {
  condition: string;
  confidence: number;
  rank: number;
}

export interface AnalysisResult {
  id: string;
  image_url?: string;
  predicted_condition: string;
  confidence: number;
  predictions: Prediction[];
  description: string;
  symptoms: string[];
  possible_causes: string[];
  supportive_care: string[];
  prevention: string[];
  when_to_see_doctor: string[];
  emergency_warning_signs: string[];
  model_version: string;
  analyzed_at: string;
  user_id: string;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
  message?: string;
}

// ─── History Types ────────────────────────────────────────────────────────────
export interface HistoryItem {
  id: string;
  image_url?: string;
  predicted_condition: string;
  confidence: number;
  analyzed_at: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
}

// ─── Profile Types ────────────────────────────────────────────────────────────
export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────
export interface DashboardStats {
  total_analyses: number;
  recent_analyses: HistoryItem[];
  latest_prediction?: string;
  latest_confidence?: number;
}

// ─── API Error ────────────────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// ─── Form Validation ──────────────────────────────────────────────────────────
export interface FormErrors {
  [key: string]: string;
}
