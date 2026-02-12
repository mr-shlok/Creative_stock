import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { boardApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Board = () => {
    const { user } = useAuth();
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoards = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const data = await boardApi.getBoards(user.id);
                setBoards(data);
            } catch (error) {
                console.error('Error fetching boards:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoards();
    }, [user]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Header />
            <Sidebar />

            <main className="flex-grow pt-24 pl-24 md:pl-72 pr-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">My Boards</h1>
                        <p className="text-gray-500 font-medium">
                            Organize your favorite inspirations into creative boards.
                        </p>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-[4/3] bg-white rounded-3xl shadow-sm border border-gray-100 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : boards.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-12 h-12 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-xl font-medium">
                                You don't have any boards yet.
                            </p>
                            <p className="text-gray-500 mt-2">
                                Create a board while uploading from the admin upload page to see it here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {boards.map((board) => (
                                <div
                                    key={board.id}
                                    className="aspect-[4/3] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md hover:border-red-200 transition-all cursor-pointer"
                                >
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 mb-1 truncate">
                                            {board.name}
                                        </h2>
                                        <p className="text-gray-400 text-xs font-medium">
                                            Created at {new Date(board.created_at || '').toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500 font-medium">
                                        Board ID: <span className="font-mono text-gray-600">{board.id}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Board;
