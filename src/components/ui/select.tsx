import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  useId,
} from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextType {
  value: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  labels: Record<string, string>;
  registerLabel: (value: string, label: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentId: string;
  triggerId: string;
}

const SelectContext = createContext<SelectContextType | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select compound components must be used within a <Select>');
  }
  return context;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const baseId = useId();
  const triggerId = `select-trigger-${baseId}`;
  const contentId = `select-content-${baseId}`;

  const isValueControlled = controlledValue !== undefined;
  const currentValue = isValueControlled ? controlledValue : internalValue;

  const isOpenControlled = controlledOpen !== undefined;
  const currentOpen = isOpenControlled ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean | ((prev: boolean) => boolean)) => {
      const resolved = typeof nextOpen === 'function' ? nextOpen(currentOpen) : nextOpen;
      if (!isOpenControlled) {
        setInternalOpen(resolved);
      }
      onOpenChange?.(resolved);
    },
    [currentOpen, isOpenControlled, onOpenChange]
  );

  const handleValueChange = useCallback(
    (newVal: string) => {
      if (!isValueControlled) {
        setInternalValue(newVal);
      }
      onValueChange?.(newVal);
      handleOpenChange(false);
    },
    [isValueControlled, onValueChange, handleOpenChange]
  );

  const registerLabel = useCallback((val: string, label: string) => {
    setLabels((prev) => {
      if (prev[val] === label) return prev;
      return { ...prev, [val]: label };
    });
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open: currentOpen,
        setOpen: handleOpenChange,
        labels,
        registerLabel,
        triggerRef,
        contentId,
        triggerId,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, id, ...props }, forwardedRef) => {
    const { open, setOpen, triggerRef, contentId, triggerId } = useSelectContext();

    const mergedRef = (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    return (
      <button
        ref={mergedRef}
        type="button"
        id={id || triggerId}
        role="combobox"
        aria-controls={contentId}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-12 w-full max-w-[288px] items-center justify-between rounded-[14px] px-4 py-2 text-sm font-medium transition-all duration-150 ease-in-out cursor-pointer',
          // Light Mode
          'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
          // Dark Mode (Classic Dark Theme)
          'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700/80 dark:hover:border-slate-600 dark:hover:bg-slate-800/80',
          'dark:focus:ring-slate-500/20 dark:focus:border-slate-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        <span className="truncate text-left flex-1 mr-2">{children}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200 ease-out',
            'text-slate-400 dark:text-zinc-400',
            open && 'rotate-180 text-slate-900 dark:text-white'
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className }) => {
  const { value, labels } = useSelectContext();
  const displayText = labels[value] || value;

  return (
    <span
      className={cn(
        'block truncate',
        !displayText && placeholder ? 'text-slate-400 dark:text-zinc-500' : 'text-slate-900 dark:text-white',
        className
      )}
    >
      {displayText || placeholder || ''}
    </span>
  );
};

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  position?: 'popper' | 'item-aligned';
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, triggerRef, contentId, triggerId } = useSelectContext();
    const contentRef = useRef<HTMLDivElement | null>(null);

    // Close on click outside & Escape
    useEffect(() => {
      if (!open) return;

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false);
          triggerRef.current?.focus();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id={contentId}
        role="listbox"
        aria-labelledby={triggerId}
        className={cn(
          'absolute left-0 top-full mt-2 w-full max-w-[288px] z-50 overflow-hidden',
          'rounded-[14px] p-1.5 shadow-xl',
          // Light Mode
          'bg-white border border-slate-200 text-slate-900 shadow-slate-900/10',
          // Dark Mode (Classic Dark Theme)
          'dark:bg-slate-800 dark:border-slate-700/80 dark:text-slate-100 dark:shadow-2xl',
          'animate-in fade-in-0 zoom-in-95 duration-150 ease-out',
          className
        )}
        {...props}
      >
        <div className="max-h-60 overflow-y-auto overflow-x-hidden space-y-0.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent pr-0.5">
          {children}
        </div>
      </div>
    );
  }
);
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, disabled = false, className, ...props }, ref) => {
    const { value: selectedValue, onValueChange, registerLabel } = useSelectContext();
    const isSelected = selectedValue === value;

    useEffect(() => {
      if (typeof children === 'string') {
        registerLabel(value, children);
      }
    }, [value, children, registerLabel]);

    const handleSelect = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onValueChange?.(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (disabled) return;
        onValueChange?.(value);
      }
    };

    return (
      <div
        ref={ref}
        role="option"
        tabIndex={disabled ? -1 : 0}
        aria-selected={isSelected}
        aria-disabled={disabled}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center justify-between rounded-[10px] px-3 py-2 text-sm outline-none transition-colors duration-100',
          // Light Mode
          'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900',
          isSelected && 'bg-slate-100 text-slate-900 font-semibold',
          // Dark Mode (Classic Dark Theme)
          'dark:text-slate-300 dark:hover:bg-slate-700/60 dark:hover:text-white dark:focus:bg-slate-700/60 dark:focus:text-white',
          isSelected && 'dark:bg-slate-700/70 dark:text-white dark:font-medium',
          disabled && 'pointer-events-none opacity-40',
          className
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {isSelected && (
          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" strokeWidth={2.5} />
        )}
      </div>
    );
  }
);
SelectItem.displayName = 'SelectItem';

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({ children, className, ...props }) => (
  <div className={cn('p-1', className)} role="group" {...props}>
    {children}
  </div>
);

export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const SelectLabel: React.FC<SelectLabelProps> = ({ children, className, ...props }) => (
  <div
    className={cn(
      'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider',
      'text-slate-500 dark:text-zinc-400',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const SelectSeparator: React.FC<SelectSeparatorProps> = ({ className, ...props }) => (
  <div
    className={cn(
      '-mx-1 my-1 h-px',
      'bg-slate-150 dark:bg-white/10',
      className
    )}
    role="separator"
    {...props}
  />
);
