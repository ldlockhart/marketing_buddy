import { ReactNode, ButtonHTMLAttributes } from 'react';
import { getButtonClass } from '../../lib/designSystem';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const buttonClass = getButtonClass(variant, size);
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${buttonClass} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
