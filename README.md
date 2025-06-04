# smart-file-storage
# File Management API

A lightweight Node.js REST API for user authentication and file management with support for file uploads, downloads, and secure access control.

## Features

- **User Authentication**: JWT-based signup and login system
- **File Upload**: Secure file upload with size and type validation
- **File Download**: Download files with HTTP range support for partial content
- **Session Management**: Cookie-based authentication with HttpOnly cookies
- **File Type Validation**: Supports PDF, JPEG, and PNG files
- **Error Handling**: Comprehensive error middleware with proper HTTP status codes

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: Busboy for multipart form data
- **Database**: Custom models (implementation not shown)
- **Security**: Bcrypt-like password hashing with salt

## Project Structure

```
src/
├── controller/
│   ├── authController.ts    # Authentication logic
│   └── fileController.ts    # File operations
├── middleware/
│   ├── errorMiddleware.ts   # Error handling
│   ├── requestParse.ts      # Request parsing utilities
│   └── response.ts          # Response utilities
├── models/
│   ├── authModels.ts        # Auth database operations
│   └── fileModels.ts        # File database operations
├── routes/
│   └── userRoutes.ts        # Route definitions
└── utils/
    └── utils.ts             # Utility functions
```

## API Endpoints

### Authentication

#### POST /signup
Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Account created successfully"
}
```

#### POST /login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successfully"
}
```

### File Operations

#### POST /upload
Upload a file (requires authentication).

**Headers:**
- `Content-Type: multipart/form-data`
- `Cookie: token=<jwt_token>`

**Form Data:**
- `file`: The file to upload (PDF, JPEG, or PNG only)

**Response:**
```json
{
  "message": "File uploaded successfully"
}
```

#### GET /download?filename=<name>&id=<file_id>
Download a file by filename and ID.

**Query Parameters:**
- `filename`: Name of the file to download
- `id`: File ID from database

**Features:**
- Supports HTTP Range requests for partial downloads
- Proper MIME type detection
- Content-Disposition headers for downloads

## Security Features

### Password Security
- **Salt Generation**: 16-byte random salt per password
- **Hashing**: Node.js scrypt for password hashing
- **Validation**: Strong password requirements (8+ chars, uppercase, lowercase, numbers)

### File Upload Security
- **Size Limit**: 10MB maximum file size
- **Type Validation**: Only PDF, JPEG, and PNG files allowed
- **Path Security**: Files stored in user's home directory with controlled naming

### Authentication
- **JWT Tokens**: 1-hour expiration
- **HttpOnly Cookies**: Prevents XSS attacks
- **Session Verification**: Required for protected routes

## Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone <repository>
cd fileExp
npm install
```

2. **Environment Variables:**
Create a `.env` file:
```env
JWT_SECRET=your_super_secret_jwt_key_here
```

3. **Run the application:**
```bash
npm run dev
```

## Configuration

### File Storage
- **Location**: `~/myFolder/` (user's home directory)
- **Supported Types**: PDF, JPEG, PNG
- **Max Size**: 10MB per file

### JWT Configuration
- **Expiration**: 1 hour
- **Storage**: HttpOnly cookies
- **Algorithm**: Default (HS256)

## Error Handling

The API provides comprehensive error responses with appropriate HTTP status codes:

- `400`: Bad Request (validation errors, missing fields)
- `401`: Unauthorized (invalid/missing tokens)
- `413`: Payload Too Large (file size exceeded)
- `416`: Range Not Satisfiable (invalid byte range)
- `422`: Unprocessable Entity (unsupported file type)
- `500`: Internal Server Error

## Usage Examples

### Upload a file with curl:
```bash
curl -X POST http://localhost:3000/upload \
  -H "Cookie: token=your_jwt_token" \
  -F "file=@document.pdf"
```

### Download a file:
```bash
curl "http://localhost:3000/download?filename=document.pdf&id=123" \
  -o downloaded_file.pdf
```

### Download partial content:
```bash
curl "http://localhost:3000/download?filename=document.pdf&id=123" \
  -H "Range: bytes=0-1023" \
  -o partial_file.pdf
```

## Database Schema (Expected)

The API expects these database operations to be implemented:

### Users Table
- `id`: Primary key
- `username`: User identifier
- `email`: User email (unique)
- `password`: Hashed password
- `salt`: Password salt

### Files Table
- `id`: Primary key
- `filename`: Original filename
- `filepath`: Storage path
- `user_id`: Owner user ID
- `size`: File size in bytes

## Contributing

1. Follow TypeScript best practices
2. Maintain error handling patterns
3. Add proper type annotations
4. Test file upload/download functionality
5. Ensure security measures are preserved

