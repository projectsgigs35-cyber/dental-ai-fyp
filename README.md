# 🦷 Dental AI - AI-Powered Dental Healthcare Platform

An intelligent dental healthcare platform that leverages artificial intelligence and machine learning to detect dental diseases from X-ray images. Built with modern web technologies for both frontend and backend.

## 📋 Overview

**Dental AI** is a comprehensive system designed to:
- Detect dental pathologies (plaque, cavities, etc.) from X-ray images using AI
- Provide doctors with detailed detection reports
- Maintain patient history and records
- Generate professional PDF reports with annotated images
- Ensure secure authentication and data management

### Developers
- **Saad Ahmed** (22K-4801)
- **Abdur Rafay** (21K-3856)
- **M. Arham** (21K-3925)

---

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite bundler
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Framer Motion** for animations
- **React Hot Toast** for notifications
- **React Icons** for UI icons

### Backend
- **Node.js** with Express.js framework
- **MongoDB** for database
- **Mongoose** ODM
- **JWT** for authentication
- **Nodemailer** for email services
- **Multer** for file uploads
- **PDFKit** for PDF generation
- **Roboflow API** for AI detection models

---

## 📦 Project Structure

```
FYP/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth, Theme)
│   │   ├── api/             # Axios configuration
│   │   └── assets/          # Images, icons, etc.
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js backend server
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Helper functions
│   ├── uploads/             # User uploads (images, reports)
│   ├── config/              # Configuration files
│   ├── server.js            # Express app entry
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** v16+ and npm
- **MongoDB** instance (local or cloud)
- **Git** for version control

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dental-ai.git
cd dental-ai
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your configuration
# - MongoDB URI
# - JWT Secret
# - Email credentials
# - Roboflow API keys
nano .env

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (optional)
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/FYP
JWT_SECRET=your-secure-jwt-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ROBOFLOW_OPG_API_KEY=your-api-key
ROBOFLOW_PLAG_API_KEY=your-api-key
ROBOFLOW_OPG_MODEL=dental-x-ray-panoramic-dataset-ewhpw/1
ROBOFLOW_PLAG_MODEL=master-plaque-aly9i/1
CLIENT_URL=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Deployment

### Frontend Deployment on Vercel

#### 1. Prepare Frontend
```bash
cd frontend
npm run build  # Test local build
```

#### 2. Deploy to Vercel
**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Using GitHub Integration**
1. Push code to GitHub
2. Visit https://vercel.com
3. Click "Add New Project"
4. Select your GitHub repository
5. Configure environment variables
6. Click "Deploy"

#### 3. Configure Environment Variables in Vercel
```
VITE_API_URL=https://your-backend-url.com
```

---

### Backend Deployment

#### Option 1: Render (Recommended)
1. Push code to GitHub
2. Visit https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Configuration:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `MONGO_URI=your-mongodb-uri`
     - `JWT_SECRET=your-secret`
     - `EMAIL_USER=your-email`
     - `EMAIL_PASS=your-password`
     - `ROBOFLOW_OPG_API_KEY=your-key`
     - `ROBOFLOW_PLAG_API_KEY=your-key`
     - `CLIENT_URL=your-vercel-frontend-url`
     - `NODE_ENV=production`

#### Option 2: Railway
1. Push code to GitHub
2. Visit https://railway.app
3. Create new project from GitHub repo
4. Set environment variables
5. Deploy

#### Option 3: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register` - Register new doctor
- `POST /api/auth/login` - Login doctor

### Detection
- `POST /api/detections/analyze` - Analyze X-ray image with AI
- `GET /api/detections/:id` - Get detection details

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report details
- `POST /api/reports/generate-pdf` - Generate PDF report

### Doctors
- `GET /api/doctors/:id` - Get doctor profile
- `PUT /api/doctors/:id` - Update doctor profile

### Feedback
- `POST /api/feedback` - Submit feedback

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm run dev      # Development with nodemon
npm start        # Production mode
```

---

## 🔐 Security Considerations

1. **Never commit .env files** - Use .env.example instead
2. **Use strong JWT secrets** - Generate random, long strings
3. **Enable HTTPS** on production
4. **Validate all user inputs** on both client and server
5. **Use secure CORS** configuration
6. **Implement rate limiting** for API endpoints
7. **Encrypt sensitive data** in database
8. **Regular security audits** of dependencies

---

## 📊 Features

### For Doctors
✓ Secure authentication via OTP verification
✓ Upload and analyze dental X-rays
✓ AI-powered detection of pathologies
✓ Generate professional PDF reports
✓ View detection history
✓ Patient management
✓ Clinic profile management

### For System
✓ Real-time image processing
✓ AI model integration via Roboflow
✓ Automated email notifications
✓ Professional report generation
✓ Secure data storage
✓ Dark mode support
✓ Responsive design

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Ensure MongoDB is running locally
mongod

# Or use MongoDB Atlas cloud
# Update MONGO_URI in .env
```

### Image Upload Issues
```bash
# Ensure uploads directory exists
mkdir -p backend/uploads/images
mkdir -p backend/uploads/reports

# Check file permissions
chmod -R 755 backend/uploads
```

### Email Not Sending
- Enable "Less secure app access" for Gmail
- Use Gmail App Password instead of account password
- Check EMAIL_USER and EMAIL_PASS in .env

### CORS Issues
- Update CLIENT_URL in backend .env
- Ensure frontend URL matches CORS configuration

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Roboflow Documentation](https://roboflow.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Render Deployment](https://render.com/docs)

---

## 📄 License

This project is developed as a Final Year Project (FYP).

---

## 📧 Contact & Support

For issues, questions, or feedback:
- **Email:** noreplydantalai2022@gmail.com
- **GitHub Issues:** [Report a bug](https://github.com/yourusername/dental-ai/issues)

---

## 🙏 Acknowledgments

This project was developed with dedication to improving dental healthcare accessibility through AI technology. We appreciate all contributions and feedback from the community.

**Last Updated:** May 2026
