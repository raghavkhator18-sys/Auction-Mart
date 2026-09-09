import React, { useState } from 'react';
import { MessageSquareMore, CheckCircle2, AlertCircle } from 'lucide-react';
import { FeedbackCategory } from '../types/feedback.types';
import { useFeedback } from '../hooks/useFeedback';
import { validateFeedback } from '../utils/feedbackHelpers';
import { FeedbackCategorySelect } from './FeedbackCategorySelect';
import { FeedbackTextarea } from './FeedbackTextarea';

const DRAFT_STORAGE_KEY = 'auctionmart_feedback_draft';

const VALID_CATEGORIES: FeedbackCategory[] = [
  'Feature Request',
  'Bug Report',
  'UI/UX Improvement',
  'Account Issue',
  'Auction Issue',
  'General Feedback'
];

interface FeedbackDraft {
  subject?: string;
  category?: FeedbackCategory | '';
  message?: string;
}

const getSavedDraft = (): FeedbackDraft => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      subject: typeof parsed.subject === 'string' ? parsed.subject : '',
      category: VALID_CATEGORIES.includes(parsed.category) ? parsed.category : '',
      message: typeof parsed.message === 'string' ? parsed.message : ''
    };
  } catch {
    return {};
  }
};

export const FeedbackForm: React.FC = () => {
  const initialDraft = React.useMemo(() => getSavedDraft(), []);

  const [subject, setSubject] = useState(initialDraft.subject || '');
  const [category, setCategory] = useState<FeedbackCategory | ''>(initialDraft.category || '');
  const [message, setMessage] = useState(initialDraft.message || '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { isLoading, success, error, sendFeedback, resetStatus } = useFeedback();

  // Save draft whenever user changes values
  React.useEffect(() => {
    if (subject || category || message) {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({ subject, category, message })
        );
      } catch (err) {
        console.warn('Failed to save feedback draft to localStorage:', err);
      }
    } else {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (err) {
        console.warn('Failed to remove feedback draft from localStorage:', err);
      }
    }
  }, [subject, category, message]);

  const handleReset = () => {
    setSubject('');
    setCategory('');
    setMessage('');
    setFormErrors({});
    resetStatus();
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear feedback draft:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetStatus();

    const errors = validateFeedback(subject, message, category);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const isSuccess = await sendFeedback({
      subject,
      category: category as FeedbackCategory,
      message
    });

    if (isSuccess) {
      // Clear form and draft only on success
      setSubject('');
      setCategory('');
      setMessage('');
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (err) {
        console.warn('Failed to clear draft on success:', err);
      }
    }
    // If failed, draft remains in localStorage and in form state
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 sm:p-10 shadow-sm max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8 space-y-3">
        <div className="w-14 h-14 bg-blue-50/80 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 shadow-xs mb-1">
          <MessageSquareMore size={26} strokeWidth={2.5} />
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Help Us Improve AuctionMart
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Have an idea, found a bug, or want a new feature?<br />
          We'd love to hear from you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">Subject <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Briefly describe your feedback"
            className={`w-full bg-white dark:bg-slate-900 border ${formErrors.subject ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white transition-colors`}
          />
          {formErrors.subject && <p className="text-[10px] text-red-500 mt-1">{formErrors.subject}</p>}
        </div>

        <FeedbackCategorySelect
          value={category}
          onChange={setCategory}
          error={formErrors.category}
        />

        <FeedbackTextarea
          value={message}
          onChange={setMessage}
          placeholder="Tell us more about your suggestion, issue, or idea..."
          error={formErrors.message}
        />

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
            <AlertCircle size={14} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-medium border border-emerald-100 animate-fade-in">
            <CheckCircle2 size={14} className="flex-shrink-0" />
            <p>Feedback submitted successfully. Thank you!</p>
          </div>
        )}

        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading || (!subject && !category && !message)}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <MessageSquareMore size={16} />
            {isLoading ? 'Sending...' : 'Send Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};
