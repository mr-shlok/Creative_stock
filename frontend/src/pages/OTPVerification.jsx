import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

const OTPVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleResendOTP = async () => {
        if (!email) {
            toast.error("Email not found. Please try signing up again.");
            return;
        }
        setResending(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("A new 6-digit code has been sent!");
        }
        setResending(false);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = otp.join('');

        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
        });

        if (error) {
            toast.error(error.message);
            setError(error.message);
            setLoading(false);
        } else {
            toast.success('Verification successful!');
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 whitespace-nowrap">Verify Email</h2>
                        <p className="text-gray-500">
                            We've sent a 6-digit code to <br />
                            <span className="font-bold text-gray-900">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-10">
                        <div className="flex justify-between gap-3">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-16 text-center text-3xl font-black border-2 border-gray-100 bg-gray-50 rounded-2xl focus:border-red-500 focus:bg-white focus:outline-none transition-all"
                                    required
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.some(v => v === '')}
                            className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 disabled:bg-gray-300 shadow-xl shadow-red-100 transition-all transform hover:-translate-y-1"
                        >
                            {loading ? 'Verifying...' : 'Verify Account'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-medium">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                disabled={resending}
                                className="text-red-600 font-bold hover:underline disabled:text-gray-400"
                                onClick={handleResendOTP}
                            >
                                {resending ? 'Resending...' : 'Resend'}
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OTPVerification;
