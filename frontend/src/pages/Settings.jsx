import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Settings = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">Settings</h1>
                        <p className="text-gray-500 font-medium">Customize your account experience and security.</p>
                    </header>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Security</h3>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl outline-none transition-all">
                                <div>
                                    <p className="font-bold text-gray-900">Change Password</p>
                                    <p className="text-sm text-gray-500">Update your account security regularly.</p>
                                </div>
                                <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm">
                                    Update
                                </button>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Notifications</h3>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl outline-none transition-all">
                                <div>
                                    <p className="font-bold text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-500">Receive weekly inspiration digests.</p>
                                </div>
                                <div className="w-12 h-6 bg-red-600 rounded-full cursor-pointer transition-all flex items-center px-1">
                                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
