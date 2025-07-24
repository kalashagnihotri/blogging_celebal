# 📝 Modern Blog Platform

> A full-stack blog platform built with React, Node.js, Express, and MongoDB  

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## 🎯 Project Overview

A modern, responsive blog platform that allows users to create, share, and interact with blog posts. Built as a comprehensive full-stack web application demonstrating modern web development practices and technologies.

## ✨ Implemented Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens (15min access, 7 days refresh)
- Role-based access control (User/Admin roles)
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- User registration and login with validation
- User profile management

### 📝 **Blog Management**
- Create, read, update, delete posts (CRUD operations)
- Image upload with Cloudinary integration
- Categories system (tech, life, travel, food, business, health, other)
- Tags system for better organization
- Post search functionality with MongoDB text search
- View tracking for posts
- Featured posts system
- User's personal post dashboard

### 💬 **Social Features**
- Nested comments and replies system
- Like/unlike posts and comments
- User profiles with avatars
- Comment moderation (approval system)
- Author information display

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Dark/light theme toggle
- Mobile-first approach
- Professional dashboard interface
- Image modals and galleries
- Loading skeletons and states

### 🚀 **Performance & Optimization**
- Image optimization with Cloudinary
- Pagination for posts and comments
- Database indexing for search performance
- Error handling and validation
- Rate limiting on authentication routes

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - UI Library with TypeScript
- **Tailwind CSS** - Styling Framework
- **React Router** - Navigation
- **Axios** - HTTP Client
- **React Toastify** - Notifications
- **Context API** - State Management

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Cloudinary** - Image Storage
- **bcrypt** - Password Hashing

### Tools
- **Git** - Version Control
- **MongoDB Atlas** - Cloud Database
- **ESLint** - Code Linting

## 📁 Project Structure

```
blogging_celebal/
├── 📂 backend/                 # Node.js Backend
│   ├── 📂 config/             # Database configuration
│   ├── 📂 controllers/        # Route controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── postController.js   # Post management
│   │   ├── userController.js   # User management
│   │   └── commentController.js # Comment system
│   ├── 📂 middlewares/        # Auth, validation, error handling
│   ├── 📂 models/             # MongoDB schemas
│   │   ├── User.js            # User model
│   │   ├── Post.js            # Post model
│   │   └── Comment.js         # Comment model
│   ├── 📂 routes/             # API routes
│   ├── 📂 utils/              # Helper functions
│   ├── 📄 app.js              # Express app configuration
│   └── 📄 server.js           # Server entry point
├── 📂 frontend/               # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable components
│   │   │   ├── auth/          # Login/Register components
│   │   │   ├── posts/         # Post-related components
│   │   │   ├── common/        # Shared components
│   │   │   └── ui/            # UI components
│   │   ├── 📂 contexts/       # React contexts
│   │   ├── � pages/          # Page components
│   │   └── 📄 App.tsx         # Main app component
│   └── 📂 public/             # Static assets
└── 📄 README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/kalashagnihotri/blogging_celebal.git
cd blogging_celebal
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Environment Setup

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Run Development Server
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login  
GET  /api/v1/auth/me          # Get current user
POST /api/v1/auth/refresh     # Refresh token
GET  /api/v1/auth/profile/:id # Get user profile
PUT  /api/v1/auth/updatedetails # Update user details
PUT  /api/v1/auth/updatepassword # Update password
```

### Blog Post Endpoints
```
GET    /api/v1/posts          # Get all posts (with filters)
GET    /api/v1/posts/:id      # Get single post
POST   /api/v1/posts          # Create new post
PUT    /api/v1/posts/:id      # Update post
DELETE /api/v1/posts/:id      # Delete post
POST   /api/v1/posts/:id/like # Like/unlike post
GET    /api/v1/posts/user/:userId # Get user's posts
GET    /api/v1/posts/featured # Get featured posts
GET    /api/v1/posts/my-posts # Get current user's posts
```

### Comment Endpoints
```
GET    /api/v1/comments/post/:postId  # Get post comments
POST   /api/v1/comments/post/:postId  # Create comment
PUT    /api/v1/comments/:id           # Update comment
DELETE /api/v1/comments/:id           # Delete comment
POST   /api/v1/comments/:id/like      # Like/unlike comment
```

### User Management Endpoints
```
GET    /api/v1/users/:id      # Get user details
PUT    /api/v1/users/:id      # Update user
GET    /api/v1/users/stats    # Get user stats
POST   /api/v1/users/:id/avatar # Upload avatar
```

## 🔧 Development

### Available Scripts
```bash
# Backend
npm run dev          # Start development server with nodemon
npm start           # Start production server

# Frontend  
npm start           # Start development server
npm run build       # Build for production
```

### Database Models
- **User**: Authentication, profiles, roles
- **Post**: Blog posts with categories, tags, likes, views
- **Comment**: Nested commenting system with likes

## 🎓 Learning Outcomes

### Technical Skills Demonstrated
- **Full-Stack Development**: Complete MERN stack implementation
- **Database Design**: MongoDB schema design with relationships
- **API Development**: RESTful API with proper status codes
- **Authentication**: JWT implementation with refresh tokens
- **File Upload**: Image handling with Cloudinary
- **Frontend Development**: Modern React with TypeScript and Tailwind

### Software Engineering Practices
- **Code Organization**: Clean MVC architecture
- **Error Handling**: Comprehensive validation and error responses
- **Security**: Authentication, authorization, and data validation
- **Documentation**: Clear API documentation and code comments

## � Testing Checklist

### Core Functionality
- [x] User registration and login
- [x] Post creation with image upload
- [x] Comment system with nested replies
- [x] Like/unlike functionality for posts and comments
- [x] User profiles and avatars
- [x] Search and filtering
- [x] Dark/light theme toggle
- [x] Responsive design




