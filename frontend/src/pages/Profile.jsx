import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Profile = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">My Profile</h1>
                        <p className="text-gray-500 font-medium">Manage your personal information and preferences.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                                <div className="w-32 h-32 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center text-red-600 text-4xl font-black border-4 border-white shadow-md">
                                    U
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">User Name</h2>
                                <p className="text-gray-500 mb-6 font-medium">user@example.com</p>
                                <button className="w-full py-3 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all">
                                    Edit Avatar
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                                <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                        <input type="text" placeholder="Your Name" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                                        <input type="text" placeholder="username" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all" />
                                    </div>
                                </div>
                                <button className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all transform hover:-translate-y-1">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
