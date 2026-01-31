import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import GridFeed from '../components/GridFeed';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Hero />
                <GridFeed />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
