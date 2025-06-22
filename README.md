# Student API with JWT Authentication

A RESTful API for managing student records with JWT (JSON Web Token) authentication. This API provides secure endpoints for user authentication and student management operations.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **User Management** - User registration and login
- 📚 **Student CRUD Operations** - Create, Read, Update, Delete student records
- 🔍 **Search Functionality** - Search students by name, major, or grade
- ✅ **Input Validation** - Comprehensive request validation
- 🛡️ **Route Protection** - Protected endpoints requiring authentication
- 📝 **Error Handling** - Detailed error messages and status codes

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Student API with JWT Authentication"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the config file and modify as needed
   cp config.env.example config.env
   ```
   
   Edit `config.env` with your settings:
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Student Endpoints (Protected - Requires JWT Token)

All student endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get All Students
```http
GET /api/students
Authorization: Bearer <token>
```

#### Get Student by ID
```http
GET /api/students/1
Authorization: Bearer <token>
```

#### Create New Student
```http
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice.johnson@student.edu",
  "age": 20,
  "grade": "Sophomore",
  "major": "Computer Science",
  "gpa": 3.8,
  "enrollmentDate": "2023-09-01"
}
```

#### Update Student
```http
PUT /api/students/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "gpa": 3.9,
  "grade": "Junior"
}
```

#### Delete Student
```http
DELETE /api/students/1
Authorization: Bearer <token>
```

#### Search Students
```http
GET /api/students?name=john&major=computer
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

## Usage Examples

### 1. Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login and Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a Student (with token)
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@student.edu",
    "age": 20,
    "grade": "Sophomore",
    "major": "Computer Science",
    "gpa": 3.8,
    "enrollmentDate": "2023-09-01"
  }'
```

### 4. Get All Students (with token)
```bash
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Default Users

The application comes with a default admin user:

- **Email**: `admin@example.com`
- **Password**: `password`
- **Role**: `admin`

## Data Models

### User Model
```javascript
{
  id: Number,
  name: String,
  email: String,
  password: String (hashed),
  role: String ('user' | 'admin'),
  createdAt: Date
}
```

### Student Model
```javascript
{
  id: Number,
  name: String,
  email: String,
  age: Number,
  grade: String ('Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate'),
  major: String,
  gpa: Number,
  enrollmentDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": [] // Validation errors (if applicable)
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **CORS**: Cross-origin resource sharing enabled
- **Error Handling**: Secure error messages without exposing sensitive data

## Development

### Project Structure
```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── config.env             # Environment variables
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   ├── User.js           # User model
│   └── Student.js        # Student model
├── routes/
│   ├── auth.js           # Authentication routes
│   └── students.js       # Student routes
└── README.md             # This file
```

### Adding New Features

1. **New Models**: Add to `models/` directory
2. **New Routes**: Add to `routes/` directory and import in `server.js`
3. **New Middleware**: Add to `middleware/` directory
4. **Environment Variables**: Add to `config.env`

## Production Considerations

1. **Database**: Replace in-memory storage with a proper database (MongoDB, PostgreSQL, etc.)
2. **JWT Secret**: Use a strong, unique JWT secret
3. **HTTPS**: Enable HTTPS in production
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Logging**: Add proper logging (Winston, Morgan, etc.)
6. **Environment**: Use proper environment variables for different environments

## License

This project is licensed under the ISC License. 