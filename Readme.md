# YouTube Backend Project

A comprehensive backend API built with Express.js and MongoDB for a YouTube-like video streaming platform. This project demonstrates industry-level backend development practices including authentication, authorization, file uploads, database modeling, and API design.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [How to Run](#how-to-run)
- [Project Architecture](#project-architecture)

---

## ✨ Features

- **User Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: Registration, login, profile management, and account updates
- **Video Management**: Upload, update, delete, and retrieve videos with metadata
- **Comments System**: Add, edit, delete comments on videos
- **Playlist Management**: Create and manage custom playlists
- **Subscription System**: Subscribe/unsubscribe to channels
- **Likes System**: Like/unlike videos and comments
- **Dashboard Analytics**: View channel statistics and video analytics
- **File Upload**: Cloudinary integration for image and video uploads
- **Error Handling**: Centralized error handling middleware
- **Input Validation**: Express validator for request validation
- **CORS Support**: Cross-origin resource sharing enabled

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js (v5.2.1) |
| **Database** | MongoDB with Mongoose (v9.1.6) |
| **Authentication** | JWT (jsonwebtoken v9.0.3) |
| **Password Hashing** | Bcrypt (v6.0.0) |
| **File Upload** | Multer (v2.0.2) |
| **Cloud Storage** | Cloudinary (v2.9.0) |
| **Validation** | Express Validator (v7.3.2) |
| **CORS** | CORS (v2.8.6) |
| **Development** | Nodemon (v3.1.11) |
| **Environment** | Dotenv (v17.2.4) |
| **Pagination** | Mongoose Aggregate Paginate (v1.1.4) |

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── index.js                  # Server entry point
│   ├── constants.js              # Application constants
│   ├── controllers/              # Business logic
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── comments.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── likes.controller.js
│   │   ├── playlist.controller.js
│   │   └── subscription.controller.js
│   ├── routes/                   # API routes
│   │   ├── user.route.js
│   │   ├── video.route.js
│   │   ├── comments.route.js
│   │   ├── dashboard.route.js
│   │   ├── likes.route.js
│   │   ├── playlist.route.js
│   │   └── subscription.route.js
│   ├── models/                   # Database schemas
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── comments.model.js
│   │   ├── likes.model.js
│   │   ├── playlist.model.js
│   │   └── subscription.model.js
│   ├── middlewares/              # Express middlewares
│   │   ├── auth.middleware.js
│   │   ├── errorHandling.middleware.js
│   │   ├── multer.middleware.js
│   │   ├── optionalUser.middleware.js
│   │   └── validate.middleware.js
│   ├── db/                       # Database connection
│   │   └── connetDB.js
│   ├── utils/                    # Utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   └── validators/               # Input validators
│       └── authValidator.js
├── public/                        # Static files
│   └── temp/                     # Temporary file storage
├── package.json
├── nodemon.json
└── Readme.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account for file uploads

### Setup Steps

1. **Clone the repository**
```bash
git clone <https://github.com/pkbhadane-dev/VidTube-backend->
cd Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
Create a `.env` file in the root directory with required environment variables (see below)

4. **Start the server**
```bash
npm start
```

The server will start on the specified PORT with automatic reload via Nodemon.


# Server Configuration
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d

# Cloudinary (File Upload)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload
MAX_FILE_SIZE=52428800  # 50MB in bytes
```

---

## 💾 Database Models

### User Model
- fullname, username, email, password
- avatar, description, watchHistory
- refresh token for persistent sessions
- timestamps (createdAt, updatedAt)

### Video Model
- title, description, videoFile, thumbnail
- duration, views, isPublished status
- owner reference, comments array
- timestamps

### Comment Model
- content/text
- video reference, owner reference
- timestamps

### Like Model
- content type (video/comment)
- target reference (video/comment)
- owner reference

### Playlist Model
- name, description
- owner reference, videos array
- timestamps

### Subscription Model
- subscriber reference
- channel owner reference
- timestamps

---

## 🔌 API Endpoints

### Base URL: `/api/v1`

#### **User Routes** (`/user`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh access token
- `GET /profile` - Get user profile
- `PATCH /update-profile` - Update user profile
- `PATCH /change-password` - Change password
- `GET /watch-history` - Get watch history

#### **Video Routes** (`/video`)
- `POST /upload` - Upload a new video
- `GET /` - Get all videos with pagination
- `GET /:videoId` - Get video details
- `PATCH /:videoId` - Update video metadata
- `DELETE /:videoId` - Delete a video
- `PATCH /:videoId/publish` - Toggle publish status
- `PATCH /:videoId/view` - Increment view count

#### **Comments Routes** (`/comments`)
- `POST /` - Add comment to video
- `GET /:videoId` - Get all comments for video
- `PATCH /:commentId` - Update comment
- `DELETE /:commentId` - Delete comment

#### **Likes Routes** (`/likes`)
- `POST /video/:videoId` - Like a video
- `DELETE /video/:videoId` - Unlike a video
- `POST /comment/:commentId` - Like a comment
- `DELETE /comment/:commentId` - Unlike a comment
- `GET /videos` - Get user's liked videos

#### **Playlist Routes** (`/playlist`)
- `POST /` - Create a new playlist
- `GET /` - Get all user playlists
- `GET /:playlistId` - Get playlist details
- `PATCH /:playlistId` - Update playlist
- `DELETE /:playlistId` - Delete playlist
- `PATCH /:playlistId/add/:videoId` - Add video to playlist
- `PATCH /:playlistId/remove/:videoId` - Remove video from playlist

#### **Subscription Routes** (`/subscription`)
- `POST /:channelId` - Subscribe to channel
- `DELETE /:channelId` - Unsubscribe from channel
- `GET /subscribers/:channelId` - Get channel subscribers
- `GET /subscriptions` - Get user subscriptions

#### **Dashboard Routes** (`/dashboard`)
- `GET /stats` - Get channel statistics
- `GET /videos` - Get channel videos analytics

---

## 🔐 Middleware

### Authentication Middleware (`auth.middleware.js`)
- Verifies JWT tokens from request headers or cookies
- Validates user authorization for protected routes
- Attaches user information to request object

### Error Handling Middleware (`errorHandling.middleware.js`)
- Centralized error handling
- Consistent error response format
- Proper HTTP status codes

### File Upload Middleware (`multer.middleware.js`)
- Handles file uploads to temporary storage
- Validates file types and sizes
- Integrates with Cloudinary for cloud storage

### Validation Middleware (`validate.middleware.js`)
- Validates request data using express-validator
- Checks request body, params, and query parameters
- Returns validation errors with specific field information

### Optional User Middleware (`optionalUser.middleware.js`)
- Allows both authenticated and unauthenticated requests
- Attaches user info if token is valid, continues if not

---

## 📊 How to Run

### Development Mode
```bash
npm start
```
- Runs with Nodemon for automatic restart on file changes
- Watches: `src` directory for `.js` and `.json` files
- Ignores: `public/temp` directory

### Configuration
The `nodemon.json` file is configured with:
- Watch delay: 500ms
- Verbose output enabled
- Excluded paths: `public/temp`

---

## 🏗️ Project Architecture

### MVC Pattern
- **Models**: MongoDB schemas with business logic
- **Views**: JSON API responses
- **Controllers**: Request handling and response generation

### Layered Architecture
1. **Routes Layer**: Define endpoints and HTTP methods
2. **Middleware Layer**: Authentication, validation, error handling
3. **Controller Layer**: Business logic and request processing
4. **Model Layer**: Database operations and schema validation
5. **Utils Layer**: Reusable functions and helpers

### Key Design Patterns
- **JWT Authentication**: Stateless authentication with tokens
- **Async Handler**: Wrapper for catching async errors
- **Custom Error Class**: Standardized error handling
- **API Response Class**: Consistent response format

---

## 📝 Notes

- All API responses follow a consistent JSON format via `ApiResponse` utility
- Passwords are hashed using bcrypt before storage
- JWT tokens stored in HTTP-only cookies for security
- Cloudinary used for scalable image and video storage
- MongoDB indexes on frequently queried fields for performance

---

## 👤 Author

**Prashant**

---

## 📄 License

ISC

