import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PinCard from '../components/PinCard';
import { pinApi } from '../utils/api';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                setPins([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const data = await pinApi.searchPins(query);
                setPins(data);
            } catch (error) {
                console.error("Failed to search pins", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">
                            Search results for "{query}"
                        </h1>
                        <p className="text-gray-500 font-medium">Found {pins.length} matches for your search.</p>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-square bg-white rounded-3xl shadow-sm border border-gray-100 animate-pulse flex items-center justify-center text-gray-200" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {pins.map((pin) => (
                                <PinCard key={pin.id} pin={pin} />
                            ))}
                            {pins.length === 0 && (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 text-xl font-medium">No results found for your search.</p>
                                    <p className="text-gray-500 mt-2">Try different keywords or check your spelling.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Search;
