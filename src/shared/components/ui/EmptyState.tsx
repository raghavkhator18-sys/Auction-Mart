import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 text-neutral-400 border border-neutral-100">
        <PackageOpen size={28} />
      </div>
      <h3 className="text-lg font-medium text-neutral-950 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          id="empty-action-btn"
          onClick={onAction}
          className="bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
