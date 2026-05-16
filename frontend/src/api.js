import axios from 'axios';

const api = axios.create({
    // If VITE_API_URL is provided, use it. Otherwise, use /api for production (relative to same domain)
    // or fallback to localhost if we're somehow running in dev without VITE_API_URL.
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api'),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) throw new Error('No refresh token');
                
                const res = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, { refresh: refreshToken });
                if (res.status === 200) {
                    localStorage.setItem('access_token', res.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                }
            } catch (err) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
