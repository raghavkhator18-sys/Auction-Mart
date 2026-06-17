import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';

import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccessState } from '../components/AuthSuccessState';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

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
      subtitle: 'Check your email inbox for your 4-digit verification code and enter it below.'
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
      <AuthHeader
        icon={currentStep.icon}
        title={currentStep.title}
        subtitle={currentStep.subtitle}
        iconBgClass={step === 'success' ? 'bg-emerald-500' : 'bg-blue-600'}
        iconBorderClass={step === 'success' ? 'border-emerald-400' : 'border-blue-500'}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden p-6 relative">
        {step === 'success' ? (
          <AuthSuccessState
            title="Passkey Updated!"
            subtitle="Routing you back to the login page..."
          />
        ) : (
          <ForgotPasswordForm
            step={step}
            setStep={setStep}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            loading={loading}
            email={email}
            setEmail={setEmail}
            otp={otp}
            setOtp={setOtp}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleEmailSubmit={handleEmailSubmit}
            handleOtpSubmit={handleOtpSubmit}
            handleResetSubmit={handleResetSubmit}
          />
        )}
      </div>
    </div>
  );
};
