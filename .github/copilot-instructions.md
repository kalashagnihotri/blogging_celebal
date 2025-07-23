# AI Coding Instructions - Blog Platform

## Project Overview
This is a full-stack blog platform with a Node.js/Express backend, React frontend, and MongoDB database. The project follows clean architecture principles with JWT authentication, role-based access control, and modular design patterns.

## Architecture & Structure

### Backend (Node.js + Express + MongoDB)
- **MVC Pattern**: Controllers → Services → Models separation
- **Folder Structure**: `/backend` with `controllers/`, `routes/`, `models/`, `middlewares/`, `utils/`, `config/`
- **API Versioning**: All routes prefixed with `/api/v1/` for future compatibility
- **Database**: Mongoose with proper indexing, timestamps, and validation

### Frontend (React + Tailwind CSS)
- **Components**: Modular components in dedicated folders
- **State Management**: Context API for auth state
- **Styling**: Tailwind CSS with defined color palette (Indigo primary, Gray neutrals)
- **Typography**: Inter/Poppins fonts, responsive design with mobile-first approach

## Key Development Patterns

### Authentication Flow
```javascript
// JWT + Refresh Token pattern
// Access tokens: 15 min expiry
// Refresh tokens: 7 days, stored securely
// Middleware: authenticateToken → authorizeRoles
```

### Error Handling
- **Centralized**: Use `errorHandler` middleware for all errors
- **Custom ErrorResponse**: Standardized error class with status codes
- **Async Wrapper**: `catchAsyncErrors()` middleware prevents crashes
- **Validation**: `express-validator` or `Joi` with 400 responses

### Security Implementation
- Helmet, CORS, rate limiting on auth routes
- Input sanitization and validation
- bcrypt password hashing with salt
- Environment variables for secrets

## Critical Workflows

### Database Operations
- Always handle invalid ObjectId formats gracefully
- Use text indexing for search: `postSchema.index({ title: 'text', content: 'text' })`
- Implement pagination with MongoDB skip/limit
- Populate author fields when fetching posts/comments

### File Uploads
- Use `multer` with size limits (2MB) and MIME validation
- Store file paths in database, serve via `express.static`
- Validate file types before processing

### Role-Based Access Control
```javascript
// Two roles: 'user' (default) and 'admin'
// Users: manage own posts/comments
// Admins: manage all content + admin routes
// Check: req.user.id === post.authorId || req.user.role === 'admin'
```

## Component Patterns

### Frontend Components
- `PostCard.jsx`: Grid layout, thumbnail + title + snippet + author
- `AuthForm.jsx`: Shared login/register with validation icons
- `ProtectedRoute.jsx`: Route guards based on authentication
- `Toast.jsx`: React Toastify for notifications

### API Integration
- Axios with interceptors for JWT token attachment
- Environment-based API URLs
- Error handling with toast notifications

## Data Flow & Integration

### Comment System
- Separate collection with `parent` field for nested replies
- Recursive population for reply threads
- Restrict deletion to author or admin

### Search & Filtering
- Text search via MongoDB `$text` operator
- Category/tag filtering via query parameters
- Scoring for search relevance

## Development Commands
Since this is a planning-stage project, typical commands would be:
- Backend: `npm run dev` (nodemon), `npm test` (jest + supertest)
- Frontend: `npm run dev` (Vite), `npm run build`
- Database: MongoDB Atlas connection via environment variables

## Common Pitfalls
- Always wrap async route handlers with error catching
- Validate ObjectId format before MongoDB queries
- Use proper HTTP status codes (401 vs 403 for auth)
- Implement CORS properly for frontend-backend communication
- Handle file upload errors and size limits

## Testing Strategy
- Unit tests for controllers and utilities
- Integration tests for API endpoints
- Auth flow testing (token generation, expiry, refresh)
- Role-based access testing for protected routes
