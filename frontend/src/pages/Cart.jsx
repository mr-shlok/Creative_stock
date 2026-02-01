import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Cart = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">My Cart</h1>
                        <p className="text-gray-500 font-medium">Review and manage your selected inspirations.</p>
                    </header>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 max-w-xs mx-auto mb-6">Looks like you haven't added any inspirations to your cart yet.</p>
                        <button className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                            Start Exploring
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Cart;
