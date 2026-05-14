import React from 'react';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="h-20 glass flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center w-96 bg-surface-100/50 rounded-full px-4 py-2.5 border border-surface-200 focus-within:border-primary-400 focus-within:bg-white focus-within:shadow-md focus-within:shadow-primary-500/5 transition-all duration-300 group">
                <Search className="w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search projects, tasks, or members..." 
                    className="bg-transparent border-none outline-none ml-3 text-sm w-full text-surface-700 placeholder-surface-400"
                />
            </div>
            
            <div className="flex items-center gap-4">
                <button className="relative p-2.5 bg-surface-100/50 text-surface-500 rounded-full hover:bg-surface-200 hover:text-surface-700 transition-all border border-surface-200 hover:shadow-sm">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
