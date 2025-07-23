import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  uploadType: 'blog' | 'profile';
  currentImage?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  uploadType,
  currentImage,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const { isDarkMode } = useTheme();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB for profile, 10MB for blog)
    const maxSize = uploadType === 'profile' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size must be less than ${uploadType === 'profile' ? '5MB' : '10MB'}`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const endpoint = uploadType === 'blog' 
        ? '/api/blog/upload-image' 
        : '/api/user/upload-profile';

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setPreviewUrl(data.imageUrl);
        onImageUpload(data.imageUrl);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfilePicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadType === 'profile') {
      handleImageUpload(event);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    onImageUpload('');
  };

  return (
    <div className={`${className}`}>
      <div className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
        isDarkMode 
          ? 'border-gray-600 bg-gray-800 hover:border-gray-500' 
          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
      } transition-colors`}>
        
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className={`mx-auto rounded-lg max-h-48 ${
                uploadType === 'profile' ? 'w-24 h-24 rounded-full object-cover' : 'object-contain'
              }`}
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <ImageIcon className={`mx-auto w-12 h-12 mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <p className={`text-sm mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {uploadType === 'profile' ? 'Upload Profile Picture' : 'Upload Blog Image'}
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              JPG, PNG, GIF up to {uploadType === 'profile' ? '5MB' : '10MB'}
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={uploadType === 'profile' ? handleProfilePicUpload : handleImageUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2 text-white">
              <Upload className="w-5 h-5 animate-pulse" />
              <span>Uploading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
