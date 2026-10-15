import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send HttpOnly cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach bearer token from sessionStorage if the backend uses token-based auth.
// If the backend uses HttpOnly cookies, this block is a no-op.
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('nexora_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Expired or missing session — clear any stored token and redirect to login
      sessionStorage.removeItem('nexora_token');
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = `/login?next=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(parseApiError(error));
  }
);

// ─── Error Parser ─────────────────────────────────────────────────────────────
export function parseApiError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as Record<string, unknown>;
    return {
      message:
        (data?.detail as string) ||
        (data?.message as string) ||
        'An unexpected error occurred.',
      detail: data?.detail as string | undefined,
      errors: data?.errors as Record<string, string[]> | undefined,
      status: error.response.status,
    };
  }
  if (error.request) {
    return {
      message: 'Unable to reach the server. Please check your connection.',
      status: 0,
    };
  }
  return { message: error.message || 'An unexpected error occurred.' };
}

// ─── Generic Request Helpers ──────────────────────────────────────────────────
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await apiClient.post<T>(url, data, config);
  return res.data;
}

export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await apiClient.put<T>(url, data, config);
  return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.delete<T>(url, config);
  return res.data;
}

export async function postForm<T>(url: string, formData: FormData): Promise<T> {
  // Do NOT set Content-Type; axios will set multipart/form-data + boundary automatically
  const res = await apiClient.post<T>(url, formData, {
    headers: { 'Content-Type': undefined },
  });
  return res.data;
}

export default apiClient;
