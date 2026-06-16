import React from 'react';
import { EmptyState } from '@/shared/components/ui/EmptyState';

interface EmptyListingsStateProps {
  onClearFilters: () => void;
}

export const EmptyListingsState: React.FC<EmptyListingsStateProps> = ({ onClearFilters }) => {
  return (
    <div className="py-16">
      <EmptyState
        title="No Listings Yet"
        description="Create your first auction listing to start selling."
        actionText="Clear Filters"
        onAction={onClearFilters}
      />
    </div>
  );
};
