import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-surface-50 font-sans text-surface-900 selection:bg-primary-500 selection:text-white">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-50 -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-50 -z-10 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
                
                <Navbar />
                <main className="flex-1 overflow-y-auto p-8 z-0">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
