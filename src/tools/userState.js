import { ref } from 'vue'
import { jwtDecode } from "jwt-decode";

// Create reactive references
const isAuthenticated = ref(false)
const username = ref('')

// Initialize state from localStorage if token exists
function initializeState() {
    const token = localStorage.getItem('authToken')
    if (token) {
        try {
            const decoded = jwtDecode(token)
            isAuthenticated.value = true
            username.value = decoded.username || ''
        } catch (error) {
            console.error('Failed to decode token:', error)
            clearState()
        }
    } else {
        clearState()
    }
}

// Clear user state
function clearState() {
    isAuthenticated.value = false
    username.value = ''
}

// Update user state
function updateState(token) {
    if (token) {
        const decoded = jwtDecode(token)
        isAuthenticated.value = true
        username.value = decoded.username || ''
    } else {
        clearState()
    }
}

// Initialize state when module loads
initializeState()

export { isAuthenticated, username, updateState, clearState } 