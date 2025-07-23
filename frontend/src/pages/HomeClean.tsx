import React from 'react';

const HomeClean: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Clean Home Design
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            A minimal and clean approach to the home page
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Welcome to Our Clean Blog
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                This is a clean, minimal design variation for the home page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeClean;