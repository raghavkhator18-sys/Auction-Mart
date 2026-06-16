import { useState } from 'react';
import { FeedbackPayload } from '../types/feedback.types';
import { submitFeedback } from '../services/feedbackService';

export const useFeedback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendFeedback = async (payload: FeedbackPayload) => {
    setIsLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await submitFeedback(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetStatus = () => {
    setSuccess(false);
    setError(null);
  };

  return {
    isLoading,
    success,
    error,
    sendFeedback,
    resetStatus
  };
};
