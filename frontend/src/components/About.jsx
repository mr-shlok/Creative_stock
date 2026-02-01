import React from 'react';

const About = () => {
    return (
        <section id="about" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            About <span className="text-red-600">Creative Stock</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Creative Stock is a premier platform for designers, photographers, and creators to share their work with the world. We believe in the power of visual inspiration and aim to provide a high-quality repository for all your creative needs.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Our community is built on collaboration and passion. Whether you're looking for the perfect image for your next project or want to showcase your portfolio, Creative Stock is your home.
                        </p>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-900">10k+</span>
                                <span className="text-sm text-gray-500 uppercase font-semibold">Creators</span>
                            </div>
                            <div className="w-[1px] h-12 bg-gray-200"></div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-900">500k+</span>
                                <span className="text-sm text-gray-500 uppercase font-semibold">Assets</span>
                            </div>
                            <div className="w-[1px] h-12 bg-gray-200"></div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-900">1M+</span>
                                <span className="text-sm text-gray-500 uppercase font-semibold">Downloads</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        <div className="rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"
                                alt="Workspace"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
