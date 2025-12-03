import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  iconColor?: string;
  iconBgColor?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  onClick,
  iconColor = 'text-orange-500',
  iconBgColor = 'bg-orange-100',
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'p-6 hover:shadow-lg transition-all duration-300',
        onClick && 'cursor-pointer hover:-translate-y-1'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconBgColor)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </Card>
  );
}
