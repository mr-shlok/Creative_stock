# Creative Stock - Project Summary

## 🎯 Project Overview
Creative Stock is a visual discovery platform inspired by Pinterest, built with React, Tailwind CSS, and GSAP for animations. It features a masonry grid layout, search functionality, pin detail views, and an admin dashboard for content management.

## ✨ Key Features Implemented

### Frontend
- **Homepage Feed**: Pinterest-style masonry grid layout with infinite scrolling
- **Search Functionality**: Filter pins by title, description, or category
- **Pin Detail View**: Modal view with detailed pin information
- **Admin Dashboard**: Secure admin panel for managing pins and categories
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Animations**: Smooth GSAP animations for all interactions
- **Clean UI**: Minimalist design focused on visual content

### Backend
- **RESTful API**: Full CRUD operations for pins and categories
- **Admin Authentication**: Secure admin login system
- **Data Management**: Complete pin and category management endpoints

## 🛠 Tech Stack Used

### Frontend
- React 18
- Tailwind CSS
- GSAP (GreenSock)
- React Router DOM
- Custom API utilities

### Backend
- Python Flask
- CORS support
- In-memory data storage (would use database in production)

## 📁 Project Structure
```
creative-stock/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── GridFeed.js
│   │   │   └── PinCard.js
│   │   ├── pages/
│   │   │   ├── SearchPage.js
│   │   │   ├── PinDetail.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── backend/
    ├── app.py
    ├── requirements.txt
    └── gunicorn.conf.py
```

## 🚀 How to Run

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Visit `http://localhost:3000`

### Backend
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Start the server: `python app.py`
6. API available at `http://localhost:5000/api`

## 🔐 Admin Credentials
- Email: `admin@creativestock.com`
- Password: `admin123`

## 📊 API Endpoints
- `GET /api/pins` - Get all pins with optional filtering
- `GET /api/pins/:id` - Get a specific pin
- `POST /api/pins` - Create a new pin (admin only)
- `PUT /api/pins/:id` - Update a pin (admin only)
- `DELETE /api/pins/:id` - Delete a pin (admin only)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category (admin only)
- `POST /api/admin/login` - Admin login

## 🎨 Animation Features
- Pin fade-in animations on page load
- Hover effects on pin cards with action buttons reveal
- Smooth transitions for modal popups
- Loading animations for infinite scroll
- Interactive hover states for all UI elements

## 📱 Responsive Behavior
- 4 columns on desktop
- 3 columns on tablet
- 2 columns on mobile
- 1 column on small mobile screens
- Collapsible header for mobile devices

## 🏗 Architecture Highlights
- Modular component structure
- Centralized API utilities
- State management with React hooks
- Proper error handling
- Security considerations for admin functions
- Performance optimizations

## 🎉 Conclusion
Creative Stock successfully replicates Pinterest's core functionality with a modern tech stack, responsive design, and smooth animations. The application demonstrates professional-level implementation of both frontend and backend technologies.