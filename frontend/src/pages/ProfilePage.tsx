import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Mail, MapPin, Edit, BarChart3, BookOpen, Heart, Eye } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  role: string;
}

interface UserStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
}

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  views: number;
  likesCount: number;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    if (id) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Use the correct API endpoint for user profile
      const response = await axios.get(`${baseUrl}/api/v1/auth/profile/${id}`, { headers });
      setProfile(response.data.data);
      
      // Fetch stats if available
      if (isOwnProfile && token) {
        try {
          const statsResponse = await axios.get(`${baseUrl}/api/v1/users/stats`, { headers });
          setStats(statsResponse.data.data);
        } catch (statsError) {
          console.log('Stats endpoint not available, calculating from posts');
        }
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Use the correct API endpoint for user posts
      const response = await axios.get(`${baseUrl}/api/v1/posts/user/${id}`, { headers });
      const filteredPosts = response.data.data || [];
      
      setUserPosts(filteredPosts);
      
      // Calculate stats from posts if not available from API
      if (!stats.totalPosts) {
        const calculatedStats = {
          totalPosts: filteredPosts.length,
          totalViews: filteredPosts.reduce((sum: number, post: any) => sum + (post.views || 0), 0),
          totalLikes: filteredPosts.reduce((sum: number, post: any) => sum + (post.likesCount || 0), 0)
        };
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Profile Not Found
          </h2>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The user profile you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className={`rounded-2xl shadow-xl p-8 mb-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar.startsWith('http') ? profile.avatar : `${baseUrl}${profile.avatar}`}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 dark:border-indigo-800"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-indigo-200 dark:border-indigo-800">
                  <span className="text-3xl font-bold text-white">
                    {getAvatarInitials(profile.name)}
                  </span>
                </div>
              )}
              {profile.role === 'admin' && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Admin
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className={`text-3xl font-bold mb-2 md:mb-0 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {profile.name}
                </h1>
                {isOwnProfile && (
                  <Link
                    to={`/profile/${profile._id}/edit`}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 text-sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center md:justify-start text-sm">
                  <Mail className={`w-4 h-4 mr-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {isOwnProfile || currentUser?.role === 'admin' ? profile.email : 'Email hidden'}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-sm">
                  <Calendar className={`w-4 h-4 mr-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Joined {formatDate(profile.createdAt)}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    About
                  </h3>
                  <p className={`leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-xl p-6 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalPosts}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Posts Written
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalViews.toLocaleString()}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Views
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalLikes}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Likes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className={`rounded-2xl shadow-xl p-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isOwnProfile ? 'Your Posts' : `Posts by ${profile.name}`}
            </h2>
            {isOwnProfile && (
              <Link
                to="/create-post"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Write New Post
              </Link>
            )}
          </div>

          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                No posts yet
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                {isOwnProfile ? 'Start sharing your thoughts by writing your first post!' : 'This user hasn\'t written any posts yet.'}
              </p>
              {isOwnProfile && (
                <Link
                  to="/create-post"
                  className="inline-flex items-center mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                  Write Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/posts/${post._id}`}
                  className={`block p-6 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <h3 className={`font-semibold mb-2 line-clamp-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm mb-3 line-clamp-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {post.category}
                    </span>
                    <div className={`flex items-center space-x-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likesCount}
                      </span>
                    </div>
                  </div>
                  <div className={`text-xs mt-2 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {formatDate(post.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
