import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PostCard from '../components/posts/PostCard';
import ButtonEnhanced from '../components/ui/ButtonEnhanced';
import { cn } from '../utils/cn';

// Use the same Post interface as PostCard expects
interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  views: number;
  likesCount: number;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

interface Stats {
  totalPosts: number;
  totalUsers: number;
  totalViews: number;
  engagementRate: number;
}

const HomeProfessional: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPosts: 1250,
    totalUsers: 5400,
    totalViews: 89000,
    engagementRate: 94
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const postsPerPage = 9;

  const categories = [
    { id: 'all', name: 'All Stories', icon: '📚', gradient: 'from-blue-500 to-purple-600' },
    { id: 'Technology', name: 'Technology', icon: '💻', gradient: 'from-cyan-500 to-blue-600' },
    { id: 'Lifestyle', name: 'Lifestyle', icon: '🌟', gradient: 'from-pink-500 to-rose-600' },
    { id: 'Travel', name: 'Travel', icon: '✈️', gradient: 'from-emerald-500 to-teal-600' },
    { id: 'Food', name: 'Food', icon: '🍕', gradient: 'from-orange-500 to-red-600' },
    { id: 'Business', name: 'Business', icon: '💼', gradient: 'from-indigo-500 to-purple-600' },
  ];

  useEffect(() => {
    fetchPosts();
    fetchFeaturedPosts();
  }, [currentPage, selectedCategory, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: postsPerPage.toString(),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axios.get(`${baseUrl}/api/posts?${params}`);
      const fetchedPosts = response.data.posts || [];
      
      // Transform the data to match PostCard interface
      const transformedPosts = fetchedPosts.map((post: any) => ({
        ...post,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        image: post.imageUrl || post.image || `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop`,
        tags: post.tags || [],
        author: {
          ...post.author,
          avatar: post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=6366f1&color=fff`
        }
      }));
      
      setPosts(transformedPosts);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/posts?featured=true&limit=3`);
      const fetchedPosts = response.data.posts || [];
      
      // Transform the data to match PostCard interface
      const transformedPosts = fetchedPosts.map((post: any) => ({
        ...post,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        image: post.imageUrl || post.image || `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop`,
        tags: post.tags || [],
        author: {
          ...post.author,
          avatar: post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=6366f1&color=fff`
        }
      }));
      
      setFeaturedPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${baseUrl}/api/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update both posts and featured posts
      const updatePost = (post: Post) => {
        const isLiked = post.likes.includes(user.id);
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== user.id)
            : [...post.likes, user.id],
          likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
        };
      };

      setPosts(prevPosts => 
        prevPosts.map(post => post._id === postId ? updatePost(post) : post)
      );
      setFeaturedPosts(prevPosts => 
        prevPosts.map(post => post._id === postId ? updatePost(post) : post)
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      {/* Hero Section with Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400/20 rounded-full blur-lg animate-float-delayed" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-pink-400/30 rounded-full blur-md animate-bounce" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-400/20 rounded-full blur-lg animate-pulse" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Theme Toggle */}
            <div className="flex justify-end mb-8">
              <ButtonEnhanced
                variant="glass"
                size="sm"
                rounded="full"
                onClick={toggleDarkMode}
                leftIcon={theme === 'light' ? '🌙' : '☀️'}
                className="backdrop-blur-lg"
              >
                {theme === 'light' ? 'Dark' : 'Light'}
              </ButtonEnhanced>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
                <span className="block animate-fade-in-up">Welcome to</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
                  BlogSpace
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
                Where stories come alive and ideas spark conversations. Join our community of passionate writers and thoughtful readers creating the future of digital storytelling.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-600">
              <Link to="/create-post">
                <ButtonEnhanced
                  variant="glow"
                  size="lg"
                  rounded="full"
                  glow={true}
                  leftIcon="✨"
                  className="text-lg font-semibold px-12 py-4"
                >
                  Start Writing
                </ButtonEnhanced>
              </Link>
              
              <ButtonEnhanced
                variant="glass"
                size="lg"
                rounded="full"
                onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}
                rightIcon="📖"
                className="text-lg font-semibold px-12 py-4 backdrop-blur-lg"
              >
                Discover Stories
              </ButtonEnhanced>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in-up animation-delay-800">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stats.totalPosts.toLocaleString()}+
                </div>
                <div className="text-gray-300 text-lg">Stories Published</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stats.totalUsers.toLocaleString()}+
                </div>
                <div className="text-gray-300 text-lg">Active Writers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {(stats.totalViews / 1000).toFixed(0)}K+
                </div>
                <div className="text-gray-300 text-lg">Monthly Reads</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats.engagementRate}%</div>
                <div className="text-gray-300 text-lg">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                ⭐ Featured Stories
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Handpicked stories that inspire, educate, and captivate our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <div
                  key={post._id}
                  className="transform hover:scale-105 transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
                    <div className="relative">
                      <PostCard
                        post={post}
                        currentUserId={user?.id}
                        onLike={handleLike}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Discover Section */}
      <section id="discover" className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              🔍 Discover Amazing Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Explore thousands of stories across various topics. Find exactly what you're looking for with our advanced search and filtering system.
            </p>

            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500" />
                <div className="relative flex rounded-full bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center pl-6">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for stories, topics, or authors..."
                    className="flex-1 px-6 py-6 text-lg bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <ButtonEnhanced
                    type="submit"
                    variant="primary"
                    size="lg"
                    rounded="full"
                    className="m-2 px-8"
                  >
                    Search
                  </ButtonEnhanced>
                </div>
              </div>
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category, index) => (
                <ButtonEnhanced
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'glass'}
                  size="md"
                  rounded="full"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
                  leftIcon={category.icon}
                  glow={selectedCategory === category.id}
                  className={`
                    transition-all duration-300 animate-fade-in-up
                    ${selectedCategory === category.id ? `bg-gradient-to-r ${category.gradient}` : ''}
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {category.name}
                </ButtonEnhanced>
              ))}
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="text-sm text-gray-600 dark:text-gray-400">Active filters:</div>
                {searchTerm && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
                    🔍 "{searchTerm}"
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium">
                    📂 {categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                )}
                <ButtonEnhanced
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  leftIcon="✖️"
                  className="text-red-600 hover:text-red-700"
                >
                  Clear all
                </ButtonEnhanced>
              </div>
            )}
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">😔</div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No stories found</h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {searchTerm || selectedCategory !== 'all'
                  ? "We couldn't find any stories matching your criteria. Try adjusting your search or explore different categories."
                  : "Be the first to share your story with our community and inspire others!"}
              </p>
              <div className="flex gap-4 justify-center">
                {(searchTerm || selectedCategory !== 'all') && (
                  <ButtonEnhanced
                    variant="secondary"
                    size="lg"
                    onClick={resetFilters}
                    leftIcon="🔄"
                  >
                    Show All Stories
                  </ButtonEnhanced>
                )}
                <Link to="/create-post">
                  <ButtonEnhanced
                    variant="primary"
                    size="lg"
                    leftIcon="✍️"
                    glow
                  >
                    Write Your Story
                  </ButtonEnhanced>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {posts.map((post, index) => (
                  <div
                    key={post._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-500" />
                      <div className="relative">
                        <PostCard
                          post={post}
                          currentUserId={user?.id}
                          onLike={handleLike}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <ButtonEnhanced
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    leftIcon="⬅️"
                  >
                    Previous
                  </ButtonEnhanced>
                  
                  <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <ButtonEnhanced
                          key={page}
                          variant={currentPage === page ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-12 h-12"
                        >
                          {page}
                        </ButtonEnhanced>
                      );
                    })}
                  </div>

                  <ButtonEnhanced
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    rightIcon="➡️"
                  >
                    Next
                  </ButtonEnhanced>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to Share Your Story? ✨
          </h2>
          <p className="text-2xl text-gray-200 mb-12 leading-relaxed">
            Join thousands of writers who are already creating, sharing, and inspiring others with their unique perspectives and experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/create-post">
              <ButtonEnhanced
                variant="glow"
                size="xl"
                rounded="full"
                glow
                leftIcon="🚀"
                className="text-xl font-bold px-16 py-6"
              >
                Start Writing Today
              </ButtonEnhanced>
            </Link>
            <Link to="/register">
              <ButtonEnhanced
                variant="glass"
                size="xl"
                rounded="full"
                rightIcon="👥"
                className="text-xl font-bold px-16 py-6 backdrop-blur-lg"
              >
                Join Community
              </ButtonEnhanced>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeProfessional;
