import { useEffect, useRef, useState } from 'react';

export default function StatsCard({ icon: Icon, label, value, trend, trendValue, color = 'green', prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const target = typeof value === 'number' ? value : parseInt(value) || 0;
    if (target === 0) { setDisplayValue(0); return; }
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (n) => {
    if (n >= 10000000) return (n / 10000000).toFixed(2) + ' Cr';
    if (n >= 100000) return (n / 100000).toFixed(2) + ' L';
    if (n >= 1000) return n.toLocaleString('en-IN');
    return n;
  };

  return (
    <div className={`stat-card ${color}`} ref={ref}>
      <div className="stat-card-icon">
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">
        {prefix}{formatNumber(displayValue)}{suffix}
      </div>
      {trend && (
        <div className={`stat-card-trend ${trend}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </div>
      )}
    </div>
  );
}
