import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageAlt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, imageAlt, onClose }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-[90vh] m-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image Caption */}
        {imageAlt && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 ${
            isDarkMode ? 'bg-gray-900 bg-opacity-80' : 'bg-white bg-opacity-80'
          } backdrop-blur-sm rounded-b-lg`}>
            <p className={`text-center text-sm ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {imageAlt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
