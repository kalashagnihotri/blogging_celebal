import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 
        hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDarkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
        }
        group overflow-hidden
      `}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`
        transition-all duration-500 text-2xl
        ${isDarkMode ? 'rotate-180' : 'rotate-0'}
      `}>
        {isDarkMode ? '🌙' : '☀️'}
      </div>
      
      {/* Animated background */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
          : 'bg-gradient-to-br from-yellow-400 to-orange-500'
        }
      `} />
    </button>
  );
};

export default DarkModeToggle;
