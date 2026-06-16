export type FeedbackCategory = 
  | 'Feature Request'
  | 'Bug Report'
  | 'UI/UX Improvement'
  | 'Account Issue'
  | 'Auction Issue'
  | 'General Feedback';

export interface FeedbackPayload {
  category: FeedbackCategory;
  subject: string;
  message: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
}
