import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  BookOpen, 
  Users, 
  BarChart3, 
  PenTool, 
  Sparkles, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/posts/PostCard';

// Skeleton component for loading state
const PostCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

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
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user, isAuthenticated } = useAuth();
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const categories = ['technology', 'design', 'lifestyle', 'travel', 'food', 'business'];

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory })
      });

      const response = await axios.get(`${baseUrl}/api/posts?${query}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, currentPage, searchTerm, selectedCategory]);

  const fetchFeaturedPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/posts?featured=true&limit=3`);
      setFeaturedPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchPosts();
    fetchFeaturedPosts();
  }, [fetchPosts, fetchFeaturedPosts]);

  const handleLike = async (postId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to like posts');
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update the post in the current list
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            const isLiked = post.likes.includes((user as any)._id);
            return {
              ...post,
              likes: isLiked 
                ? post.likes.filter(id => id !== (user as any)._id)
                : [...post.likes, (user as any)._id],
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
            };
          }
          return post;
        })
      );

      // Update featured posts if the liked post is in featured
      setFeaturedPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            const isLiked = post.likes.includes((user as any)._id);
            return {
              ...post,
              likes: isLiked 
                ? post.likes.filter(id => id !== (user as any)._id)
                : [...post.likes, (user as any)._id],
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
            };
          }
          return post;
        })
      );
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-primary via-blue-600 to-purple-700 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
        </div>

        <div className="container py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Welcome to <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">BlogPlatform</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed"
            >
              Discover amazing stories, share your thoughts, and connect with writers worldwide.
              Join our community of passionate storytellers.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex justify-center space-x-8 mb-8"
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 mr-2" />
                  <span className="text-2xl font-bold">{posts.length}+</span>
                </div>
                <p className="text-blue-200 text-sm">Stories</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 mr-2" />
                  <span className="text-2xl font-bold">100+</span>
                </div>
                <p className="text-blue-200 text-sm">Writers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  <span className="text-2xl font-bold">1K+</span>
                </div>
                <p className="text-blue-200 text-sm">Readers</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-x-4"
            >
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="btn btn-lg bg-white text-primary hover:bg-gray-100"
                  >
                    <PenTool className="w-5 h-5 mr-2" />
                    Start Writing
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-lg btn-secondary border-2 border-white text-white hover:bg-white hover:text-primary"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/create"
                  className="btn btn-lg bg-white text-primary hover:bg-gray-100"
                >
                  <PenTool className="w-5 h-5 mr-2" />
                  Write New Post
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <section className="container py-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for posts, topics, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 pr-4 h-12 text-lg"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary btn-sm">
                Search
              </button>
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === ''
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="container py-8 border-b border-gray-200"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Stories</h2>
            <p className="text-gray-600">Handpicked stories from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.slice(0, 3).map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={(user as any)?._id}
                onLike={handleLike}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Main Posts Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="container py-12"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {searchTerm || selectedCategory ? 'Search Results' : 'Latest Posts'}
          </h2>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setCurrentPage(1);
              }}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <PostCard
                    post={post}
                    currentUserId={(user as any)?._id}
                    onLike={handleLike}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`btn ${
                          currentPage === page ? 'btn-primary' : 'btn-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search criteria' 
                : 'Be the first to share a story!'}
            </p>
            {isAuthenticated && (
              <Link to="/create" className="btn btn-primary">
                <PenTool className="w-4 h-4 mr-2" />
                Write First Post
              </Link>
            )}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default Home;
