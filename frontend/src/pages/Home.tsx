import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Users, 
  BarChart3, 
  PenTool, 
  Sparkles, 
  Filter,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalWriters: 100,
    totalReaders: 1000
  });

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  
  // Categories for filtering
  const categories = [
    'Technology', 
    'Design', 
    'Travel', 
    'Lifestyle', 
    'Business', 
    'Health',
    'Food',
    'Science'
  ];

  // Fetch basic stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch platform stats from the dedicated endpoint
        const response = await axios.get(`${baseUrl}/api/v1/auth/stats`);
        if (response.data && response.data.success) {
          setStats({
            totalPosts: response.data.data.totalPosts || 0,
            totalWriters: response.data.data.totalUsers || 0,
            totalReaders: response.data.data.totalViews || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values if API fails
      }
    };

    fetchStats();
  }, [baseUrl]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to For You page with search parameters
    window.location.href = `/for-you?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`;
  };

  const handleCategoryFilter = (category: string) => {
    // Navigate to For You page with category filter
    window.location.href = `/for-you?category=${encodeURIComponent(category)}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-hidden ${
      isDarkMode 
        ? 'bg-[#0f172a] text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900'
    }`}>
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${
            isDarkMode ? 'bg-purple-400/10' : 'bg-purple-400/20'
          }`}></div>
          <div className={`absolute top-40 right-10 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? 'bg-pink-500/10' : 'bg-pink-500/20'
          }`}></div>
          <div className={`absolute bottom-20 left-1/2 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode ? 'bg-yellow-400/10' : 'bg-yellow-400/20'
          }`}></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Floating Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                BlogPlatform
              </span>
            </h1>

            {/* Subtext */}
            <p className={`text-lg sm:text-xl lg:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Discover amazing stories, share your thoughts, and connect with writers worldwide.
              Join our community of passionate storytellers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to={isAuthenticated ? "/create-post" : "/register"}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                aria-label={isAuthenticated ? "Write a new story" : "Register to write stories"}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <PenTool className="w-5 h-5 mr-2" />
                  Write a Story
                </div>
              </Link>

              <Link
                to="/for-you"
                className={`group px-8 py-4 backdrop-blur-sm border rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50' 
                    : 'bg-white/70 border-gray-200 text-gray-900 hover:bg-white/90'
                }`}
                aria-label="Explore all blog posts"
              >
                <div className="flex items-center justify-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Posts
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Stories Stat */}
              <div className={`backdrop-blur-sm rounded-2xl p-6 text-center border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50' 
                  : 'bg-white/80 border-gray-200/50 hover:border-purple-500/50 shadow-lg'
              }`}>
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalPosts}+
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Stories</div>
              </div>

              {/* Writers Stat */}
              <div className={`backdrop-blur-sm rounded-2xl p-6 text-center border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-pink-500/50' 
                  : 'bg-white/80 border-gray-200/50 hover:border-pink-500/50 shadow-lg'
              }`}>
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalWriters}+
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Writers</div>
              </div>

              {/* Readers Stat */}
              <div className={`backdrop-blur-sm rounded-2xl p-6 text-center border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-yellow-500/50' 
                  : 'bg-white/80 border-gray-200/50 hover:border-yellow-500/50 shadow-lg'
              }`}>
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor(stats.totalReaders / 1000)}K+
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Readers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search + Filter Section */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search for posts, topics, authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 backdrop-blur-sm border rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  aria-label="Search for posts, topics, or authors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl text-white font-medium hover:from-purple-500 hover:to-pink-600 transition-all duration-300"
                  aria-label="Search"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Filters */}
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              <div className={`flex items-center gap-2 flex-shrink-0 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                <Filter className="w-5 h-5" />
                <span className="text-sm font-medium">Categories:</span>
              </div>
              
              <div className="flex gap-3 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                      isDarkMode 
                        ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                    aria-label={`Filter posts by ${category}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Empty State Placeholder */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-400/20 to-pink-500/20 shadow-purple-500/10' 
                : 'bg-gradient-to-r from-purple-400/30 to-pink-500/30 shadow-purple-500/20'
            }`}>
              <BookOpen className={`w-12 h-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Be the first to share a story!
            </h3>
            
            <p className={`text-lg mb-8 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Start your writing journey today and inspire others with your unique perspective and experiences.
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl text-white font-medium hover:from-purple-500 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                  aria-label="Join BlogPlatform"
                >
                  Join BlogPlatform
                </Link>
                <Link
                  to="/login"
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
