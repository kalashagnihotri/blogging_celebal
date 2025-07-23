import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Eye,
  Heart,
  Edit,
  Trash2,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  views: number;
  likesCount: number;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  replies: Comment[];
}

const PostDetail: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const viewRecorded = useRef(false);

  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    if (id && !viewRecorded.current) {
      fetchPost();
      fetchComments();
      viewRecorded.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/posts/${id}`);
      setPost(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch post');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/comments/post/${id}`);
      setComments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch comments');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to like posts');
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/v1/posts/${id}/like`);
      if (post) {
        const isLiked = post.likes.includes(user!.id);
        setPost({
          ...post,
          likes: isLiked 
            ? post.likes.filter(userId => userId !== user!.id)
            : [...post.likes, user!.id],
          likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
        });
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/api/v1/posts/${id}`);
      toast.success('Post deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setIsCommenting(true);

    try {
      const response = await axios.post(`${baseUrl}/api/v1/comments/post/${id}`, {
        content: newComment
      });
      
      setComments([response.data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const CommentComponent: React.FC<{ comment: Comment; level?: number }> = ({ 
    comment, 
    level = 0 
  }) => (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <img
            src={
              comment.author.avatar
                ? `${baseUrl}/uploads/${comment.author.avatar}`
                : '/default-avatar.png'
            }
            alt={comment.author.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">{comment.author.name}</span>
              <span className="text-sm text-gray-500">{formatTime(comment.createdAt)}</span>
            </div>
            <p className="text-gray-800 leading-relaxed">{comment.content}</p>
          </div>
        </div>
      </div>
      
      {comment.replies && comment.replies.map((reply) => (
        <CommentComponent key={reply._id} comment={reply} level={level + 1} />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post not found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && post.author._id === user.id;
  const isLiked = user ? post.likes.includes(user.id) : false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        {/* Post Header */}
        <header className="bg-white dark:bg-gray-800 rounded-t-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={
                  post.author.avatar
                    ? `${baseUrl}/uploads/${post.author.avatar}`
                    : '/default-avatar.png'
                }
                alt={post.author.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{post.author.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            {isOwner && (
              <div className="flex space-x-2">
                <Link
                  to={`/edit/${post._id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit Post"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleDeletePost}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Post"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views} views
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {comments.length} comments
              </span>
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full capitalize text-xs font-medium">
                {post.category}
              </span>
            </div>

            <button
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isAuthenticated
                  ? isLiked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLiked ? (
                <Heart className="h-5 w-5 fill-current" />
              ) : (
                <Heart className="h-5 w-5" />
              )}
              <span className="font-medium">{post.likesCount}</span>
            </button>
          </div>
        </header>

        {/* Post Image */}
        {post.image && post.image !== 'default-post.jpg' && (
          <div className="bg-white dark:bg-gray-800 px-8">
            <img
              src={`${baseUrl}/uploads/${post.image}`}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="bg-white dark:bg-gray-800 px-8 pb-8">
          <div className="prose max-w-none">
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl p-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex space-x-4">
                <img
                  src={
                    user?.avatar
                      ? `${baseUrl}/uploads/${user.avatar}`
                      : '/default-avatar.png'
                  }
                  alt={user?.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows={4}
                    placeholder="Write a comment..."
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={isCommenting || !newComment.trim()}
                      className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCommenting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
              <p className="text-gray-600 mb-4">Please log in to leave a comment</p>
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Log In
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentComponent key={comment._id} comment={comment} />
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
