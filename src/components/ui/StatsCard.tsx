import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card.tsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
  iconBgColor?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient = 'from-primary-500 to-secondary-500',
  iconBgColor = 'bg-primary-100'
}: StatsCardProps) {
  return (
    <Card padding="lg" hover className="group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${iconBgColor} group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-primary-600 w-6 h-6">
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}
