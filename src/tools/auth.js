import axios from 'axios';
import { updateState, clearState } from './userState';

const API_SERVER = import.meta.env.VITE_API_SERVER;

// Add axios interceptor to handle token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(API_SERVER + '/api/token/refresh/', {
                        refresh: refreshToken
                    });

                    const { access } = response.data;
                    localStorage.setItem('authToken', access);
                    updateState(access);

                    // Retry the original request with the new token
                    originalRequest.headers['Authorization'] = 'Bearer ' + access;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token fails, logout the user
                clearState();
                localStorage.clear();
                window.location.href = '/login';
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
        clearState();
        localStorage.clear();
        window.location.href = `/login?backUrl=${encodeURIComponent(currentPath)}`;
    } catch (error) {
        console.error('Logout failed:', error);
        clearState();
        localStorage.clear();
        window.location.href = '/login';
    }
}

// Add a helper function to handle redirects
export function getRedirectPath(router) {
    const route = router.currentRoute.value;
    return route.query.backUrl || '/';
}
