import React from 'react';
import { Link } from 'react-router-dom';

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

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onLike }) => {
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) {
      onLike(post._id);
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
      <Link to={`/posts/${post._id}`} className="block">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm">
                🏷️ {post.category}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt || post.content.substring(0, 150) + '...'}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
              )}
            </div>
          )}

          {/* Author and Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link 
              to={`/profile/${post.author._id}`}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                  {post.author.name}
                </p>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <span className="text-xs">🕒</span>
                  <span className="text-xs">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </div>
            </Link>

            {/* Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <span className="text-sm">👁️</span>
                <span className="text-sm">{post.views}</span>
              </div>
              
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-colors ${
                  isLiked 
                    ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <span className={isLiked ? '❤️' : '🤍'}></span>
                <span>{post.likesCount}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
