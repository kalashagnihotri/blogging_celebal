import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus,
  Edit, 
  Trash2,
  Eye,
  Heart,
  Calendar 
} from 'lucide-react';

interface UserPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  views: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });

  const { user } = useAuth();
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchUserPosts();
    fetchUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/posts/my-posts`);
      setPosts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch your posts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/users/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/api/v1/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
      fetchUserStats(); // Update stats
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({
    title,
    value,
    icon,
    color
  }) => (
    <div className="bg-white shadow rounded-2xl p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={
                  user?.avatar && user.avatar !== 'default-avatar.png' && user.avatar.startsWith('http')
                    ? user.avatar
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=64&background=6366f1&color=ffffff`
                }
                alt={user?.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="ml-4">
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">Manage your blog posts and track your progress</p>
              </div>
            </div>
            <Link
              to="/create"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Post
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={<Edit className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            icon={<Eye className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Likes"
            value={stats.totalLikes}
            icon={<Heart className="h-6 w-6 text-white" />}
            color="bg-red-500"
          />
        </div>

        {/* Posts Section */}
        <div className="bg-white shadow rounded-2xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-heading font-semibold text-gray-900">Your Posts</h2>
          </div>

          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : posts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          post.image && post.image !== 'default-post.jpg'
                            ? `${baseUrl}/uploads/${post.image}`
                            : '/default-post.jpg'
                        }
                        alt={post.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views} views
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likesCount} likes
                          </span>
                          <span className="capitalize px-2 py-1 text-xs bg-gray-100 rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/posts/${post._id}`}
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                        title="View Post"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/edit/${post._id}`}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Post"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first blog post.
              </p>
              <Link
                to="/create"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
