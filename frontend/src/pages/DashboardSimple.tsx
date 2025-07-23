import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, truncateText } from '../utils/cn';

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: string[];
  likesCount: number;
  views: number;
  imageUrl?: string;
  featured?: boolean;
}

interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  engagementRate: number;
}

const DashboardSimple: React.FC = () => {
  const { user } = useAuth(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    engagementRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchUserPosts();
    fetchDashboardStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/api/posts/user/posts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/api/posts/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${baseUrl}/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(posts.filter(post => post._id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const toggleFeatured = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${baseUrl}/api/posts/${postId}/featured`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, featured: !post.featured }
          : post
      ));
      toast.success('Post featured status updated');
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'featured') return post.featured;
    if (filter === 'draft') return false; // Add draft logic if needed
    return post.category === filter;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return b.views - a.views;
      case 'liked':
        return b.likesCount - a.likesCount;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your posts and track your progress</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            to="/create-post"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            ➕ Create New Post
          </Link>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium">
            ⚙️ Settings
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <div className="text-3xl">📄</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <div className="text-3xl">👁️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Likes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalLikes}</p>
              </div>
              <div className="text-3xl">❤️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Engagement</p>
                <p className="text-3xl font-bold text-gray-900">{stats.engagementRate}%</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Posts</option>
                <option value="featured">Featured</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="liked">Most Liked</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              {sortedPosts.length} post{sortedPosts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't created any posts yet. Start writing your first post!"
                  : "No posts match your current filter. Try adjusting your search criteria."
                }
              </p>
              <Link
                to="/create-post"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center"
              >
                ➕ Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Title</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Published</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Stats</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <Link
                            to={`/post/${post._id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {truncateText(post.title, 50)}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {truncateText(post.content.replace(/<[^>]*>/g, ''), 80)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">📅</span>
                          {formatDate(post.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2">👁️</span>
                            {post.views}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">❤️</span>
                            {post.likesCount}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleFeatured(post._id)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            post.featured
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {post.featured ? '⭐ Featured' : '⭐ Feature'}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/edit-post/${post._id}`}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSimple;
