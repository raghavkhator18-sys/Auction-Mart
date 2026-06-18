import api from '@/lib/axios';
import { supabase } from '@/lib/supabase';
import { FeedbackPayload, FeedbackResponse } from '../types/feedback.types';

export const submitFeedback = async (payload: FeedbackPayload): Promise<FeedbackResponse> => {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  const response = await api.post<FeedbackResponse>('/api/feedback', payload, {
    headers
  });
  return response.data;
};
