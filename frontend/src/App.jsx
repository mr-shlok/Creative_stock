import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import UserDashboard from './pages/UserDashboard';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Board from './pages/Board';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminUpload from './pages/AdminUpload';
import Overview from './pages/Overview';
import Search from './pages/Search';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-otp" element={<OTPVerification />} />

                    {/* Protected User Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
                    <Route path="/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
                    <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/upload" element={<ProtectedRoute adminOnly><AdminUpload /></ProtectedRoute>} />

                    <Route path="/search" element={<Search />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
