import api from '@/lib/axios';
import { FeedbackPayload, FeedbackResponse } from '../types/feedback.types';

export const submitFeedback = async (payload: FeedbackPayload): Promise<FeedbackResponse> => {
  const token = localStorage.getItem('auth_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await api.post<FeedbackResponse>('/api/feedback', payload, {
    headers
  });
  return response.data;
};
