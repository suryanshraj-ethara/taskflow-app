import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import { User, Mail, Shield, Folder, CheckSquare, Users, Hash, Briefcase, Clock } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [allProjects, setAllProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all pages of projects
                let allProj = [];
                let url = '/projects/?page=1';
                while (url) {
                    const res = await api.get(url);
                    const data = res.data;
                    if (data.results) {
                        allProj = [...allProj, ...data.results];
                        if (data.next) {
                            const nextUrl = new URL(data.next);
                            url = nextUrl.pathname.replace('/api', '') + nextUrl.search;
                        } else { url = null; }
                    } else { allProj = data; url = null; }
                }
                setAllProjects(allProj);

                // For admins, show all projects; for members, only projects they belong to
                if (user?.role === 'ADMIN') {
                    setProjects(allProj);
                } else {
                    const myProjects = allProj.filter(p => 
                        p.members_details?.some(m => m.id === user?.id)
                    );
                    setProjects(myProjects);
                }

                // Fetch tasks
                let allTasks = [];
                let tUrl = '/tasks/?page=1';
                while (tUrl) {
                    const res = await api.get(tUrl);
                    const data = res.data;
                    if (data.results) {
                        allTasks = [...allTasks, ...data.results];
                        if (data.next) {
                            const nextUrl = new URL(data.next);
                            tUrl = nextUrl.pathname.replace('/api', '') + nextUrl.search;
                        } else { tUrl = null; }
                    } else { allTasks = data; tUrl = null; }
                }
                setTasks(allTasks);
            } catch (err) {
                console.error('Failed to fetch profile data:', err);
            }
        };
        if (user) fetchData();
    }, [user]);

    // Determine team name from projects
    const getTeamName = () => {
        if (projects.length === 0) return 'Unassigned';
        return projects.map(p => p.title).join(', ');
    };

    // Generate employee ID from user id
    const getEmployeeId = () => {
        if (!user?.id) return 'TD-000';
        return `TD-${String(user.id).padStart(3, '0')}`;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'IN_PROGRESS': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            default: return 'bg-surface-100 text-surface-700 border-surface-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'HIGH': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    const avatarColors = ['from-indigo-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600'];

    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todoTasks = tasks.filter(t => t.status === 'TODO').length;

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                </div>
                {/* Profile Info */}
                <div className="px-8 pb-8 -mt-12 relative">
                    <div className="flex items-end gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black uppercase shadow-xl border-4 border-white ring-4 ring-surface-100">
                            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </div>
                        <div className="mb-1">
                            <h1 className="text-2xl font-extrabold text-surface-900 capitalize">{user?.first_name} {user?.last_name}</h1>
                            <p className="text-surface-500 text-sm font-medium">@{user?.username} • {getEmployeeId()}</p>
                        </div>
                        <div className="ml-auto mb-1">
                            <span className={`px-4 py-1.5 text-sm font-bold rounded-full border ${user?.role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><User className="w-5 h-5 text-indigo-600" /></div>
                        <p className="text-sm font-semibold text-surface-500">Full Name</p>
                    </div>
                    <p className="text-lg font-bold text-surface-900 capitalize">{user?.first_name} {user?.last_name}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Hash className="w-5 h-5 text-emerald-600" /></div>
                        <p className="text-sm font-semibold text-surface-500">Employee ID</p>
                    </div>
                    <p className="text-lg font-bold text-surface-900">{getEmployeeId()}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Mail className="w-5 h-5 text-purple-600" /></div>
                        <p className="text-sm font-semibold text-surface-500">Email</p>
                    </div>
                    <p className="text-lg font-bold text-surface-900 truncate">{user?.email || '—'}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center"><Users className="w-5 h-5 text-rose-600" /></div>
                        <p className="text-sm font-semibold text-surface-500">Team / Project</p>
                    </div>
                    <p className="text-lg font-bold text-surface-900 truncate">{getTeamName()}</p>
                </div>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center"><CheckSquare className="w-7 h-7 text-emerald-600" /></div>
                    <div>
                        <p className="text-3xl font-extrabold text-surface-900">{completedTasks}</p>
                        <p className="text-sm font-medium text-surface-500">Completed</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center"><Clock className="w-7 h-7 text-indigo-600" /></div>
                    <div>
                        <p className="text-3xl font-extrabold text-surface-900">{inProgressTasks}</p>
                        <p className="text-sm font-medium text-surface-500">In Progress</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center"><Briefcase className="w-7 h-7 text-surface-600" /></div>
                    <div>
                        <p className="text-3xl font-extrabold text-surface-900">{todoTasks}</p>
                        <p className="text-sm font-medium text-surface-500">To Do</p>
                    </div>
                </div>
            </div>

            {/* Projects Assigned */}
            <div>
                <h2 className="text-lg font-bold text-surface-900 mb-4">Projects Assigned</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((p, i) => (
                        <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center shadow-md`}>
                                    <Folder className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-surface-900">{p.title}</h3>
                                    <p className="text-xs text-surface-500 truncate">{p.description?.substring(0, 80)}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border shrink-0 ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-surface-100 text-surface-700 border-surface-200'}`}>
                                    {p.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex -space-x-2">
                                    {p.members_details?.slice(0, 4).map((m, mi) => (
                                        <div key={m.id} className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarColors[(i + mi) % avatarColors.length]} flex items-center justify-center text-white text-[10px] font-bold uppercase ring-2 ring-white`}>
                                            {m.first_name?.charAt(0) || m.username.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs text-surface-500 ml-1">{p.members_details?.length || 0} members</span>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-surface-200 p-8 text-center">
                            <Folder className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                            <p className="text-sm font-medium text-surface-500">No projects assigned yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Tasks Assigned */}
            <div>
                <h2 className="text-lg font-bold text-surface-900 mb-4">Tasks Assigned</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-surface-200">
                        <thead className="bg-surface-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Task</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Priority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {tasks.map(t => (
                                <tr key={t.id} className="hover:bg-surface-50/80 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-surface-900">{t.title}</td>
                                    <td className="px-6 py-4 text-sm text-surface-600 font-medium">{t.project_details?.title || `Project #${t.project}`}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex items-center text-xs font-bold rounded-full border ${getStatusColor(t.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${t.status === 'COMPLETED' ? 'bg-emerald-500' : t.status === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-surface-500'}`}></span>
                                            {t.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-surface-500">No tasks assigned yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Profile;
