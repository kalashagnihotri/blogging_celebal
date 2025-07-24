import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ImagePopupProps {
  isOpen: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ isOpen, imageUrl, alt, onClose }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNew = () => {
    window.open(imageUrl, '_blank');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`relative max-w-4xl max-h-full overflow-hidden rounded-lg ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } shadow-2xl`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {alt || 'Image'}
          </h3>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Download image"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleOpenInNew}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex items-center justify-center p-4 max-h-[calc(100vh-120px)]">
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ maxHeight: 'calc(100vh - 160px)' }}
          />
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center ${
          isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
        }`}>
          <p className="text-sm">
            Click outside the image or press ESC to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
