import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 dark:border-gray-700/50 mb-8">
            <span className="text-2xl animate-pulse">✨</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Welcome to the future of blogging
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Share Your{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Stories
            </span>
            <br />
            With the World
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            A modern blogging platform where creativity meets technology. 
            Write, share, and connect with readers around the globe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="gradient" 
                  size="lg"
                  className="min-w-[200px]"
                  onClick={() => window.location.href = '/create-post'}
                >
                  ✍️ Start Writing
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="min-w-[200px]"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  📊 View Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="gradient" 
                  size="lg"
                  className="min-w-[200px]"
                  onClick={() => window.location.href = '/register'}
                >
                  🚀 Get Started Free
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="min-w-[200px]"
                  onClick={() => window.location.href = '/login'}
                >
                  📖 Explore Posts
                </Button>
              </>
            )}
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Beautiful Design
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Clean, modern interface that makes writing and reading a pleasure
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optimized performance ensures your content loads instantly
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Global Reach
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with readers and writers from around the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
