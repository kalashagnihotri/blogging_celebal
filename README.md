# Blog Platform

A full-stack blog platform built with Node.js, Express, MongoDB, React, and TypeScript.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (User/Admin)
  - Secure password hashing with bcrypt

- 📝 **Blog Management**
  - Create, read, update, delete posts
  - Rich content with image uploads
  - Categories and tags system
  - Search functionality with MongoDB text indexing

- 💬 **Comments System**
  - Nested comments and replies
  - Like/unlike functionality
  - Comment moderation

- 🎨 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Clean and accessible interface
  - Dark/light theme support (planned)
  - Mobile-first approach

- 🚀 **Performance & Security**
  - Rate limiting
  - Input validation and sanitization
  - Error handling and logging
  - File upload security

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Helmet** - Security headers
- **Express Validator** - Input validation

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Heroicons** - Icons

## Project Structure

```
blog-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── catchAsyncErrors.js
│   │   ├── ErrorResponse.js
│   │   └── tokenUtils.js
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── common/
    │   │   └── posts/
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── pages/
    │   │   └── Home.tsx
    │   ├── App.tsx
    │   └── index.tsx
    ├── public/
    └── .env
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/blog-platform
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=15m
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_REFRESH_EXPIRE=7d
   MAX_FILE_UPLOAD=2000000
   FILE_UPLOAD_PATH=./uploads
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:5001" > .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout user

### Posts
- `GET /api/v1/posts` - Get all posts (with search, filter, pagination)
- `GET /api/v1/posts/:id` - Get single post
- `POST /api/v1/posts` - Create post (protected)
- `PUT /api/v1/posts/:id` - Update post (protected)
- `DELETE /api/v1/posts/:id` - Delete post (protected)
- `POST /api/v1/posts/:id/like` - Like/unlike post (protected)

### Comments
- `GET /api/v1/comments/post/:postId` - Get comments for post
- `POST /api/v1/comments/post/:postId` - Create comment (protected)
- `PUT /api/v1/comments/:id` - Update comment (protected)
- `DELETE /api/v1/comments/:id` - Delete comment (protected)
- `POST /api/v1/comments/:id/like` - Like/unlike comment (protected)

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update user (protected)
- `POST /api/v1/users/:id/avatar` - Upload avatar (protected)

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend (no build step needed)
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## Deployment

### Backend Deployment (Railway/Render)
1. Create a new service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Set environment variables
5. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGO_URI` in backend `.env`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue on GitHub.
