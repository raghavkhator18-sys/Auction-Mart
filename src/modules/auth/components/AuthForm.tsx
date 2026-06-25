import React from 'react';
import { User, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  isSignUp: boolean;
  setIsSignUp: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleOAuthLogin: (provider: 'google' | 'github') => void;
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
  isSignUp, setIsSignUp, handleSubmit, handleOAuthLogin, errorMsg, loading,
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

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        <span className="shrink-0 px-3 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Or continue with</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin('github')}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50"
        >
          <Github size={16} />
          GitHub
        </button>
      </div>

    </form>
  );
};
