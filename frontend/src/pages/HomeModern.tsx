import React from 'react';

const HomeModern: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Modern Blog Platform
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Experience the future of blogging with our modern, dynamic platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Modern Design</h3>
              <p className="text-blue-100">Cutting-edge UI with modern aesthetics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Fast Performance</h3>
              <p className="text-blue-100">Lightning-fast loading and interactions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Responsive</h3>
              <p className="text-blue-100">Perfect on all devices and screen sizes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeModern;