import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, X, Image as ImageIcon, Crop as CropIcon, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ImageCropperProps {
  onImageUpload: (imageUrl: string) => void;
  uploadType: 'blog' | 'profile';
  currentImage?: string;
  className?: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  onImageUpload,
  uploadType,
  currentImage,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [showCropper, setShowCropper] = useState(false);
  const [srcImage, setSrcImage] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: uploadType === 'profile' ? 100 : 80,
    height: uploadType === 'profile' ? 100 : 60,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const { isDarkMode } = useTheme();

  // Create circular crop for profile pictures
  const circularCrop: Crop = {
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const reader = new FileReader();
    reader.onload = () => {
      setSrcImage(reader.result as string);
      setShowCropper(true);
      setCrop(uploadType === 'profile' ? circularCrop : crop);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImage = useCallback((
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string = 'cropped-image.jpg'
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to crop size
    canvas.width = crop.width;
    canvas.height = crop.height;

    // For profile pictures, make the canvas circular
    if (uploadType === 'profile') {
      // Make it square for circular crop
      const size = Math.min(crop.width, crop.height);
      canvas.width = size;
      canvas.height = size;
      
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.clip();
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/jpeg', 0.95);
    });
  }, [uploadType]);

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    try {
      setIsUploading(true);
      const croppedImageBlob = await getCroppedImage(imgRef.current, completedCrop);
      
      // Upload the cropped image
      const formData = new FormData();
      formData.append('image', croppedImageBlob, 'cropped-image.jpg');

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
        setShowCropper(false);
        setSrcImage('');
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

  const removeImage = () => {
    setPreviewUrl('');
    onImageUpload('');
    setShowCropper(false);
    setSrcImage('');
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setSrcImage('');
  };

  if (showCropper) {
    return (
      <div className={`${className} p-4`}>
        <div className={`border-2 border-dashed rounded-lg p-4 ${
          isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
        }`}>
          <h4 className={`text-lg font-medium mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {uploadType === 'profile' ? 'Crop Your Profile Picture' : 'Crop Your Image'}
          </h4>
          
          <div className="mb-4">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={uploadType === 'profile' ? 1 : undefined}
              circularCrop={uploadType === 'profile'}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                alt="Crop source"
                src={srcImage}
                style={{ maxHeight: '400px', maxWidth: '100%' }}
                onLoad={() => {
                  // Auto-set crop when image loads
                  if (uploadType === 'profile') {
                    setCrop(circularCrop);
                  }
                }}
              />
            </ReactCrop>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCropComplete}
              disabled={isUploading || !completedCrop}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply & Upload
                </>
              )}
            </button>
            
            <button
              onClick={cancelCrop}
              disabled={isUploading}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              className={`mx-auto rounded-lg max-h-48 cursor-pointer hover:opacity-80 transition-opacity ${
                uploadType === 'profile' ? 'w-24 h-24 rounded-full object-cover' : 'object-contain'
              }`}
              onClick={() => {
                // Open image in popup (will implement this next)
                console.log('Image clicked for popup view');
              }}
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
            <div className="mb-4">
              {uploadType === 'profile' ? (
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
              ) : (
                <ImageIcon className={`mx-auto w-12 h-12 mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
              )}
            </div>
            <p className={`text-sm mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {uploadType === 'profile' ? 'Upload Profile Picture' : 'Upload Blog Image'}
            </p>
            <p className={`text-xs mb-3 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              JPG, PNG, GIF up to {uploadType === 'profile' ? '5MB' : '10MB'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <CropIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Click to upload & crop</span>
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ImageCropper;
