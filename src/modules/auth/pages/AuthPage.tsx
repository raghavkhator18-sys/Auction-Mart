import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel } from 'lucide-react';
import { ScreenId } from '@/shared/types';
import { useAuctionMart } from '@/app/store';
import { saveToken, saveUser } from '@/lib/authHelpers';
import api from '@/lib/axios';

import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccessState } from '../components/AuthSuccessState';
import { AuthForm } from '../components/AuthForm';

interface AuthPageProps {
  setCurrentScreen: (screen: ScreenId) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  setCurrentScreen
}) => {
  const { handleSignInSuccess } = useAuctionMart();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await api.post('/auth/signup', { name: fullName, email, password });
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        const res = await api.post('/auth/login', { email, password });
        const token = res.data.token || 'dummy-jwt-' + email;
        const userName = res.data.user?.name || email.split('@')[0];
        const userEmail = res.data.user?.email || email;
        saveToken(token);
        saveUser({ name: userName, email: userEmail });
        handleSignInSuccess(userName, userEmail);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setCurrentScreen('home');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || err.message || 'Authentication failed');
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
            title="Identity Verified"
            subtitle="Routing secure token to your browser. Unlocking active lots..."
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
