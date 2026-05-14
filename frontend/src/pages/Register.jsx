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
        <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[150px] opacity-60 pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary-100 rounded-full blur-[150px] opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/4"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <span className="text-xl font-bold text-white tracking-tighter">TF</span>
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-surface-900 tracking-tight">Create an account</h2>
                <p className="mt-2 text-center text-sm text-surface-500">Join TaskFlow and start managing your team</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-surface-200/50 sm:rounded-2xl sm:px-10 border border-white">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium text-center">{error}</div>}
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-surface-700">First Name</label>
                                <input name="first_name" onChange={handleChange} type="text" className="mt-1.5 appearance-none block w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all focus:bg-white" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-surface-700">Last Name</label>
                                <input name="last_name" onChange={handleChange} type="text" className="mt-1.5 appearance-none block w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all focus:bg-white" placeholder="Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-700">Username <span className="text-rose-500">*</span></label>
                            <input name="username" required onChange={handleChange} type="text" className="mt-1.5 appearance-none block w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all focus:bg-white" placeholder="johndoe" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-700">Email address</label>
                            <input name="email" type="email" onChange={handleChange} className="mt-1.5 appearance-none block w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all focus:bg-white" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-700">Password <span className="text-rose-500">*</span></label>
                            <input name="password" required type="password" onChange={handleChange} className="mt-1.5 appearance-none block w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl shadow-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all focus:bg-white" placeholder="••••••••" />
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Create Account
                            </button>
                        </div>
                    </form>
                    <div className="mt-8 text-center border-t border-surface-100 pt-6">
                        <p className="text-sm text-surface-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
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
