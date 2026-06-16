import React from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  isSignUp: boolean;
  setIsSignUp: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  errorMsg: string;
  loading: boolean;
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isSignUp, setIsSignUp, handleSubmit, errorMsg, loading,
  fullName, setFullName, email, setEmail, password, setPassword
}) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100">
          {errorMsg}
        </div>
      )}
      
      {/* Toggle Switch pills */}
      <div className="grid grid-cols-2 gap-1.5 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 p-1 border border-slate-200 dark:border-slate-700 rounded-xl mb-2">
        <button
          id="sign-in-tab-toggle"
          type="button"
          onClick={() => setIsSignUp(false)}
          className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
        >
          Sign In
        </button>
        <button
          id="sign-up-tab-toggle"
          type="button"
          onClick={() => setIsSignUp(true)}
          className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
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
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
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
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
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
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
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
  );
};
