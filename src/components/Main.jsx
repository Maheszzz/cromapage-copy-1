import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Bell, Settings, BarChart3, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';

function MainScreen({ onLogout, user }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className={`fixed inset-0 z-30 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex flex-col h-full bg-white shadow-md w-64 p-4">
                    {/* Close button for mobile */}
                    <div className="flex justify-end lg:hidden">
                        <button onClick={toggleSidebar} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center justify-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900">MyApp</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1">
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                                    <User className="w-5 h-5 mr-3" />
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                                    <Mail className="w-5 h-5 mr-3" />
                                    Messages
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                                    <Lock className="w-5 h-5 mr-3" />
                                    Security
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                                    <Settings className="w-5 h-5 mr-3" />
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                                    <BarChart3 className="w-5 h-5 mr-3" />
                                    Analytics
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="p-2">
                        <button
                            onClick={onLogout}
                            className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 p-4 lg:ml-64">
                {/* Mobile menu button */}
                <div className="flex justify-between lg:hidden">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    </div>
                    <div>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">Welcome back, {user.name}!</h3>
                    <p className="mt-1 text-sm text-gray-600">You last logged in on {new Date().toLocaleString()}</p>
                </div>

                {/* Add your main content here */}
            </div>
        </div>
    );
}

MainScreen.propTypes = {
    onLogout: PropTypes.func.isRequired,
    user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string
    })
};

export default MainScreen;