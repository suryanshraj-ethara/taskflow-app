import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.username?.[0] || 'Registration failed. Please check your details.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero / Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden flex-col justify-center items-center p-16">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                
                <div className="relative z-10 text-center max-w-lg">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 border border-emerald-400/30">
                            <span className="text-3xl font-black text-white tracking-tighter">TD</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight mb-4">Todoo</h1>
                    <p className="text-xl text-indigo-200/80 font-medium mb-2">Task Manager</p>
                    <p className="text-indigo-300/60 text-sm leading-relaxed">
                        Join your team and start managing projects today. Simple, powerful, and beautiful.
                    </p>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-50 rounded-full blur-[100px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
                
                <div className="max-w-md w-full mx-auto relative z-10">
                    <div className="flex justify-center mb-6 lg:hidden">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <span className="text-2xl font-black text-white tracking-tighter">TD</span>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an account</h2>
                    <p className="mt-2 text-sm text-slate-500 mb-8">Join Todoo and start managing your team</p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium text-center">{error}</div>}
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                                <input name="first_name" onChange={handleChange} type="text" className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all focus:bg-white" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                                <input name="last_name" onChange={handleChange} type="text" className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all focus:bg-white" placeholder="Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username <span className="text-rose-500">*</span></label>
                            <input name="username" required onChange={handleChange} type="text" className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all focus:bg-white" placeholder="johndoe" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                            <input name="email" type="email" onChange={handleChange} className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all focus:bg-white" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password <span className="text-rose-500">*</span></label>
                            <input name="password" required type="password" onChange={handleChange} className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all focus:bg-white" placeholder="••••••••" />
                        </div>

                        <div className="pt-1">
                            <button type="submit" className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/25 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Create Account
                            </button>
                        </div>
                    </form>
                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
