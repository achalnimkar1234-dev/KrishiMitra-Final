import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-gray-200 bg-white shadow-card ${className}`}>{children}</div>;
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-xl font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

type BadgeColor = 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'brown';

const badgeColors: Record<BadgeColor, string> = {
  green: 'bg-brand-100 text-brand-700 border-brand-200',
  blue: 'bg-sky-100 text-sky-700 border-sky-200',
  yellow: 'bg-mustard-100 text-mustard-700 border-mustard-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  brown: 'bg-soil-100 text-soil-700 border-soil-200',
};

export function Badge({ children, color = 'gray', className = '' }: { children: ReactNode; color?: BadgeColor; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeColors[color]} ${className}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 border-brand-600',
    secondary: 'bg-mustard-400 text-white hover:bg-mustard-500 border-mustard-400',
    outline: 'bg-white text-brand-700 hover:bg-brand-50 border-brand-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatusPill({ status, label }: { status: 'low' | 'medium' | 'high' | 'adequate' | 'good' | 'moderate' | 'poor'; label: string }) {
  const colors: Record<string, string> = {
    low: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-mustard-100 text-mustard-700 border-mustard-200',
    high: 'bg-brand-100 text-brand-700 border-brand-200',
    adequate: 'bg-brand-100 text-brand-700 border-brand-200',
    good: 'bg-brand-100 text-brand-700 border-brand-200',
    moderate: 'bg-mustard-100 text-mustard-700 border-mustard-200',
    poor: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] || colors.medium}`}>
      {label}
    </span>
  );
}

export function TrendIcon({ trend }: { trend: 'stable' | 'increasing' | 'decreasing' }) {
  if (trend === 'increasing') return <TrendingUp className="h-4 w-4 text-brand-600" />;
  if (trend === 'decreasing') return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4 text-gray-500" />;
}

export function Loading({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />
      <p className="mt-3 text-sm text-gray-500">{label}</p>
    </div>
  );
}

export function EmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">{icon}</div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
