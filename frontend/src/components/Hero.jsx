import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Hero = () => {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.fromTo(heroRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            ).fromTo(textRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                "-=0.5"
            );
        }, heroRef); // Scope to heroRef container

        return () => ctx.revert();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
            <div
                ref={heroRef}
                className="container mx-auto px-4 flex flex-col items-center text-center"
            >
                <div ref={textRef} className="max-w-3xl mx-auto z-10 relative">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Get your next <br />
                        <span className="text-red-600">inspiration</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Discover and share creative ideas from around the world. quality images, vectors and more from Creative Stock.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button className="px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 shadow-xl shadow-red-100 transition-all">
                            Explore Now
                        </button>
                        <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 border-2 border-gray-100 transition-all">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
