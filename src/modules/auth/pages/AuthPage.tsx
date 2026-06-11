import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScreenId } from '@/shared/types';
import { useAuctionMart } from '@/app/store';
import { saveToken, saveUser } from '@/lib/authHelpers';
import api from '@/services/api';

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

  const handleQuickPreselect = (name: string, mail: string) => {
    setFullName(name);
    setEmail(mail);
    setPassword('cryptoStrongPassword!99');
    setIsSignUp(false);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">

      {/* 1. Welcomer Card logo */}
      <div className="text-center space-y-2">
        <div className="inline-flex w-12 h-12 bg-blue-600 text-white rounded-2xl items-center justify-center shadow-sm border border-blue-500">
          <Gavel size={24} className="transform rotate-45" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Premium Bidding Room</h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">Verify yourself to access active bidding lots and placing offers.</p>
      </div>

      {/* 2. Unified Card form */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 relative">

        {isSuccess ? (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Identity Verified</h3>
            <p className="text-xs text-slate-505 text-slate-500">Routing secure token to your browser. Unlocking active lots...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100">
                {errorMsg}
              </div>
            )}
            {/* Toggle Switch pills */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-xl mb-2">
              <button
                id="sign-in-tab-toggle"
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Sign In
              </button>
              <button
                id="sign-up-tab-toggle"
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Sign Up
              </button>
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400"><User size={14} /></span>
                  <input
                    id="auth-signup-name-input"
                    type="text"
                    required
                    placeholder="your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><Mail size={14} /></span>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">Enter Passkey</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><Lock size={14} /></span>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 bg-slate-50"
                />
              </div>
            </div>

            {/* Forgot Passkey link — only visible on Sign In tab */}
            {!isSignUp && (
              <div className="flex justify-end -mt-1">
                <button
                  id="forgot-passkey-link"
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  Forgot Passkey?
                </button>
              </div>
            )}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Register' : 'Dive into auction')} <ArrowRight size={13} />
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
