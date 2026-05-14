import React, { useEffect, useState } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle, Clock, Folder, CheckSquare, Activity } from 'lucide-react';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, colorClass, gradientClass }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full opacity-10 ${gradientClass} blur-2xl group-hover:opacity-20 transition-opacity`}></div>
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-').replace('-500', '-600')}`} />
            </div>
            <div className="text-surface-400">
                <Activity className="w-4 h-4 opacity-50" />
            </div>
        </div>
        <div>
            <h3 className="text-3xl font-bold text-surface-900 mb-1">{value}</h3>
            <p className="text-sm font-medium text-surface-500">{title}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-4 bg-surface-200 rounded w-3/4"></div><div className="space-y-3"><div className="grid grid-cols-4 gap-4"><div className="h-32 bg-surface-200 rounded-2xl"></div><div className="h-32 bg-surface-200 rounded-2xl"></div><div className="h-32 bg-surface-200 rounded-2xl"></div><div className="h-32 bg-surface-200 rounded-2xl"></div></div></div></div></div>;

    const chartData = [
        { name: 'Completed', value: stats.completed_tasks, color: '#10b981' },
        { name: 'Pending', value: stats.total_tasks - stats.completed_tasks - stats.overdue_tasks, color: '#3b82f6' },
        { name: 'Overdue', value: stats.overdue_tasks, color: '#f43f5e' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-surface-500 mt-1">Welcome back, here's what's happening with your tasks today.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Projects" value={stats.total_projects} icon={Folder} colorClass="bg-blue-500" gradientClass="bg-blue-500" />
                <StatCard title="Total Tasks" value={stats.total_tasks} icon={CheckSquare} colorClass="bg-indigo-500" gradientClass="bg-indigo-500" />
                <StatCard title="Completed Tasks" value={stats.completed_tasks} icon={CheckCircle} colorClass="bg-emerald-500" gradientClass="bg-emerald-500" />
                <StatCard title="Overdue Tasks" value={stats.overdue_tasks} icon={Clock} colorClass="bg-rose-500" gradientClass="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-surface-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-surface-900">Task Status Distribution</h2>
                            <p className="text-sm text-surface-500 mt-1">Overview of your current task statuses</p>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-8 flex flex-col">
                    <h2 className="text-xl font-bold text-surface-900 mb-1">Recent Activity</h2>
                    <p className="text-sm text-surface-500 mb-6">Latest updates across projects</p>
                    
                    <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {stats.recent_activity.map((task, index) => (
                            <div key={task.id} className="relative flex items-start group">
                                {index !== stats.recent_activity.length - 1 && (
                                    <div className="absolute top-8 left-3 w-px h-full bg-surface-200 group-hover:bg-primary-200 transition-colors"></div>
                                )}
                                <div className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white ${task.status === 'COMPLETED' ? 'bg-emerald-100' : task.status === 'TODO' ? 'bg-surface-100' : 'bg-blue-100'}`}>
                                    <div className={`w-2 h-2 rounded-full ${task.status === 'COMPLETED' ? 'bg-emerald-500' : task.status === 'TODO' ? 'bg-surface-400' : 'bg-blue-500'}`} />
                                </div>
                                <div className="ml-4 bg-surface-50 rounded-xl p-3 flex-1 border border-surface-100 group-hover:border-primary-100 transition-colors">
                                    <p className="text-sm font-semibold text-surface-900 leading-tight">{task.title}</p>
                                    <p className="text-xs text-surface-500 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(task.updated_at), 'MMM dd, yyyy • h:mm a')}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {stats.recent_activity.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-surface-400">
                                <Activity className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
