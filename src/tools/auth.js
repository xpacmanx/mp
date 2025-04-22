import axios from 'axios';
import { updateUserState, clearUserState, isTokenAboutToExpire, refreshToken } from './userState';

let API_SERVER = import.meta.env.VITE_API_SERVER;

if (!API_SERVER || API_SERVER === '') {
    API_SERVER = window.location.origin.replace('://', '://api.');
}
console.log('API_SERVER configured as:', API_SERVER);

// Add a flag to prevent multiple logout attempts
let isLoggingOut = false;
let showLoginModal = false;
let loginModalCallback = null;

// Function to set login modal visibility
export function setLoginModalVisibility(show, callback = null) {
    showLoginModal = show;
    loginModalCallback = callback;
    // Dispatch event when visibility changes
    window.dispatchEvent(new Event('auth-state-changed'));
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    clearUserState();
    isLoggingOut = false;
}

export async function loginUser(username, password) {
    try {
        console.log('Attempting login request to:', `${API_SERVER}/api/token/`);
        const response = await axios.post(`${API_SERVER}/api/token/`, {
            username,
            password
        });
        console.log('Login response:', response.data);

        const { access, refresh, user } = response.data;
        
        localStorage.setItem('authToken', access);
        localStorage.setItem('refreshToken', refresh);
        
        // Update user state with the complete user object
        updateUserState({
            username: user.username,
            role: user.role,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            id: user.id
        });
        
        return { success: true };
    } catch (error) {
        console.error('Login failed:', error);
        console.error('Error response:', error.response?.data);
        return { 
            success: false, 
            message: error.response?.data?.detail || 'Ошибка авторизации' 
        };
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
