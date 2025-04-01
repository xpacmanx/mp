import axios from 'axios';
import { updateState, clearState } from './userState';

let API_SERVER = import.meta.env.VITE_API_SERVER;

if (!API_SERVER || API_SERVER === '') {
    API_SERVER = window.location.origin.replace('://', '://api.');
}

// Add a flag to prevent multiple logout attempts
let isLoggingOut = false;

// Add axios interceptor to handle token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if this is a token validation error
        if (error.response?.data?.code === "token_not_valid" || 
            error.response?.data?.detail?.includes("Token is invalid or expired")) {
            handleLogout();
            return Promise.reject(error);
        }

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    handleLogout();
                    return Promise.reject(error);
                }

                const response = await axios.post(API_SERVER + '/api/token/refresh/', {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem('authToken', access);
                updateState(access);

                originalRequest.headers['Authorization'] = 'Bearer ' + access;
                return axios(originalRequest);
            } catch (refreshError) {
                // Check for specific token validation error in refresh attempt
                if (refreshError.response?.data?.code === "token_not_valid" ||
                    refreshError.response?.data?.detail?.includes("Token is invalid or expired")) {
                    handleLogout();
                    return Promise.reject(refreshError);
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Add axios request interceptor to add token to all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to handle logout
function handleLogout() {
    if (isLoggingOut) return;
    isLoggingOut = true;
    
    // Clear all auth related data
    clearState();
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.clear();
    
    // Force reload to clear any cached state
    window.location.href = `/login`;
    
    setTimeout(() => {
        isLoggingOut = false;
    }, 1000);
}

export async function loginUser(username, password, router) {
    try {
        const response = await axios.post(API_SERVER + '/api/token/', {
            username,
            password
        });

        const { access, refresh } = response.data;

        localStorage.setItem('authToken', access);
        if (refresh) {
            localStorage.setItem('refreshToken', refresh);
        }

        updateState(access);

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Login failed:', error);
        if (error.response) {
            if (error.response.status === 401) {
                throw new Error('Неверный логин или пароль');
            } else if (error.response.status === 400) {
                throw new Error('Пожалуйста, заполните все поля');
            } else {
                throw new Error('Ошибка сервера. Попробуйте позже');
            }
        } else if (error.request) {
            throw new Error('Нет связи с сервером. Проверьте подключение к интернету');
        } else {
            throw new Error('Произошла ошибка. Попробуйте позже');
        }
    }
}

export async function logoutUser(router) {
    try {
        const currentPath = router.currentRoute.value.fullPath;
        handleLogout();
        window.location.href = `/login?backUrl=${encodeURIComponent(currentPath)}`;
    } catch (error) {
        console.error('Logout failed:', error);
        handleLogout();
    }
}

// Add a helper function to handle redirects
export function getRedirectPath(router) {
    const route = router.currentRoute.value;
    return route.query.backUrl || '/';
}
