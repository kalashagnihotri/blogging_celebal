import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  PhotoIcon, 
  XMarkIcon,
  EyeIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  image: File | null;
}

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const categories = [
    'tech', 'life', 'travel', 'food', 'business', 'health', 'other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('excerpt', formData.excerpt || formData.content.substring(0, 150));
      formDataToSend.append('category', formData.category || 'other');
      
      // Process tags - send as comma-separated string, let backend handle the parsing
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (tagsArray.length > 0) {
        formDataToSend.append('tags', tagsArray.join(','));
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.post(`${baseUrl}/api/v1/posts`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Post created successfully!');
      navigate('/dashboard'); // Navigate to dashboard instead of post detail
    } catch (error: any) {
      console.error('Create post error:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
        {formData.title || 'Your Post Title'}
      </h1>
      
      {previewImage && (
        <img
          src={previewImage}
          alt="Post preview"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
        {formData.category && (
          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full capitalize">
            {formData.category}
          </span>
        )}
        {formData.tags && (
          <div className="flex space-x-1">
            {formData.tags.split(',').map((tag, index) => (
              <span key={index} className="text-gray-600 dark:text-gray-400">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
        {formData.content || 'Start writing your content...'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                Create New Post
              </h1>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                    activeTab === 'write'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'write' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your post title..."
                    required
                  />
                </div>

                {/* Category and Tags Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category} className="capitalize">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="react, javascript, tutorial (comma separated)"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate tags with commas</p>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Featured Image
                  </label>
                  
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-700"
                    >
                      <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Brief description of your post (optional - will be auto-generated if left empty)"
                  />
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Write your post content here..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Publishing...' : 'Publish Post'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="min-h-[600px]">
                {renderPreview()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
