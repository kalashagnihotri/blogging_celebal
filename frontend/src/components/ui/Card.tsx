import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'gradient' | 'glass';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl ${className}`}>
    {children}
  </div>
);

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Content: React.FC<CardContentProps>;
  Footer: React.FC<CardFooterProps>;
} = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  padding = 'md'
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg border border-gray-100',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const hoverEffect = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1' : '';

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
