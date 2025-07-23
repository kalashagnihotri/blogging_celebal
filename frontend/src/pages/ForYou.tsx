import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Eye,
  Heart,
  MessageCircle,
  Clock,
  User
} from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
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

const ForYou: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const categories = ['all', 'tech', 'life', 'travel', 'food', 'business', 'health', 'other'];

  useEffect(() => {
    fetchPosts();
  }, [currentPage, filter]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: 12,
        sort: '-createdAt'
      };

      if (filter !== 'all') {
        params.category = filter;
      }

      const response = await axios.get(`${baseUrl}/api/v1/posts`, { params });
      setPosts(response.data.data || []);
      setTotalPages(Math.ceil((response.data.total || 0) / 12));
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">For You</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Discover amazing content from our community</p>
        </div>

        {/* Filter Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setFilter(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {category === 'all' ? 'All Posts' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? "No posts available yet. Be the first to share something!"
                : "No posts found in this category. Try a different filter."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Post Image */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                  <img
                    src={
                      post.image && post.image !== 'default-post.jpg'
                        ? `${baseUrl}/uploads/${post.image}`
                        : '/api/placeholder/400/240'
                    }
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    <Link 
                      to={`/posts/${post._id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt || truncateText(post.content.replace(/<[^>]*>/g, ''), 120)}
                  </p>

                  {/* Author & Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          post.author.avatar && post.author.avatar !== 'default-avatar.png' && post.author.avatar.startsWith('http')
                            ? post.author.avatar
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&size=32&background=6366f1&color=ffffff`
                        }
                        alt={post.author.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likesCount}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForYou;
