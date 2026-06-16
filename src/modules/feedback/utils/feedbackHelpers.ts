export const validateFeedback = (subject: string, message: string, category: string) => {
  const errors: Record<string, string> = {};

  if (!category) {
    errors.category = 'Please select a category';
  }

  if (!subject) {
    errors.subject = 'Subject is required';
  } else if (subject.length < 5) {
    errors.subject = 'Subject must be at least 5 characters';
  } else if (subject.length > 100) {
    errors.subject = 'Subject cannot exceed 100 characters';
  }

  if (!message) {
    errors.message = 'Message is required';
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (message.length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters';
  }

  return errors;
};
