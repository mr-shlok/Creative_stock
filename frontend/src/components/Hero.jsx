import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Hero = () => {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(heroRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        ).fromTo(textRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.5"
        );
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="relative pt-24 pb-12 overflow-hidden">
            <div
                ref={heroRef}
                className="container mx-auto px-4 flex flex-col items-center text-center"
            >
                <div ref={textRef} className="max-w-3xl mx-auto z-10 relative">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Get your next <span className="text-red-600">inspiration</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Discover and share creative ideas from around the world. quality images, vectors and more from Creative Stock.
                    </p>

                    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for 'nature', 'abstract', 'people'..."
                            className="w-full px-6 py-4 rounded-full shadow-lg border-2 border-transparent focus:border-red-500 focus:outline-none text-lg transition-all duration-300"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-colors duration-300"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-20 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
