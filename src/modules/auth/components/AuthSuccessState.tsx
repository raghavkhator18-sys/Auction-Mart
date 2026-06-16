import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AuthSuccessStateProps {
  title: string;
  subtitle: string;
}

export const AuthSuccessState: React.FC<AuthSuccessStateProps> = ({ title, subtitle }) => {
  return (
    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-200">
      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
        <CheckCircle2 size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
};
