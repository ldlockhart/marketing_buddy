import { ReactNode } from 'react';
import { getCardClass } from '../../lib/designSystem';

interface CardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  withBorder?: boolean;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  padding = 'md',
  withBorder = false,
  className = '',
  gradient = false,
  hover = true
}: CardProps) {
  const baseClass = getCardClass(padding, withBorder);
  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  const gradientClass = gradient ? 'bg-gradient-to-br from-white to-neutral-50' : '';

  return (
    <div className={`${baseClass} ${hoverClass} ${gradientClass} ${className}`}>
      {children}
    </div>
  );
}
