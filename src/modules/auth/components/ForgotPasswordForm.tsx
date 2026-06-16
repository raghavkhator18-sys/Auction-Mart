import React from 'react';
import { Mail, ShieldCheck, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ResetStep = 'email' | 'otp' | 'new-password' | 'success';

interface ForgotPasswordFormProps {
  step: ResetStep;
  setStep: (val: ResetStep) => void;
  errorMsg: string;
  setErrorMsg: (val: string) => void;
  loading: boolean;
  email: string;
  setEmail: (val: string) => void;
  otp: string;
  setOtp: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  handleEmailSubmit: (e: React.FormEvent) => void;
  handleOtpSubmit: (e: React.FormEvent) => void;
  handleResetSubmit: (e: React.FormEvent) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  step, setStep, errorMsg, setErrorMsg, loading,
  email, setEmail, otp, setOtp, newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  handleEmailSubmit, handleOtpSubmit, handleResetSubmit
}) => {
  const navigate = useNavigate();

  if (step === 'email') {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">Registered Email</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400"><Mail size={14} /></span>
            <input
              id="forgot-email-input"
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
            />
          </div>
        </div>

        <button
          id="forgot-send-otp-btn"
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
        >
          {loading ? 'Sending OTP...' : 'Send Verification Code'} <ArrowRight size={13} />
        </button>

        <button
          type="button"
          onClick={() => navigate('/auth')}
          className="w-full py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} /> Back to Login
        </button>
      </form>
    );
  }

  if (step === 'otp') {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">Enter OTP</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400"><ShieldCheck size={14} /></span>
            <input
              id="forgot-otp-input"
              type="text"
              required
              placeholder="Enter 4-digit OTP"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
            />
          </div>
        </div>

        <button
          id="forgot-verify-otp-btn"
          type="submit"
          disabled={loading || otp.length < 4}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={13} />
        </button>

        <button
          type="button"
          onClick={() => { setStep('email'); setErrorMsg(''); }}
          className="w-full py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} /> Change Email
        </button>
      </form>
    );
  }

  if (step === 'new-password') {
    return (
      <form onSubmit={handleResetSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">New Passkey</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400"><Lock size={14} /></span>
            <input
              id="forgot-new-password-input"
              type="password"
              required
              placeholder="Enter new passkey"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">Confirm Passkey</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400"><Lock size={14} /></span>
            <input
              id="forgot-confirm-password-input"
              type="password"
              required
              placeholder="Confirm new passkey"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
            />
          </div>
        </div>

        <button
          id="forgot-reset-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Passkey'} <ArrowRight size={13} />
        </button>
      </form>
    );
  }

  return null;
};
