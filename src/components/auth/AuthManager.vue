<template>
  <LoginModal 
    :show="showLoginModal" 
    @login-success="handleLoginSuccess"
  />
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import LoginModal from './LoginModal.vue'
import { getLoginModalVisibility, setLoginModalVisibility } from '@/tools/auth'

export default {
  name: 'AuthManager',
  components: {
    LoginModal
  },
  setup() {
    const showLoginModal = ref(false)

    // Function to update modal visibility
    const updateModalVisibility = () => {
      showLoginModal.value = getLoginModalVisibility()
    }

    // Set up event listener for auth events
    onMounted(() => {
      window.addEventListener('auth-state-changed', updateModalVisibility)
      updateModalVisibility() // Initial check
    })

    onUnmounted(() => {
      window.removeEventListener('auth-state-changed', updateModalVisibility)
    })

    const handleLoginSuccess = () => {
      setLoginModalVisibility(false)
    }

    return {
      showLoginModal,
      handleLoginSuccess
    }
  }
}
</script> 