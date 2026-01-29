# Creative Stock - Pinterest Clone

Creative Stock is a complete visual discovery platform inspired by Pinterest, built with React, Tailwind CSS, and GSAP for animations. It features a masonry grid layout, search functionality, pin detail views, and an admin dashboard for content management.

## 🌟 Features

- **Homepage Feed**: Pinterest-style masonry grid layout with infinite scrolling
- **Search Functionality**: Filter pins by title, description, or category
- **Pin Detail View**: Modal view with detailed pin information
- **Admin Dashboard**: Secure admin panel for managing pins and categories
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Animations**: Smooth GSAP animations for all interactions
- **Clean UI**: Minimalist design focused on visual content
- **Full CRUD Operations**: Complete create, read, update, delete functionality
- **Secure Admin Authentication**: Protected admin routes and functionality

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- GSAP (GreenSock)
- React Router DOM
- Custom API utilities

### Backend
- Python Flask
- Flask-CORS
- RESTful API architecture

## Installation

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Start the server: `python app.py`

## Admin Credentials

For the admin dashboard:
- Email: `admin@creativestock.com`
- Password: `admin123`

## API Endpoints

The backend provides the following endpoints:

- `GET /api/pins` - Get all pins with optional filtering
- `GET /api/pins/:id` - Get a specific pin
- `POST /api/pins` - Create a new pin (admin only)
- `PUT /api/pins/:id` - Update a pin (admin only)
- `DELETE /api/pins/:id` - Delete a pin (admin only)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category (admin only)
- `POST /api/admin/login` - Admin login

## Project Structure

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

## Animation Features

- Pin fade-in animations on page load
- Hover effects on pin cards with action buttons reveal
- Smooth transitions for modal popups
- Loading animations for infinite scroll
- Interactive hover states for all UI elements

## Responsive Behavior

- 4 columns on desktop
- 3 columns on tablet
- 2 columns on mobile
- 1 column on small mobile screens
- Collapsible header for mobile devices

## 🚀 Quick Start

1. Clone the repository
2. Install frontend dependencies: `cd frontend && npm install`
3. Install backend dependencies: `cd backend && pip install -r requirements.txt`
4. Start backend: `cd backend && python app.py`
5. Start frontend: `cd frontend && npm start`
6. Visit `http://localhost:3000` in your browser

## 🛡️ Security Features

- Admin authentication with secure login
- Protected admin routes
- API endpoint security
- Client-side session management

## 📊 Data Model

The application manages two primary entities:
- **Pins**: Images with metadata (title, description, user, category, tags, engagement metrics)
- **Categories**: Organizational tags for content classification

## 🎨 UI/UX Highlights

- Pinterest-inspired masonry grid layout
- Smooth hover animations and transitions
- Responsive design for all device sizes
- Intuitive navigation and search
- Engaging visual interactions

## 🏗️ Architecture Overview

The application follows a modern client-server architecture:
- **Frontend**: React-based single-page application with component-driven development
- **Backend**: RESTful API with Flask providing data services
- **State Management**: React hooks for local state, API integration for remote data
- **Styling**: Tailwind CSS for utility-first styling approach
- **Animations**: GSAP for high-performance animations

## 🧪 Testing

The application is built with testability in mind:
- Component-based architecture allows for modular testing
- API utility functions are designed for easy mocking
- Clear separation of concerns enables focused testing strategies

## 🚢 Deployment Ready

- Backend configured for production deployment
- Frontend optimized for production builds
- Environment-based configuration
- Proper error handling and logging

## 🤝 Contributing

This project serves as a comprehensive example of modern web development practices. Contributions and suggestions for improvements are welcome.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
