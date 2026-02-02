import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    ShoppingCart,
    User,
    Settings,
    Layout,
    MessageCircle,
    LogOut,
    AlertCircle
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const menuItems = [
        { icon: <Home size={24} />, label: 'Home', path: '/dashboard' },
        { icon: <ShoppingCart size={24} />, label: 'Add to Cart', path: '/cart' },
        { icon: <Layout size={24} />, label: 'Board', path: '/board' },
        { icon: <MessageCircle size={24} />, label: 'Messages', path: '/messages' },
        { icon: <User size={24} />, label: 'Profile', path: '/profile' },
        { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
    ];

    const handleConfirmLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Logged out successfully!");
        setShowLogoutModal(false);
        navigate('/');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-white border-r border-gray-100 pt-24 pb-8 flex flex-col z-40 transition-all duration-300">
            <div className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${location.pathname === item.path
                            ? 'bg-red-50 text-red-600'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <div className={`${location.pathname === item.path ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`}>
                            {item.icon}
                        </div>
                        <span className="hidden md:block font-semibold">{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="px-4">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200 group"
                >
                    <div className="text-gray-400 group-hover:text-red-600 transition-colors">
                        <LogOut size={24} />
                    </div>
                    <span className="hidden md:block font-semibold">Logout</span>
                </button>
            </div>

            {/* Custom Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 transform transition-all animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Wait a second!</h3>
                            <p className="text-gray-500 font-medium mb-8">Are you sure you want to log out of your creative space?</p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={handleConfirmLogout}
                                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 shadow-lg shadow-red-100 transition-all transform hover:-translate-y-1"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
