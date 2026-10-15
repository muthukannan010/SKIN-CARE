import { get, post } from './api';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';

export const authService = {
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    post<AuthResponse>('/api/auth/register', payload),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    post<AuthResponse>('/api/auth/login', payload),

  logout: (): Promise<{ message: string }> =>
    post<{ message: string }>('/api/auth/logout'),

  me: (): Promise<User> =>
    get<User>('/api/auth/me'),
};
