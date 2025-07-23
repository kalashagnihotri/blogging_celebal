import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart,
  BookOpen,
  Users,
  Sparkles 
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 text-primary-400 mr-2" />
              <span className="text-2xl font-heading font-bold">BlogPlatform</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A modern blogging platform where writers share their stories, 
              insights, and connect with a global community of readers.
            </p>
            <div className="flex items-center text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-400" />
              <span>by developers for writers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-400 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Stories & Articles</span>
              </li>
              <li className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Writer Community</span>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Writing Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 BlogPlatform. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
