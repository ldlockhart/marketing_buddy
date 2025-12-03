import { ReactNode } from 'react';
import { getBadgeClass } from '../../lib/designSystem';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  icon,
  className = ''
}: BadgeProps) {
  const badgeClass = getBadgeClass(variant);

  return (
    <span className={`${badgeClass} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
}
