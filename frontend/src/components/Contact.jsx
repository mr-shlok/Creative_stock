import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Get in Touch</h2>
                    <p className="text-gray-600">Have questions or feedback? We'd love to hear from you. Reach out to our team anytime.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-red-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                <p className="text-gray-600">support@creativestock.com</p>
                                <p className="text-gray-600">hello@creativestock.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-red-600">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                                <p className="text-gray-600">+1 (555) 000-0000</p>
                                <p className="text-gray-600">+1 (555) 123-4567</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-red-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                                <p className="text-gray-600">123 Creative St, Design District</p>
                                <p className="text-gray-600">New York, NY 10001</p>
                            </div>
                        </div>
                    </div>

                    <form className="bg-white p-8 rounded-3xl shadow-xl space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-xl outline-none transition-all"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-xl outline-none transition-all"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Your Message"
                                rows="4"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-xl outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                        <button className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
