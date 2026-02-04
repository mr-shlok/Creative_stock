import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({
    user: null,
    role: null,
    loading: true,
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const lastFetchedUserId = useRef(null);
    const isFetching = useRef(false);

    const fetchRole = async (userId) => {
        if (!userId) {
            setRole(null);
            setLoading(false);
            return;
        }

        // Avoid parallel or redundant fetches for the same user
        if (isFetching.current || lastFetchedUserId.current === userId) {
            if (lastFetchedUserId.current === userId) {
                setLoading(false);
            }
            return;
        }

        try {
            isFetching.current = true;
            lastFetchedUserId.current = userId;

            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                // If profile doesn't exist yet (user just signed up), default to 'user'
                if (error.code === 'PGRST116') {
                    console.log('Profile not found yet, defaulting to user role');
                    setRole('user');
                } else {
                    throw error;
                }
            } else {
                // If data is null, it means the profile hasn't been created yet by the trigger
                const userRole = data?.role || 'user';
                setRole(userRole);
                if (userRole === 'admin') {
                    localStorage.setItem('isAdminLoggedIn', 'true');
                } else {
                    localStorage.removeItem('isAdminLoggedIn');
                }
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            setRole('user');
            localStorage.removeItem('isAdminLoggedIn');
        } finally {
            isFetching.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const handleAuthChange = async (session) => {
            const currentUser = session?.user ?? null;
            if (!isMounted) return;

            setUser(currentUser);
            if (currentUser) {
                await fetchRole(currentUser.id);
            } else {
                setRole(null);
                lastFetchedUserId.current = null;
                localStorage.removeItem('isAdminLoggedIn');
                setLoading(false);
            }
        };

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuthChange(session);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleAuthChange(session);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('isAdminLoggedIn');
            setUser(null);
            setRole(null);
            lastFetchedUserId.current = null;
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const value = {
        user,
        role,
        loading,
        isAdmin: role === 'admin',
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
