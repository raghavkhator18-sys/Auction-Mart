import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';

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
      <div className="text-center space-y-2">
        <div className="inline-flex w-12 h-12 bg-blue-600 text-white rounded-2xl items-center justify-center shadow-sm border border-blue-500">
          <ShieldCheck size={24} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verify Identity</h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Please check the terminal where the backend is running to get your 4-digit OTP.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 relative">
        {isSuccess ? (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Account Verified!</h3>
            <p className="text-xs text-slate-505 text-slate-500">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  id="auth-otp-input"
                  type="text"
                  required
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
                />
              </div>
            </div>

            <button
              id="verify-submit-btn"
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={13} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
