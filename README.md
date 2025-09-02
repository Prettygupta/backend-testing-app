# Backend Testing App - AI Chat & File Upload System

A  Node.js/TypeScript backend application that provides file upload capabilities, AI-powered chat functionality using Google Gemini, and PDF report generation with email delivery.


### File Upload System
- **Multi-format Support**: Images (JPG, PNG, WEBP), Videos (MP4, MOV, AVI), Documents (PDF, Word, Excel, CSV)
- **S3 Integration**: Secure cloud storage with AWS S3
- **File Validation**: MIME type and size validation (50MB limit for videos, 10MB for others)

### AI Chat with Google Gemini
- **Image Analysis**: Direct image analysis using Gemini 1.5 Flash vision model
- **Video Assistance**: General guidance for video files
- **Document Support**: AI assistance for document-related queries

### Database Storage
- **Unified User Schema**: Single collection storing all user data
- **File Links**: Array of S3 URLs for uploaded files
- **Conversations**: Array of prompt/response pairs
- **Timestamps**: Automatic created/updated timestamps

### PDF Report Generation
- **Comprehensive Reports**: Complete user session data in PDF format
- **Embedded Images**: Optimized images (400x300px, 70% quality)
- **Video/Document Links**: Clickable URLs for large files
- **Size Optimization**: Automatic size management (10MB limit)
- **Email Delivery**: Direct PDF delivery to user's email

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend-testing-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env` file with the following variables:
```env
# Server Configuration
PORT=1057
BACKEND_URL=http://localhost:1057

# Database
MONGO_URI=mongodb://localhost:27017/ai-chat-db

# AWS S3 Configuration
AWS_BUCKET_NAME=your-s3-bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
INFO_EMAIL=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

4. **Start the application**
```bash
# Development
npm run dev

### Base URL
```
http://localhost:1057/api
```
Refer to the postman collection -   Backend Testing App - AI Chat & File Upload.postman_collection.json




