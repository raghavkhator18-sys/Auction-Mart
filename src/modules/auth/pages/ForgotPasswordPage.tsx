import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccessState } from '../components/AuthSuccessState';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { getFriendlyAuthError } from '../utils/authErrorMessages';

type ResetStep = 'email' | 'update' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successTitle, setSuccessTitle] = useState('');
  const [successSubtitle, setSuccessSubtitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        setStep('update');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStep('update');
        setErrorMsg('');
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`
      });

      if (error) throw error;
      setSuccessTitle('Reset Email Sent');
      setSuccessSubtitle('Please check your inbox and open the reset link from Supabase.');
      setStep('success');
      setTimeout(() => {
        navigate('/auth');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Both passkeys must match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccessTitle('Passkey Updated');
      setSuccessSubtitle('You can now sign in with your new passkey.');
      setStep('success');
      await supabase.auth.signOut();
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(getFriendlyAuthError(err, 'Unable to update your passkey. Please request a new reset link.'));
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
      title: 'Reset Request Complete',
      subtitle: 'Follow the email link or sign in with your new passkey.'
    },
    update: {
      icon: <KeyRound size={24} />,
      title: 'Set New Passkey',
      subtitle: 'Choose a new passkey for your AuctionMart account.'
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
            title={successTitle || currentStep.title}
            subtitle={successSubtitle || currentStep.subtitle}
          />
        ) : (
          <ForgotPasswordForm
            step={step}
            errorMsg={errorMsg}
            loading={loading}
            email={email}
            setEmail={setEmail}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleEmailSubmit={handleEmailSubmit}
            handlePasswordSubmit={handlePasswordSubmit}
          />
        )}
      </div>
    </div>
  );
};
