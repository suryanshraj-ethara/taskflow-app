import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Trash2, Users, UserPlus, X } from 'lucide-react';

const Team = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMember, setNewMember] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        const res = await api.get('/users/');
        setUsers(res.data.results || res.data);
    };

    const fetchProjects = async () => {
        const res = await api.get('/projects/');
        setProjects(res.data.results || res.data);
    };

    useEffect(() => {
        fetchUsers();
        fetchProjects();
    }, []);

    const handleAddMember = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register/', { ...newMember });
            setShowAddModal(false);
            setNewMember({ username: '', email: '', password: '', first_name: '', last_name: '' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.username?.[0] || err.response?.data?.password?.[0] || 'Failed to add member.');
        }
    };

    const handleDeleteMember = async (id) => {
        if (window.confirm('Are you sure you want to remove this team member? This action cannot be undone.')) {
            try {
                await api.delete(`/users/${id}/`);
                fetchUsers();
            } catch (err) {
                alert('Failed to remove member. You may not have permission.');
            }
        }
    };

    // Group members into teams by projects
    const getTeams = () => {
        const teams = {};
        projects.forEach(p => {
            if (p.members_details && p.members_details.length > 0) {
                teams[p.title] = p.members_details;
            }
        });
        return teams;
    };

    const teams = getTeams();
    const avatarColors = [
        'from-indigo-500 to-purple-600',
        'from-emerald-500 to-teal-600',
        'from-rose-500 to-pink-600',
        'from-amber-500 to-orange-600',
        'from-cyan-500 to-blue-600',
        'from-violet-500 to-fuchsia-600',
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Team Management</h1>
                    <p className="text-sm text-surface-500 mt-1">{users.length} members across {Object.keys(teams).length} teams</p>
                </div>
                {user?.role === 'ADMIN' && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Member
                    </button>
                )}
            </div>

            {/* Teams Section */}
            {Object.keys(teams).length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-surface-900 mb-4">Teams by Project</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(teams).map(([teamName, members], teamIdx) => (
                            <div key={teamName} className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[teamIdx % avatarColors.length]} flex items-center justify-center shadow-md`}>
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-surface-900">{teamName}</h3>
                                        <p className="text-xs text-surface-500">{members.length} members</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {members.map((member, i) => (
                                        <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 transition-colors">
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[(teamIdx + i + 1) % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold uppercase`}>
                                                {member.first_name?.charAt(0) || member.username.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-surface-900 capitalize">{member.first_name || member.username}</p>
                                                <p className="text-xs text-surface-500">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Members Table */}
            <div>
                <h2 className="text-lg font-bold text-surface-900 mb-4">All Members</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-surface-200">
                        <thead className="bg-surface-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Role</th>
                                {user?.role === 'ADMIN' && (
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-surface-100">
                            {users.map((member, i) => (
                                <tr key={member.id} className="hover:bg-surface-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold uppercase`}>
                                                {member.first_name?.charAt(0) || member.username.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-surface-900 capitalize">{member.first_name} {member.last_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 font-medium">@{member.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">{member.email || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex items-center text-xs font-bold rounded-full border ${member.role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    {user?.role === 'ADMIN' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {member.username !== user.username && (
                                                <button
                                                    onClick={() => handleDeleteMember(member.id)}
                                                    className="text-surface-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                                                    title="Remove member"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl border border-surface-200 w-full max-w-md p-8 relative animate-slide-up" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-surface-400 hover:text-surface-600">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-surface-900 mb-1">Add New Member</h3>
                        <p className="text-sm text-surface-500 mb-6">This member will be added to the team with Member role.</p>
                        
                        <form className="space-y-4" onSubmit={handleAddMember}>
                            {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium text-center">{error}</div>}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1">First Name</label>
                                    <input value={newMember.first_name} onChange={e => setNewMember({...newMember, first_name: e.target.value})} className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1">Last Name</label>
                                    <input value={newMember.last_name} onChange={e => setNewMember({...newMember, last_name: e.target.value})} className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-surface-700 mb-1">Username <span className="text-rose-500">*</span></label>
                                <input value={newMember.username} onChange={e => setNewMember({...newMember, username: e.target.value})} required className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="johndoe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-surface-700 mb-1">Email</label>
                                <input value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} type="email" className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-surface-700 mb-1">Password <span className="text-rose-500">*</span></label>
                                <input value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} type="password" required className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="••••••••" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5">
                                Add Member
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
