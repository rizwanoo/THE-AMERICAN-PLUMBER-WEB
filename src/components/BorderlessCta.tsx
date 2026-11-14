import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface BorderlessCtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  tone?: 'light' | 'dark' | 'blue' | 'aqua' | 'lime';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const TONE_CLASSES: Record<NonNullable<BorderlessCtaProps['tone']>, string> = {
  light: 'text-white hover:text-[#F2C45C]',
  dark: 'text-[#303B43] hover:text-[#2457F5]',
  blue: 'text-[#2457F5] hover:text-[#18B9B0]',
  aqua: 'text-[#18B9B0] hover:text-[#2457F5]',
  lime: 'text-[#D7F34A] hover:text-white',
};

const SIZE_CLASSES: Record<NonNullable<BorderlessCtaProps['size']>, string> = {
  sm: 'text-xs sm:text-sm',
  md: 'text-sm sm:text-base',
  lg: 'text-base sm:text-lg',
};

export const BorderlessCta: React.FC<BorderlessCtaProps> = ({
  label,
  onClick,
  href,
  external = false,
  tone = 'dark',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const classes = `cta-link ${external ? 'cta-link-diag' : ''} ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]} ${
    disabled ? 'opacity-50 pointer-events-none' : ''
  } ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={(e) => {
          if (!external && onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        className={classes}
      >
        <span>{label}</span>
        <Icon className="w-4 h-4 cta-arrow" aria-hidden="true" />
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      <span>{label}</span>
      <Icon className="w-4 h-4 cta-arrow" aria-hidden="true" />
    </button>
  );
};
