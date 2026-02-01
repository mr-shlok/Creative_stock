import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Password updated successfully! Please login.');
            navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="p-10 bg-white rounded-3xl shadow-xl w-full max-w-md border border-gray-100 text-center">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">New Password</h2>
                    <p className="text-gray-500">Choose a strong new password for your account.</p>
                </div>

                <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                    <div className="space-y-1 text-left">
                        <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-2 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 disabled:bg-gray-300 shadow-lg shadow-red-100 transition-all transform hover:-translate-y-1"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
