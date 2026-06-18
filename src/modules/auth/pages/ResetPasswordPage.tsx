import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { AuthHeader } from '../components/AuthHeader';
import { AuthSuccessState } from '../components/AuthSuccessState';
import { getFriendlyAuthError } from '../utils/authErrorMessages';

type ResetStatus = 'checking' | 'ready' | 'invalid' | 'success';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState<ResetStatus>('checking');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    let invalidLinkTimer: ReturnType<typeof setTimeout> | undefined;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (data.session) {
        setStatus('ready');
        return;
      }

      invalidLinkTimer = setTimeout(async () => {
        const { data: latestData } = await supabase.auth.getSession();
        if (isMounted) {
          setStatus(latestData.session ? 'ready' : 'invalid');
        }
      }, 800);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        if (invalidLinkTimer) clearTimeout(invalidLinkTimer);
        setStatus('ready');
        setErrorMsg('');
      }
    });

    return () => {
      isMounted = false;
      if (invalidLinkTimer) clearTimeout(invalidLinkTimer);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Your passkey must be at least 6 characters long.');
      return;
    }

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

      setStatus('success');
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

  const isSuccess = status === 'success';
  const isInvalid = status === 'invalid';

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      <AuthHeader
        icon={isSuccess ? <CheckCircle2 size={32} /> : <KeyRound size={24} />}
        title={isSuccess ? 'Passkey Updated' : 'Set New Passkey'}
        subtitle={isSuccess ? 'You can now sign in with your new passkey.' : 'Choose a new passkey for your AuctionMart account.'}
        iconBgClass={isSuccess ? 'bg-emerald-500' : 'bg-blue-600'}
        iconBorderClass={isSuccess ? 'border-emerald-400' : 'border-blue-500'}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden p-6 relative">
        {isSuccess ? (
          <AuthSuccessState
            title="Passkey Updated"
            subtitle="Routing you back to sign in..."
          />
        ) : isInvalid ? (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded-xl font-medium border border-amber-100">
              This reset link is invalid or has expired. Please request a new one.
            </div>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              Request New Link <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100">
                {errorMsg}
              </div>
            )}

            {status === 'checking' && (
              <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-xl font-medium border border-blue-100">
                Checking your reset link...
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">New Password</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><Lock size={14} /></span>
                <input
                  id="reset-new-password-input"
                  type="password"
                  required
                  minLength={6}
                  disabled={status !== 'ready'}
                  placeholder="Enter a new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><Lock size={14} /></span>
                <input
                  id="reset-confirm-password-input"
                  type="password"
                  required
                  minLength={6}
                  disabled={status !== 'ready'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 disabled:opacity-60"
                />
              </div>
            </div>

            <button
              id="reset-update-password-btn"
              type="submit"
              disabled={loading || status !== 'ready'}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Update Password'} <ArrowRight size={13} />
            </button>

            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="w-full py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft size={12} /> Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
