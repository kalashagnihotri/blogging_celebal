import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">✨</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BlogPlatform
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A modern blogging platform where writers share their stories, 
              insights, and connect with a global community of readers.
            </p>
            <div className="flex items-center text-gray-400">
              <span>Made with</span>
              <span className="mx-1 text-red-400">❤️</span>
              <span>by developers for writers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  📖 All Posts
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  🏷️ Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  ℹ️ About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  🆘 Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  🔒 Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  📋 Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  📧 Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 BlogPlatform. All rights reserved.
            </div>
            
            {/* Social links */}
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-2xl">
                📱
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-2xl">
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-2xl">
                💼
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-2xl">
                📧
              </a>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-300">📖 Published Posts</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-300">👥 Active Writers</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">10k+</div>
              <div className="text-gray-300">👀 Monthly Readers</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
