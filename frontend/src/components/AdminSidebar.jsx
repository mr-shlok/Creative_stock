import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Plus,
    User,
    Settings,
    Layout,
    MessageCircle,
    LogOut,
    AlertCircle,
    X,
    Upload
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import { pinApi, uploadApi } from '../utils/api';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: 'Abstract',
        description: ''
    });

    const menuItems = [
        { icon: <Home size={24} />, label: 'Home', path: '/admin' },
        { icon: <Plus size={24} />, label: 'Upload', onClick: () => setShowUploadModal(true), center: true },
        { icon: <Layout size={24} />, label: 'Board', path: '/board' },
        { icon: <MessageCircle size={24} />, label: 'Messages', path: '/messages' },
        { icon: <User size={24} />, label: 'Profile', path: '/profile' },
        { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
    ];

    const handleConfirmLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('isAdminLoggedIn');
        toast.success("Logged out successfully!");
        setShowLogoutModal(false);
        navigate('/');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const uploadResult = await uploadApi.uploadImage(selectedFile);

            const newPin = {
                title: formData.title,
                image: uploadResult.url,
                user: 'Admin', // Or fetch from profile
                price: formData.price,
                category: formData.category,
                description: formData.description
            };

            await pinApi.createPin(newPin);
            toast.success("Photo uploaded successfully!");
            setShowUploadModal(false);
            setPreviewUrl('');
            setSelectedFile(null);
            setFormData({ title: '', price: '', category: 'Abstract', description: '' });

            // Reload page or update state if needed
            window.location.reload();
        } catch (error) {
            toast.error("Upload failed!");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-white border-r border-gray-100 pt-24 pb-8 flex flex-col z-40 transition-all duration-300">
            <div className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    item.onClick ? (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${item.center ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100 my-4' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className={`${item.center ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} transition-colors mx-auto md:mx-0`}>
                                {item.icon}
                            </div>
                            <span className={`hidden md:block font-semibold ${item.center ? 'text-white' : ''}`}>{item.label}</span>
                        </button>
                    ) : (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${location.pathname === item.path
                                ? 'bg-red-50 text-red-600'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className={`${location.pathname === item.path ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-900'} transition-colors mx-auto md:mx-0`}>
                                {item.icon}
                            </div>
                            <span className="hidden md:block font-semibold">{item.label}</span>
                        </Link>
                    )
                ))}
            </div>

            <div className="px-4">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200 group"
                >
                    <div className="text-gray-400 group-hover:text-red-600 transition-colors mx-auto md:mx-0">
                        <LogOut size={24} />
                    </div>
                    <span className="hidden md:block font-semibold">Logout</span>
                </button>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-400" />
                        </button>

                        <h3 className="text-2xl font-black text-gray-900 mb-6">Upload New Creation</h3>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div
                                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${previewUrl ? 'border-red-200 bg-red-50/30' : 'border-gray-200 hover:border-red-400'
                                    }`}
                            >
                                {previewUrl ? (
                                    <div className="relative group">
                                        <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-2xl shadow-md" />
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
                                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                            <Upload className="w-8 h-8 text-red-600" />
                                        </div>
                                        <span className="text-gray-900 font-bold mb-1">Click to upload</span>
                                        <span className="text-gray-500 text-sm">PNG, JPG, SVG up to 10MB</span>
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-2xl outline-none"
                                        placeholder="Awesome Photo"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Price (INR)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-2xl outline-none"
                                        placeholder="1200"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUploading || !selectedFile}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 disabled:bg-gray-300 shadow-lg shadow-red-100 transition-all"
                            >
                                {isUploading ? 'Uploading...' : 'Publish Creation'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Logout Modal (same as Sidebar.jsx) */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 transform transition-all animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Wait a second!</h3>
                            <p className="text-gray-500 font-medium mb-8">Are you sure you want to log out from Admin?</p>

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

export default AdminSidebar;
