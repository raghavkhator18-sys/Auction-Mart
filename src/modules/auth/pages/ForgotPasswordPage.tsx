import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ShieldCheck, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';

// Multi-step flow: email → otp → new-password → success
type ResetStep = 'email' | 'otp' | 'new-password' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Current step in the reset flow
  const [step, setStep] = useState<ResetStep>('email');

  // Form state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ─── Step 1: Submit email to receive OTP ───
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setStep('otp');
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Verify the OTP ───
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await api.post('/auth/verify-reset-otp', { email, otp });
      setStep('new-password');
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'OTP verification failed'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Set the new password ───
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side password confirmation check
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', { email, newPassword });
      setStep('success');
      // Auto-redirect back to login after a short delay
      setTimeout(() => {
        navigate('/auth');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Password reset failed'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Step heading info per step ───
  const stepInfo: Record<ResetStep, { icon: React.ReactNode; title: string; subtitle: string }> = {
    email: {
      icon: <KeyRound size={24} />,
      title: 'Reset Your Passkey',
      subtitle: 'Enter your registered email address to receive a verification code.'
    },
    otp: {
      icon: <ShieldCheck size={24} />,
      title: 'Verify Identity',
      subtitle: 'Check the backend terminal for your 4-digit OTP and enter it below.'
    },
    'new-password': {
      icon: <Lock size={24} />,
      title: 'Set New Passkey',
      subtitle: 'Create a strong new passkey for your account.'
    },
    success: {
      icon: <CheckCircle2 size={32} />,
      title: 'Passkey Reset Complete!',
      subtitle: 'Your passkey has been updated successfully. Redirecting to login...'
    }
  };

  const currentStep = stepInfo[step];

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">

      {/* Header icon + title */}
      <div className="text-center space-y-2">
        <div className={`inline-flex w-12 h-12 ${step === 'success' ? 'bg-emerald-500' : 'bg-blue-600'} text-white rounded-2xl items-center justify-center shadow-sm border ${step === 'success' ? 'border-emerald-400' : 'border-blue-500'}`}>
          {currentStep.icon}
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{currentStep.title}</h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">{currentStep.subtitle}</p>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 relative">

        {/* ─── Success state ─── */}
        {step === 'success' && (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Passkey Updated!</h3>
            <p className="text-xs text-slate-500">Routing you back to the login page...</p>
          </div>
        )}

        {/* ─── Step 1: Email input ─── */}
        {step === 'email' && (
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
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
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
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft size={12} /> Back to Login
            </button>
          </form>
        )}

        {/* ─── Step 2: OTP verification ─── */}
        {step === 'otp' && (
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
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
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
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft size={12} /> Change Email
            </button>
          </form>
        )}

        {/* ─── Step 3: New password ─── */}
        {step === 'new-password' && (
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
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
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
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
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
        )}

      </div>
    </div>
  );
};
