import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Save, 
  ArrowLeft,
  Upload,
  Camera,
  MapPin,
  Globe,
  Twitter,
  Github,
  Linkedin
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import ImageCropper from '../components/ui/ImageCropper';
import ImageModal from '../components/ui/ImageModal';

interface EditProfileData {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  github: string;
  linkedin: string;
}

const EditProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<EditProfileData>({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        twitter: user.twitter || '',
        github: user.github || '',
        linkedin: user.linkedin || ''
      });
      
      if (user.avatar && user.avatar !== 'default-avatar.png' && user.avatar.startsWith('http')) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user, baseUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      const updateData = {
        ...profileData,
        avatar: avatarPreview || '' // Use the uploaded image URL
      };

      const response = await axios.put(
        `${baseUrl}/api/v1/auth/updatedetails`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update user context
        updateUser(response.data.data);
        
        toast.success('Profile updated successfully!');
        navigate(`/profile/${user?.id}`);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const openImageModal = (imageUrl: string, imageAlt: string) => {
    setModalImageUrl(imageUrl);
    setModalImageAlt(imageAlt);
    setImageModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/profile/${user?.id}`)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className={`p-8 rounded-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
            
            <ImageCropper
              uploadType="profile"
              onImageUpload={(imageUrl: string) => {
                setAvatarPreview(imageUrl);
                setAvatarFile(null); // Clear file since we're using URL now
              }}
              currentImage={avatarPreview}
              className="max-w-md"
            />
          </div>

          {/* Basic Information */}
          <div className={`p-8 rounded-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none`}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className={`p-8 rounded-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h2 className="text-xl font-semibold mb-6">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Twitter
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="twitter"
                    value={profileData.twitter}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="github"
                    value={profileData.github}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/profile/${user?.id}`)}
              className={`px-6 py-3 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        imageUrl={modalImageUrl}
        imageAlt={modalImageAlt}
        onClose={() => setImageModalOpen(false)}
      />
    </div>
  );
};

export default EditProfile;
