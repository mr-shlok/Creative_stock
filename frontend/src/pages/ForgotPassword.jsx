import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Password reset link sent! Check your email.');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="p-10 bg-white rounded-3xl shadow-xl w-full max-w-md border border-gray-100 text-center">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Forgot Password?</h2>
                    <p className="text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleResetRequest} className="flex flex-col gap-6">
                    <div className="space-y-1 text-left">
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
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-2 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 disabled:bg-gray-300 shadow-lg shadow-red-100 transition-all transform hover:-translate-y-1"
                    >
                        {loading ? 'Sending link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-8">
                    <Link to="/login" className="text-sm font-bold text-red-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
