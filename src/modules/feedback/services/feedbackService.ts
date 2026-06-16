import axios from 'axios';
import { FeedbackPayload, FeedbackResponse } from '../types/feedback.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const submitFeedback = async (payload: FeedbackPayload): Promise<FeedbackResponse> => {
  const token = localStorage.getItem('auth_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.post<FeedbackResponse>(`${API_URL}/api/feedback`, payload, {
    headers
  });
  return response.data;
};
