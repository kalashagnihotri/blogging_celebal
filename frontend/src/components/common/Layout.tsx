import React from 'react';
import NavbarClean from '../common/NavbarClean';
import FooterClean from '../common/FooterClean';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <FooterClean />
    </div>
  );
};

export default Layout;
