import axios from 'axios';
import { updateState, clearState, isTokenAboutToExpire, refreshToken } from './userState';

let API_SERVER = import.meta.env.VITE_API_SERVER;

if (!API_SERVER || API_SERVER === '') {
    API_SERVER = window.location.origin.replace('://', '://api.');
}

// Add a flag to prevent multiple logout attempts
let isLoggingOut = false;
let showLoginModal = false;
let loginModalCallback = null;

// Function to set login modal visibility
export function setLoginModalVisibility(show, callback = null) {
    showLoginModal = show;
    loginModalCallback = callback;
}

// Function to get login modal visibility
export function getLoginModalVisibility() {
    return showLoginModal;
}

// Add axios interceptor to handle token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if this is a token validation error
        if (error.response?.data?.code === "token_not_valid" || 
            error.response?.data?.detail?.includes("Token is invalid or expired")) {
            if (!isLoggingOut) {
                setLoginModalVisibility(true, () => {
                    // Retry the original request after successful login
                    return axios(originalRequest);
                });
            }
            return Promise.reject(error);
        }

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const token = localStorage.getItem('authToken');
                if (!token || isTokenAboutToExpire(token)) {
                    const refreshed = await refreshToken();
                    if (!refreshed) {
                        setLoginModalVisibility(true, () => {
                            return axios(originalRequest);
                        });
                        return Promise.reject(error);
                    }
                }

                const newToken = localStorage.getItem('authToken');
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                return axios(originalRequest);
            } catch (refreshError) {
                setLoginModalVisibility(true, () => {
                    return axios(originalRequest);
                });
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Add axios request interceptor to add token to all requests
axios.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Check if token is about to expire before making the request
            if (isTokenAboutToExpire(token)) {
                try {
                    await refreshToken();
                    const newToken = localStorage.getItem('authToken');
                    config.headers['Authorization'] = 'Bearer ' + newToken;
                } catch (error) {
                    console.error('Failed to refresh token before request:', error);
                }
            } else {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
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
    
    // Show login modal instead of redirecting
    setLoginModalVisibility(true);
    
    setTimeout(() => {
        isLoggingOut = false;
    }, 1000);
}

export async function loginUser(username, password) {
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
        setLoginModalVisibility(false);

        // If there's a callback, execute it
        if (loginModalCallback) {
            await loginModalCallback();
            loginModalCallback = null;
        }

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

export async function logoutUser() {
    try {
        handleLogout();
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
