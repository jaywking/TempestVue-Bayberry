import { Card } from '@/components/Card';

interface WeatherMetricProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: 'up' | 'down';
  className?: string;
  size?: 'default' | 'large';
}

export function WeatherMetric({ 
  icon, 
  value, 
  label,
  trend,
  className = '',
  size = 'default'
}: WeatherMetricProps) {
  const sizeClasses = {
    default: {
      container: 'h-full p-2 md:p-2.5',
      wrapper: 'h-full flex flex-col items-center justify-between gap-2',
      icon: 'text-lg md:text-xl lg:text-2xl flex items-center',
      value: 'text-lg md:text-xl lg:text-2xl flex items-center',
      label: 'text-xs md:text-sm flex items-center'
    },
    large: {
      container: 'h-full p-2.5 md:p-3',
      wrapper: 'h-full flex flex-col items-center justify-between gap-2.5 md:gap-3',
      icon: 'text-xl md:text-2xl lg:text-3xl flex items-center',
      value: 'text-xl md:text-2xl lg:text-3xl flex items-center',
      label: 'text-sm flex items-center'
    }
  };

  return (
    <Card 
      variant="metric" 
      className={`${sizeClasses[size].container} ${className}`}
    >
      <div className={sizeClasses[size].wrapper}>
        <span className={`${sizeClasses[size].icon} opacity-80 flex items-center justify-center`}>
          {icon}
        </span>
        <div className="flex flex-col items-center justify-center">
          <div className={`
            ${sizeClasses[size].value}
            font-medium tracking-tight
            flex items-center justify-center gap-1
          `}>
            {value}
            {trend && (
              <span className={`
                text-base flex items-center
                ${trend === 'up' ? 'text-orange-400' : 'text-blue-400'}
              `}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div className={`
            ${sizeClasses[size].label}
            text-gray-400 mt-1 flex items-center justify-center
          `}>
            {label}
          </div>
        </div>
      </div>
    </Card>
  );
} 