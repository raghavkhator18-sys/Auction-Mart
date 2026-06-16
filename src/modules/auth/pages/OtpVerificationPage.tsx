import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api from '@/lib/axios';

import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccessState } from '../components/AuthSuccessState';
import { OtpForm } from '../components/OtpForm';

export const OtpVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/auth', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await api.post('/auth/verify-otp', { email, otp });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/auth'); // Redirect back to login page
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || err.message || 'OTP Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      <AuthHeader
        icon={<ShieldCheck size={24} />}
        title="Verify Identity"
        subtitle="Please check the terminal where the backend is running to get your 4-digit OTP."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden p-6 relative">
        {isSuccess ? (
          <AuthSuccessState
            title="Account Verified!"
            subtitle="Redirecting to login..."
          />
        ) : (
          <OtpForm
            handleSubmit={handleSubmit}
            errorMsg={errorMsg}
            otp={otp}
            setOtp={setOtp}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};
