import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface OtpFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  errorMsg: string;
  otp: string;
  setOtp: (val: string) => void;
  loading: boolean;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  handleSubmit, errorMsg, otp, setOtp, loading
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100">
          {errorMsg}
        </div>
      )}
      
      <div className="space-y-1">
        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide">Enter Verification Code</label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-400"><ShieldCheck size={14} /></span>
          <input
            id="auth-otp-input"
            type="text"
            required
            placeholder="Enter 4-digit code"
            maxLength={4}
            value={otp}
            onChange={(e) => {
              e.target.setCustomValidity('');
              setOtp(e.target.value);
            }}
            onInvalid={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.validity.valueMissing) {
                target.setCustomValidity('Please enter the 4-digit verification code sent to your email.');
              } else if (target.value.length < 4) {
                target.setCustomValidity('Verification code must contain 4 digits.');
              } else {
                target.setCustomValidity('');
              }
            }}
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50"
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
  );
};
