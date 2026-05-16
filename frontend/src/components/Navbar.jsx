import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Folder, CheckSquare, Users, X, Clock, AlertTriangle, UserPlus, Check } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';

const DUMMY_NOTIFICATIONS = [
    { id: 1, type: 'task', icon: AlertTriangle, color: 'bg-rose-50 text-rose-600', title: 'Overdue task alert', message: 'API security audit is past its deadline', time: '2 min ago', read: false },
    { id: 2, type: 'team', icon: UserPlus, color: 'bg-emerald-50 text-emerald-600', title: 'New member joined', message: 'Rahul Tiwari has been added to Team Beta', time: '15 min ago', read: false },
    { id: 3, type: 'task', icon: Check, color: 'bg-blue-50 text-blue-600', title: 'Task completed', message: 'Ankit marked "Design data pipeline architecture" as done', time: '1 hr ago', read: false },
    { id: 4, type: 'project', icon: Folder, color: 'bg-indigo-50 text-indigo-600', title: 'Project deadline approaching', message: 'Atlas project deadline is in 30 days', time: '2 hrs ago', read: true },
    { id: 5, type: 'task', icon: CheckSquare, color: 'bg-amber-50 text-amber-600', title: 'Task assigned to you', message: 'You have been assigned "Optimize database queries"', time: '3 hrs ago', read: true },
    { id: 6, type: 'team', icon: Users, color: 'bg-purple-50 text-purple-600', title: 'Team update', message: 'Team Delta (Vindex) has 3 new pending tasks', time: '5 hrs ago', read: true },
    { id: 7, type: 'task', icon: Check, color: 'bg-blue-50 text-blue-600', title: 'Task completed', message: 'Priya completed "Design transaction history page"', time: 'Yesterday', read: true },
    { id: 8, type: 'project', icon: Folder, color: 'bg-indigo-50 text-indigo-600', title: 'Project status changed', message: 'Vindex project has been put on hold', time: 'Yesterday', read: true },
];

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ projects: [], tasks: [], members: [] });
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
    const searchRef = useRef(null);
    const notifRef = useRef(null);
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (query.trim().length === 0) {
            setResults({ projects: [], tasks: [], members: [] });
            setShowResults(false);
            return;
        }
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const [projectsRes, tasksRes, usersRes] = await Promise.all([
                    api.get(`/projects/?search=${encodeURIComponent(query)}`),
                    api.get(`/tasks/?search=${encodeURIComponent(query)}`),
                    api.get(`/users/?search=${encodeURIComponent(query)}`),
                ]);
                const projects = (projectsRes.data.results || projectsRes.data).slice(0, 4);
                const tasks = (tasksRes.data.results || tasksRes.data).slice(0, 4);
                const allUsers = usersRes.data.results || usersRes.data;
                const q = query.toLowerCase();
                const members = allUsers.filter(u =>
                    u.username.toLowerCase().includes(q) ||
                    (u.first_name && u.first_name.toLowerCase().includes(q)) ||
                    (u.last_name && u.last_name.toLowerCase().includes(q)) ||
                    (u.email && u.email.toLowerCase().includes(q))
                ).slice(0, 4);
                setResults({ projects, tasks, members });
                setShowResults(true);
            } catch (err) { console.error('Search failed:', err); }
            finally { setLoading(false); }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleClear = () => { setQuery(''); setResults({ projects: [], tasks: [], members: [] }); setShowResults(false); };
    const handleNavigate = (path) => { setShowResults(false); setQuery(''); navigate(path); };
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const totalResults = results.projects.length + results.tasks.length + results.members.length;

    return (
        <header className="h-20 glass flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Search */}
            <div className="relative" ref={searchRef}>
                <div className="flex items-center w-96 bg-surface-100/50 rounded-full px-4 py-2.5 border border-surface-200 focus-within:border-primary-400 focus-within:bg-white focus-within:shadow-md focus-within:shadow-primary-500/5 transition-all duration-300 group">
                    <Search className="w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors shrink-0" />
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => { if (query.trim().length > 0) setShowResults(true); }} placeholder="Search projects, tasks, or members..." className="bg-transparent border-none outline-none ml-3 text-sm w-full text-surface-700 placeholder-surface-400" />
                    {query && <button onClick={handleClear} className="shrink-0 text-surface-400 hover:text-surface-600 transition-colors"><X className="w-4 h-4" /></button>}
                </div>

                {showResults && (
                    <div className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden z-50 animate-slide-up">
                        {loading && <div className="px-5 py-4 text-sm text-surface-400 text-center">Searching...</div>}
                        {!loading && totalResults === 0 && query.trim().length > 0 && (
                            <div className="px-5 py-8 text-center">
                                <Search className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                                <p className="text-sm font-medium text-surface-500">No results found for "{query}"</p>
                            </div>
                        )}
                        {!loading && results.projects.length > 0 && (
                            <div>
                                <div className="px-5 pt-4 pb-2"><p className="text-xs font-bold text-surface-400 uppercase tracking-wider">Projects</p></div>
                                {results.projects.map(p => (
                                    <button key={`p-${p.id}`} onClick={() => handleNavigate('/projects')} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors text-left">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><Folder className="w-4 h-4 text-blue-600" /></div>
                                        <div className="min-w-0"><p className="text-sm font-semibold text-surface-900 truncate">{p.title}</p><p className="text-xs text-surface-500 truncate">{p.description?.substring(0, 60)}</p></div>
                                        <span className={`ml-auto shrink-0 px-2 py-0.5 text-xs font-bold rounded-full ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-100 text-surface-600'}`}>{p.status}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {!loading && results.tasks.length > 0 && (
                            <div className={results.projects.length > 0 ? 'border-t border-surface-100' : ''}>
                                <div className="px-5 pt-4 pb-2"><p className="text-xs font-bold text-surface-400 uppercase tracking-wider">Tasks</p></div>
                                {results.tasks.map(t => (
                                    <button key={`t-${t.id}`} onClick={() => handleNavigate('/tasks')} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors text-left">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0"><CheckSquare className="w-4 h-4 text-indigo-600" /></div>
                                        <div className="min-w-0"><p className="text-sm font-semibold text-surface-900 truncate">{t.title}</p><p className="text-xs text-surface-500 truncate">{t.status.replace('_', ' ')} • {t.priority}</p></div>
                                    </button>
                                ))}
                            </div>
                        )}
                        {!loading && results.members.length > 0 && (
                            <div className={(results.projects.length > 0 || results.tasks.length > 0) ? 'border-t border-surface-100' : ''}>
                                <div className="px-5 pt-4 pb-2"><p className="text-xs font-bold text-surface-400 uppercase tracking-wider">Members</p></div>
                                {results.members.map((m, i) => {
                                    const colors = ['from-indigo-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600'];
                                    return (
                                        <button key={`m-${m.id}`} onClick={() => handleNavigate('/team')} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors text-left">
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-bold uppercase shrink-0`}>{m.first_name?.charAt(0) || m.username.charAt(0)}</div>
                                            <div className="min-w-0"><p className="text-sm font-semibold text-surface-900 capitalize truncate">{m.first_name} {m.last_name}</p><p className="text-xs text-surface-500 truncate">@{m.username} • {m.role}</p></div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {!loading && totalResults > 0 && <div className="border-t border-surface-100 px-5 py-3 bg-surface-50/50"><p className="text-xs text-surface-400 text-center">{totalResults} result{totalResults !== 1 ? 's' : ''} found</p></div>}
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)} 
                        className="relative p-2.5 bg-surface-100/50 text-surface-500 rounded-full hover:bg-surface-200 hover:text-surface-700 transition-all border border-surface-200 hover:shadow-sm"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden z-50 animate-slide-up">
                            <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-surface-900">Notifications</h3>
                                    <p className="text-xs text-surface-500">{unreadCount} unread</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button onClick={markAllRead} className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.map(n => (
                                    <button key={n.id} onClick={() => markAsRead(n.id)} className={`w-full flex items-start gap-3 px-5 py-4 hover:bg-surface-50 transition-colors text-left border-b border-surface-50 ${!n.read ? 'bg-primary-50/30' : ''}`}>
                                        <div className={`w-9 h-9 rounded-xl ${n.color} flex items-center justify-center shrink-0 mt-0.5`}>
                                            <n.icon className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm truncate ${!n.read ? 'font-bold text-surface-900' : 'font-medium text-surface-700'}`}>{n.title}</p>
                                                {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0"></span>}
                                            </div>
                                            <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">{n.message}</p>
                                            <p className="text-xs text-surface-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{n.time}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Avatar */}
                <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-md border-2 border-white hover:shadow-lg hover:scale-105 transition-all cursor-pointer" title="My Profile">
                    {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </button>
            </div>
        </header>
    );
};

export default Navbar;
