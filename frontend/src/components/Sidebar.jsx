import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutDashboard, Folder, CheckSquare, Users, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/projects', label: 'Projects', icon: Folder },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    ];

    if (user?.role === 'ADMIN') {
        navItems.push({ path: '/team', label: 'Team', icon: Users });
    }

    return (
        <aside className="w-64 glass-dark text-white flex flex-col min-h-screen relative z-20 shadow-2xl">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <span className="font-bold text-white tracking-tighter">TF</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">TaskFlow</h1>
                </div>
                <p className="text-surface-400 text-xs font-medium ml-10 tracking-wide uppercase">{user?.role === 'ADMIN' ? 'Admin Portal' : 'Workspace'}</p>
            </div>
            
            <nav className="flex-1 px-4 space-y-1.5 mt-6">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                isActive 
                                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-inner' 
                                    : 'text-surface-300 hover:bg-surface-800/50 hover:text-white border border-transparent'
                            }`
                        }
                    >
                        <item.icon className={`w-5 h-5 mr-3 transition-colors ${window.location.pathname === item.path ? 'text-primary-400' : 'text-surface-400 group-hover:text-surface-200'}`} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-surface-800/40 rounded-2xl p-4 border border-surface-700/50 backdrop-blur-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-md border-2 border-surface-700 uppercase ring-2 ring-surface-900">
                            {user?.username?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate capitalize">{user?.first_name || user?.username}</p>
                            <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-surface-300 bg-surface-800/50 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
