import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
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
  
  const [countdown, setCountdown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/auth', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    // Mock resend logic for now
    setCountdown(60);
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 3000);
  };

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
        subtitle="Please check your email inbox for your 4-digit verification code and enter it below."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden p-6 relative">
        {/* Email Notification Card */}
        <div className="mb-6 flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shrink-0 shadow-xs">
            <Mail size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Verification code sent to:</p>
            <a href={`mailto:${email}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
              {email}
            </a>
          </div>
        </div>

        {resendSuccess && (
          <div className="mb-4 flex items-center justify-center gap-1.5 p-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">
            <CheckCircle2 size={14} /> Email sent successfully
          </div>
        )}

        {isSuccess ? (
          <AuthSuccessState
            title="Account Verified!"
            subtitle="Redirecting to login..."
          />
        ) : (
          <>
            <OtpForm
              handleSubmit={handleSubmit}
              errorMsg={errorMsg}
              otp={otp}
              setOtp={setOtp}
              loading={loading}
            />

            <div className="mt-6 text-center">
              {countdown > 0 ? (
                <p className="text-xs font-medium text-slate-500">
                  Resend code in <span className="font-bold text-slate-700 dark:text-slate-300">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide"
                >
                  Resend Verification Code
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
