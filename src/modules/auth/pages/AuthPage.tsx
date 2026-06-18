import React, { useState } from 'react';
import { Gavel } from 'lucide-react';
import { ScreenId } from '@/shared/types';
import { useAuctionMart } from '@/app/store';
import { supabase } from '@/lib/supabase';

import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccessState } from '../components/AuthSuccessState';
import { AuthForm } from '../components/AuthForm';
import { getFriendlyAuthError } from '../utils/authErrorMessages';

interface AuthPageProps {
  setCurrentScreen: (screen: ScreenId) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  setCurrentScreen
}) => {
  const { handleSignInSuccess } = useAuctionMart();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successSubtitle, setSuccessSubtitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: fullName
            }
          }
        });

        if (error) throw error;
        if (data.session) {
          await supabase.auth.signOut();
        }
        setSuccessTitle('Verification Email Sent');
        setSuccessSubtitle('Verification email sent. Please check your inbox and click the confirmation link.');
        setIsSuccess(true);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        const userName = data.user?.user_metadata?.name || data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || email.split('@')[0];
        const userEmail = data.user?.email || email;
        handleSignInSuccess(userName, userEmail);
        setSuccessTitle('Identity Verified');
        setSuccessSubtitle('Routing secure session to your browser. Unlocking active lots...');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setCurrentScreen('home');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(getFriendlyAuthError(err, 'Authentication failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      <AuthHeader
        icon={<Gavel size={24} className="transform rotate-45" />}
        title="Access Premium Bidding Room"
        subtitle="Verify yourself to access active bidding lots and placing offers."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden p-6 relative">
        {isSuccess ? (
          <AuthSuccessState
            title={successTitle}
            subtitle={successSubtitle}
          />
        ) : (
          <AuthForm
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            handleSubmit={handleSubmit}
            errorMsg={errorMsg}
            loading={loading}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        )}
      </div>
    </div>
  );
};
