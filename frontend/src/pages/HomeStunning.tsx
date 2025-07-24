import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  image?: string;
}

const HomeStunning: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories] = useState(['Technology', 'Lifestyle', 'Business', 'Health', 'Education', 'Travel']);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory })
      });

      const response = await fetch(`http://localhost:5001/api/v1/posts?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data.posts || []);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Floating Shapes */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-red-500/20 rounded-full blur-2xl animate-bounce"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Stories That
              </span>
              <br />
              <span className="text-white">Inspire</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover amazing stories, insights, and ideas from writers around the world. 
              Join our community of passionate storytellers and readers.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="xl" 
                variant="gradient"
                className="text-lg px-12 py-4 shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300"
              >
                🚀 Start Reading
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                ✍️ Write Your Story
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-300">Stories Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">5K+</div>
                <div className="text-gray-300">Active Writers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-gray-300">Monthly Readers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-ping"></div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Amazing Content</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find stories that match your interests and discover new perspectives
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="🔍 Search for stories, topics, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Button variant="gradient" size="md" className="rounded-xl">
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              variant={selectedCategory === '' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className="rounded-full px-6 py-3"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6 py-3"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                  <div className="p-6 bg-gray-100 rounded-b-xl">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Stories Found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your search or browse all categories</p>
              <Button variant="primary" onClick={() => {setSearchTerm(''); setSelectedCategory('');}}>
                Show All Stories
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Card 
                  key={post._id} 
                  variant="elevated" 
                  hover={true}
                  className={`group overflow-hidden transform transition-all duration-500`}
                >
                  {/* Post Image */}
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                    {post.image && post.image !== 'default-post.jpg' ? (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                        onClick={() => window.open(post.image, '_blank')}
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                        📖
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant="gradient" size="sm">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {truncateContent(post.content)}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {post.author.firstName?.[0] || post.author.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {post.author.firstName && post.author.lastName 
                              ? `${post.author.firstName} ${post.author.lastName}`
                              : post.author.username
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link to={`/posts/${post._id}`}>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full group-hover:scale-105 transition-transform"
                      >
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 space-x-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-6 py-3"
              >
                ← Previous
              </Button>
              
              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? 'primary' : 'outline'}
                    onClick={() => setCurrentPage(index + 1)}
                    className="w-12 h-12 rounded-full"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-6 py-3"
              >
                Next →
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Never Miss a Great Story
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Subscribe to our newsletter and get the best stories delivered to your inbox weekly
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border-0"
            />
            <Button 
              variant="secondary" 
              size="lg"
              className="px-8 py-4 rounded-full bg-white text-indigo-600 hover:bg-gray-50"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomeStunning;
