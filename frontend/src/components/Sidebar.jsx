import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import UserSidebar from './UserSidebar';

const Sidebar = () => {
    const location = useLocation();
    const { role, loading, isAdmin } = useAuth();

    if (loading) return null;

    // Use pathname as a secondary check or for immediate UI updates
    const isAdminPath = location.pathname.startsWith('/admin');

    if (isAdmin || isAdminPath) {
        return <AdminSidebar />;
    }

    return <UserSidebar />;
};

export default Sidebar;
