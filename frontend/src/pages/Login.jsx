import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-100 rounded-full blur-[150px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[150px] opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/4"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <span className="text-xl font-bold text-white tracking-tighter">TF</span>
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-surface-900 tracking-tight">Welcome back</h2>
                <p className="mt-2 text-center text-sm text-surface-500">Sign in to access your TaskFlow workspace</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-surface-200/50 sm:rounded-2xl sm:px-10 border border-white">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium text-center">{error}</div>}
                        <div>
                            <label className="block text-sm font-semibold text-surface-700">Username</label>
                            <div className="mt-1.5">
                                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" required className="appearance-none block w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all focus:bg-white" placeholder="Enter your username" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-700">Password</label>
                            <div className="mt-1.5">
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="appearance-none block w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all focus:bg-white" placeholder="••••••••" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Sign in securely
                            </button>
                        </div>
                    </form>
                    <div className="mt-8 text-center border-t border-surface-100 pt-6">
                        <p className="text-sm text-surface-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
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
