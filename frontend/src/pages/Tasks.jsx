import React, { useEffect, useState } from 'react';
import api from '../api';
import { format } from 'date-fns';
import { Plus, MoreVertical, Calendar, CheckSquare } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);

    const fetchTasks = async () => {
        const res = await api.get('/tasks/');
        setTasks(res.data.results || res.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await api.delete(`/tasks/${id}/`);
                fetchTasks();
            } catch (err) {
                console.error("Failed to delete task", err);
                alert("Failed to delete task. You might not have permission.");
            }
        }
        setOpenMenuId(null);
    };

    const handleEdit = async (task) => {
        const newTitle = window.prompt("Enter new task title:", task.title);
        if (newTitle && newTitle !== task.title) {
            try {
                await api.patch(`/tasks/${task.id}/`, { title: newTitle });
                fetchTasks();
            } catch (err) {
                console.error("Failed to edit task", err);
                alert("Failed to edit task.");
            }
        }
        setOpenMenuId(null);
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'HIGH': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'IN_PROGRESS': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            default: return 'bg-surface-100 text-surface-700 border-surface-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900">Tasks</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage and track your assigned tasks</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Task Details</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-100">
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-surface-50/80 transition-colors group">
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="text-sm font-bold text-surface-900 group-hover:text-primary-600 transition-colors">{task.title}</div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-surface-600">
                                    {task.project_details?.title || `Project #${task.project}`}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex items-center text-xs font-bold rounded-full border ${getStatusColor(task.status)}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${task.status === 'COMPLETED' ? 'bg-emerald-500' : task.status === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-surface-500'}`}></span>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-surface-600 font-medium">
                                        <Calendar className="w-4 h-4 mr-2 text-surface-400" />
                                        {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium relative">
                                    <button 
                                        onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                                        className="text-surface-400 hover:text-primary-600 transition-colors p-2 hover:bg-primary-50 rounded-lg focus:outline-none"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                    
                                    {openMenuId === task.id && (
                                        <div className="absolute right-8 top-10 w-32 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-50">
                                            <button 
                                                onClick={() => handleEdit(task)}
                                                className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
                                            >
                                                Quick Edit Title
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(task.id)}
                                                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 mb-4">
                                        <CheckSquare className="w-8 h-8 text-surface-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-surface-900">No tasks found</h3>
                                    <p className="text-sm text-surface-500 mt-1">Get started by assigning a new task.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tasks;
