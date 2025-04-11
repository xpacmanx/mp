import { ref } from 'vue'
import { jwtDecode } from "jwt-decode";
import { DateTime } from 'luxon'
import mpr from './mpr'

let API_SERVER = import.meta.env.VITE_API_SERVER;

if (!API_SERVER || API_SERVER === '') {
    API_SERVER = window.location.origin.replace('://', '://api.');
}

// Create reactive references
const isAuthenticated = ref(false)
const username = ref('')
let refreshPromise = null;

// Function to check if token is about to expire (within 1 hour)
function isTokenAboutToExpire(token) {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        const currentTime = DateTime.now().toSeconds();
        const expirationTime = decoded.exp;
        const timeUntilExpiration = expirationTime - currentTime;
        
        // Return true if token expires in less than 1 hour
        return timeUntilExpiration < 3600; // 3600 seconds = 1 hour
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true;
    }
}

// Function to refresh token
async function refreshToken() {
    // If there's already a refresh in progress, return that promise
    if (refreshPromise) {
        return refreshPromise;
    }

    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // Create a new promise for this refresh attempt
        refreshPromise = mpr({
            url: '/api/token/refresh/',
            method: 'post',
            data: {
                refresh: refreshToken
            }
        });

        const response = await refreshPromise;
        const { access } = response.data;
        
        if (access) {
            localStorage.setItem('authToken', access);
            updateState(access);
            return true;
        } else {
            throw new Error('No access token in response');
        }
    } catch (error) {
        console.error('Failed to refresh token:', error);
        clearState();
        return false;
    } finally {
        // Clear the promise so future refresh attempts can proceed
        refreshPromise = null;
    }
}

// Initialize state from localStorage if token exists
async function initializeState() {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAuthenticated.value = true;
            username.value = decoded.username || '';
            
            // Check if token is about to expire
            if (isTokenAboutToExpire(token)) {
                console.log('Token is about to expire, attempting to refresh...');
                const refreshed = await refreshToken();
                if (!refreshed) {
                    clearState();
                    window.location.href = '/login'; // Redirect to login page
                }
            }
        } catch (error) {
            console.error('Failed to decode token:', error);
            clearState();
            window.location.href = '/login'; // Redirect to login page
        }
    } else {
        clearState();
        window.location.href = '/login'; // Redirect to login page
    }
}

// Clear user state
function clearState() {
    isAuthenticated.value = false;
    username.value = '';
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
}

// Update user state
function updateState(token) {
    if (token) {
        const decoded = jwtDecode(token);
        isAuthenticated.value = true;
        username.value = decoded.username || '';
    } else {
        clearState();
    }
}

// Initialize state when module loads
initializeState();

// Export functions and state
export { isAuthenticated, username, updateState, clearState, isTokenAboutToExpire, refreshToken } 