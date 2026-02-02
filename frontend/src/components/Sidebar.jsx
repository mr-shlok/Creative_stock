import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AdminSidebar from './AdminSidebar';
import UserSidebar from './UserSidebar';

const Sidebar = () => {
    const location = useLocation();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                setRole(profile?.role || 'user');
            } else {
                setRole(null);
            }
            setLoading(false);
        };

        fetchUserRole();
    }, []);

    if (loading) return null;

    // Use pathname as a secondary check or for immediate UI updates
    const isAdminPath = location.pathname.startsWith('/admin');

    if (role === 'admin' || isAdminPath) {
        return <AdminSidebar />;
    }

    return <UserSidebar />;
};

export default Sidebar;
