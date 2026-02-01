import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Attempting login for:', email);

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.error('Auth Error:', authError);
            toast.error(authError.message);
            setLoading(false);
            return;
        }

        console.log('Auth successful, fetching profile for ID:', authData.user.id);

        // Fetch user profile to check role
        // Removed .single() temporarily to debug if multiple rows or array structure is causing issues
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*') // Changing to * to see what we actually get
            .eq('id', authData.user.id);

        if (profileError) {
            console.error('Profile Fetch Error:', profileError);
            toast.error(`DB Error: ${profileError.message}`);
            setLoading(false);
            return;
        }

        console.log('Profile Data received:', profileData);

        if (!profileData || profileData.length === 0) {
            console.error('No profile found for user');
            toast.error('Profile not found.');
            setLoading(false);
            return;
        }

        const userProfile = profileData[0];
        console.log('User Role:', userProfile.role);

        toast.success('Login successful!');
        if (userProfile.role === 'admin') {
            localStorage.setItem('isAdminLoggedIn', 'true');
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (error) alert(error.message);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="p-10 bg-white rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500">Log in to your Creative Stock account</p>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 border-2 border-gray-100 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all mb-8 shadow-sm"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </button>

                <div className="relative mb-8 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <span className="relative px-4 bg-white text-sm text-gray-400 font-medium uppercase tracking-wider">or with email</span>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all"
                            required
                        />
                        <div className="flex justify-end mt-1">
                            <Link to="/forgot-password" size="sm" className="text-sm font-bold text-red-600 hover:outline-none hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-2 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 disabled:bg-gray-300 shadow-lg shadow-red-100 transition-all transform hover:-translate-y-1"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
                <div className="mt-10 text-center">
                    <p className="text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-red-600 font-bold hover:underline ml-1">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
