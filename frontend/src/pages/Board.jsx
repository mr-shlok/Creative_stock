import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Board = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">My Boards</h1>
                        <p className="text-gray-500 font-medium">Organize your favorite inspirations into creative boards.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="aspect-[4/3] bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-500 cursor-pointer transition-all group">
                            <div className="mb-2 p-4 bg-gray-50 rounded-full group-hover:bg-red-50 transition-colors">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg">Create New Board</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Board;
