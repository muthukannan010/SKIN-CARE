import { get, put, postForm } from './api';
import { User, ProfileUpdatePayload, DashboardStats } from '../types';
import { historyService } from './historyService';

export const profileService = {
  getProfile: (): Promise<User> =>
    get<User>('/api/profile'),

  updateProfile: (payload: ProfileUpdatePayload): Promise<User> =>
    put<User>('/api/profile', payload),

  updateProfileImage: (imageFile: File): Promise<User> => {
    const form = new FormData();
    form.append('profile_image', imageFile);
    return postForm<User>('/api/profile/image', form);
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const res = await get<DashboardStats>('/api/dashboard/stats');
      if (res && typeof res.total_analyses === 'number') {
        return res;
      }
    } catch {
      // Endpoint does not exist on FastAPI backend, derive directly from scan history
    }

    const history = await historyService.list(1, 10);
    const recent = history.items || [];
    return {
      total_analyses: history.total || recent.length,
      recent_analyses: recent.slice(0, 5),
      latest_prediction: recent[0]?.predicted_condition,
      latest_confidence: recent[0]?.confidence,
    };
  },
};
