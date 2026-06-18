export const getFriendlyAuthError = (error: unknown, fallback = 'Something went wrong. Please try again.') => {
  const message = error instanceof Error ? error.message : String(error || '');
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('rate limit') ||
    lowerMessage.includes('too many') ||
    lowerMessage.includes('email rate limit')
  ) {
    return 'Too many verification attempts. Please try again later.';
  }

  if (
    lowerMessage.includes('failed to fetch') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('load failed')
  ) {
    return 'Unable to connect. Please check your internet connection.';
  }

  if (lowerMessage.includes('invalid login credentials')) {
    return 'The email or passkey is incorrect. Please try again.';
  }

  if (lowerMessage.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }

  if (lowerMessage.includes('password should be at least')) {
    return 'Your passkey must be at least 6 characters long.';
  }

  if (lowerMessage.includes('same password')) {
    return 'Please choose a new passkey that is different from your current one.';
  }

  return fallback;
};
