import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, Shield, Users, BarChart3 } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero / Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden flex-col justify-center items-center p-16">
                {/* Animated background orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '2s'}}></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                
                <div className="relative z-10 text-center max-w-lg">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 border border-emerald-400/30">
                            <span className="text-3xl font-black text-white tracking-tighter">TD</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight mb-4">
                        Todoo
                    </h1>
                    <p className="text-xl text-indigo-200/80 font-medium mb-2">Task Manager</p>
                    <p className="text-indigo-300/60 text-sm leading-relaxed mb-12">
                        Collaborate with your team, track progress, and deliver projects on time.
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Task Management</p>
                                <p className="text-indigo-300/60 text-xs">Create, assign, and track tasks across teams</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Team Collaboration</p>
                                <p className="text-indigo-300/60 text-xs">Work together with role-based access control</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Analytics Dashboard</p>
                                <p className="text-indigo-300/60 text-xs">Visualize progress and track performance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
                
                <div className="max-w-md w-full mx-auto relative z-10">
                    {/* Mobile logo - only shows on small screens */}
                    <div className="flex justify-center mb-6 lg:hidden">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <span className="text-2xl font-black text-white tracking-tighter">TD</span>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-500 mb-8">Sign in to your Todoo workspace</p>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium text-center">{error}</div>}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" required className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all focus:bg-white" placeholder="Enter your username" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all focus:bg-white" placeholder="••••••••" />
                        </div>

                        <button type="submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/25 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Sign in securely
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
