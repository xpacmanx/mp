import { ref } from 'vue'
import { jwtDecode } from "jwt-decode";
import { DateTime } from 'luxon'
import mpr from './mpr'

// Create reactive references for user state
const isAuthenticated = ref(false)
const username = ref('')
const role = ref('')
const userData = ref(null)
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
        const { access, user } = response.data;
        
        if (access) {
            localStorage.setItem('authToken', access);
            updateUserState(user);
            return true;
        } else {
            throw new Error('No access token in response');
        }
    } catch (error) {
        console.error('Failed to refresh token:', error);
        clearUserState();
        return false;
    } finally {
        // Clear the promise so future refresh attempts can proceed
        refreshPromise = null;
    }
}

// Function to update user state
function updateUserState(user) {
    if (user) {
        isAuthenticated.value = true
        username.value = user.username || ''
        role.value = user.role || 'Пользователь'
        userData.value = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName || user.first_name,
            lastName: user.lastName || user.last_name,
            role: user.role
        }
        // Store in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(userData.value))
    } else {
        clearUserState()
    }
}

// Function to clear user state
function clearUserState() {
    isAuthenticated.value = false
    username.value = ''
    role.value = ''
    userData.value = null
    localStorage.removeItem('userData')
}

// Function to initialize user state from localStorage and token
function initializeUserState() {
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('userData')
    
    if (token) {
        try {
            const decoded = jwtDecode(token)
            isAuthenticated.value = true
            
            if (storedUser) {
                const user = JSON.parse(storedUser)
                username.value = user.username || decoded.username || ''
                role.value = user.role || 'Пользователь'
                userData.value = user
            } else {
                username.value = decoded.username || ''
                role.value = 'Пользователь'
            }
        } catch (error) {
            console.error('Failed to decode token:', error)
            clearUserState()
        }
    } else {
        clearUserState()
    }
}

// Initialize user state when module loads
initializeUserState()

// Export functions and state
export {
    isAuthenticated,
    username,
    role,
    userData,
    updateUserState,
    clearUserState,
    isTokenAboutToExpire,
    refreshToken
} 