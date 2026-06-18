import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccessState } from '../components/AuthSuccessState';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

type ResetStep = 'email' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;
      setStep('success');
      setTimeout(() => {
        navigate('/auth');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const stepInfo: Record<ResetStep, { icon: React.ReactNode; title: string; subtitle: string }> = {
    email: {
      icon: <KeyRound size={24} />,
      title: 'Reset Your Passkey',
      subtitle: 'Enter your registered email address to receive a password reset link.'
    },
    success: {
      icon: <CheckCircle2 size={32} />,
      title: 'Reset Email Sent!',
      subtitle: 'Please check your inbox and follow the password reset link. Redirecting to login...'
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
            title="Reset Email Sent!"
            subtitle="Routing you back to the login page..."
          />
        ) : (
          <ForgotPasswordForm
            step={step}
            errorMsg={errorMsg}
            loading={loading}
            email={email}
            setEmail={setEmail}
            handleEmailSubmit={handleEmailSubmit}
          />
        )}
      </div>
    </div>
  );
};
