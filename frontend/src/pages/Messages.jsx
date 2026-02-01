import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Messages = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">My Messages</h1>
                        <p className="text-gray-500 font-medium">Connect and collaborate with other creators.</p>
                    </header>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex min-h-[500px]">
                        <div className="w-1/3 border-r border-gray-100 p-6 flex flex-col items-center justify-center text-center bg-gray-50/50">
                            <p className="text-gray-400 font-medium">No recent conversations</p>
                        </div>
                        <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a message</h2>
                            <p className="text-gray-500 max-w-xs font-medium">Pick a person from the left menu to start a conversation.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Messages;
