import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Heart, 
  Eye, 
  Edit3,
  Settings,
  MapPin,
  Globe,
  Twitter,
  Github,
  Linkedin
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  createdAt: string;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  followers: number;
  following: number;
}

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  views: number;
  likesCount: number;
  createdAt: string;
  image?: string;
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  const isOwnProfile = currentUser && currentUser.id === userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // If no userId provided, show current user's profile
        const targetUserId = userId || currentUser?.id;
        
        if (!targetUserId) {
          setError('User ID is required to view profile');
          setLoading(false);
          return;
        }

        console.log('Fetching profile for user ID:', targetUserId); // Debug log

        // Fetch user profile
        const profileResponse = await axios.get(`${baseUrl}/api/v1/auth/profile/${targetUserId}`);
        
        // Fetch user's posts
        const postsResponse = await axios.get(`${baseUrl}/api/v1/posts/user/${targetUserId}`);
        
        if (profileResponse.data.success) {
          const profile = profileResponse.data.data;
          const posts = postsResponse.data.data || [];
          
          // Calculate stats
          const totalViews = posts.reduce((acc: number, post: Post) => acc + (post.views || 0), 0);
          const totalLikes = posts.reduce((acc: number, post: Post) => acc + (post.likesCount || 0), 0);
          
          setUserProfile({
            ...profile,
            totalPosts: posts.length,
            totalViews,
            totalLikes,
            followers: 0, // TODO: Implement followers system
            following: 0  // TODO: Implement following system
          });
          
          setUserPosts(posts);
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser, baseUrl]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header Section */}
      <div className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={userProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&size=128&background=6366f1&color=ffffff`}
                alt={userProfile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
              />
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h1 className="text-3xl font-bold mb-2 sm:mb-0">{userProfile.name}</h1>
                {isOwnProfile && (
                  <Link
                    to="/edit-profile"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Link>
                )}
              </div>

              {/* Bio */}
              {userProfile.bio && (
                <p className={`text-lg mb-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {userProfile.bio}
                </p>
              )}

              {/* Basic Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {userProfile.email}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Joined {formatDate(userProfile.createdAt)}
                  </span>
                </div>
                {userProfile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {userProfile.location}
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                {userProfile.website && (
                  <a
                    href={userProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {userProfile.twitter && (
                  <a
                    href={`https://twitter.com/${userProfile.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {userProfile.github && (
                  <a
                    href={`https://github.com/${userProfile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {userProfile.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${userProfile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className={`text-center p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-2xl font-bold text-indigo-600">
                {userProfile.totalPosts}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Posts
              </div>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-2xl font-bold text-green-600">
                {userProfile.totalViews}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Views
              </div>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-2xl font-bold text-red-600">
                {userProfile.totalLikes}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Likes
              </div>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-2xl font-bold text-purple-600">
                {userProfile.followers}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Followers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-indigo-500 text-indigo-600'
                  : `border-transparent ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`
              }`}
            >
              Posts ({userProfile.totalPosts})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-indigo-500 text-indigo-600'
                  : `border-transparent ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`
              }`}
            >
              About
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'posts' && (
          <div>
            {userPosts.length > 0 ? (
              <div className="grid gap-6">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className={`p-6 rounded-lg border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <Link
                          to={`/posts/${post._id}`}
                          className="text-xl font-semibold hover:text-indigo-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                        <p className={`mt-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {post.excerpt}
                        </p>
                      </div>
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-24 h-16 object-cover rounded ml-4"
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded">
                          {post.category}
                        </span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likesCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } mb-8`}>
                  {isOwnProfile 
                    ? "You haven't written any posts yet. Start sharing your thoughts!"
                    : "This user hasn't published any posts yet."
                  }
                </p>
                {isOwnProfile && (
                  <Link
                    to="/create-post"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Write Your First Post
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8">
            {/* About Section */}
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="text-lg font-semibold mb-4">About {userProfile.name}</h3>
              {userProfile.bio ? (
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {userProfile.bio}
                </p>
              ) : (
                <p className={`italic ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {isOwnProfile 
                    ? "Add a bio to tell people about yourself."
                    : "This user hasn't added a bio yet."
                  }
                </p>
              )}
            </div>

            {/* Account Details */}
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Account Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  <span>Member since {formatDate(userProfile.createdAt)}</span>
                </div>
                {userProfile.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    <span>{userProfile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Stats */}
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Activity</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {userProfile.totalPosts}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Posts Published
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userProfile.totalViews}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Total Views
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {userProfile.totalLikes}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Total Likes
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
