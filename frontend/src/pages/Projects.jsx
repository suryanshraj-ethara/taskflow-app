import React, { useEffect, useState } from 'react';
import api from '../api';
import { format } from 'date-fns';
import { Plus, MoreVertical, Calendar, Folder } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);

    const fetchProjects = async () => {
        const res = await api.get('/projects/');
        setProjects(res.data.results || res.data);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this project? All associated tasks will also be deleted.")) {
            try {
                await api.delete(`/projects/${id}/`);
                fetchProjects();
            } catch (err) {
                console.error("Failed to delete project", err);
                alert("Failed to delete project. You might not have permission (Admins only).");
            }
        }
        setOpenMenuId(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage and track your team's projects</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Project Details</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Team</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Timeline</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-100">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-surface-50/80 transition-colors group">
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="text-sm font-bold text-surface-900 group-hover:text-primary-600 transition-colors">{project.title}</div>
                                    <div className="text-sm text-surface-500 mt-1">{project.description?.substring(0, 60)}{project.description?.length > 60 ? '...' : ''}</div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex items-center text-xs font-bold rounded-full border ${project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-surface-100 text-surface-700 border-surface-200'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${project.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-surface-500'}`}></span>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {project.members_details?.slice(0, 3).map((member, i) => (
                                            <div key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white z-10">
                                                {member.username.charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                        {project.members_details?.length > 3 && (
                                            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-surface-100 flex items-center justify-center text-xs font-bold text-surface-600 z-0">
                                                +{project.members_details.length - 3}
                                            </div>
                                        )}
                                        {(!project.members_details || project.members_details.length === 0) && (
                                            <span className="text-sm text-surface-400">No members</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-surface-600 font-medium">
                                        <Calendar className="w-4 h-4 mr-2 text-surface-400" />
                                        {project.deadline ? format(new Date(project.deadline), 'MMM dd, yyyy') : 'No deadline'}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium relative">
                                    <button 
                                        onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                                        className="text-surface-400 hover:text-primary-600 transition-colors p-2 hover:bg-primary-50 rounded-lg focus:outline-none"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                    
                                    {openMenuId === project.id && (
                                        <div className="absolute right-8 top-10 w-32 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-50">
                                            <button 
                                                onClick={() => {
                                                    alert("Edit functionality coming soon!");
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(project.id)}
                                                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 mb-4">
                                        <Folder className="w-8 h-8 text-surface-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-surface-900">No projects found</h3>
                                    <p className="text-sm text-surface-500 mt-1">Get started by creating a new project.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Projects;
