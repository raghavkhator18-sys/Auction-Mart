import React, { ReactNode } from 'react';

interface AuthHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconBgClass?: string;
  iconBorderClass?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  icon,
  title,
  subtitle,
  iconBgClass = 'bg-blue-600',
  iconBorderClass = 'border-blue-500'
}) => {
  return (
    <div className="text-center space-y-2">
      <div className={`inline-flex w-12 h-12 text-white rounded-2xl items-center justify-center shadow-sm border ${iconBgClass} ${iconBorderClass}`}>
        {icon}
      </div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{subtitle}</p>
    </div>
  );
};
