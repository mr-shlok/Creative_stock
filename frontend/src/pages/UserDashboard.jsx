import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserDashboard = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-8">
                <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
                <div className="bg-white p-6 rounded shadow">
                    <p className="text-lg">Welcome to your dashboard!</p>
                    {/* Add user specific content here */}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;
