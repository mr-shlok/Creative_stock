import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ImageCard from '../components/ImageCard';
import { pinApi } from '../utils/api';
import { toast } from 'react-toastify';
import { Sparkles } from 'lucide-react';

const Overview = () => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPins();
    }, []);

    const fetchPins = async () => {
        try {
            const data = await pinApi.getPins();
            setPins(data);
        } catch (error) {
            toast.error("Failed to fetch images");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-red-600" size={32} />
                            <h1 className="text-4xl font-black text-gray-900">Discover</h1>
                        </div>
                        <p className="text-gray-500 font-medium">Explore stunning creations from our marketplace.</p>
                    </header>

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-[3/4] bg-white rounded-3xl shadow-sm border border-gray-100 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : pins.length === 0 ? (
                        /* Empty State */
                        <div className="py-20 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <Sparkles size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No images yet</h3>
                            <p className="text-gray-500 font-medium">Check back soon for amazing creations!</p>
                        </div>
                    ) : (
                        /* Image Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {pins.map((pin) => (
                                <ImageCard key={pin.id} pin={pin} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Overview;
