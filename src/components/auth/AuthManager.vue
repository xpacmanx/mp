<template>
  <LoginModal 
    :show="showLoginModal" 
    @login-success="handleLoginSuccess"
  />
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from './LoginModal.vue'
import { getLoginModalVisibility, setLoginModalVisibility } from '@/tools/auth'
import { authEvents } from '@/router'

export default {
  name: 'AuthManager',
  components: {
    LoginModal
  },
  setup() {
    const router = useRouter()
    const showLoginModal = ref(false)

    // Function to update modal visibility
    const updateModalVisibility = () => {
      const newVisibility = getLoginModalVisibility()
      console.log('AuthManager updating modal visibility:', { old: showLoginModal.value, new: newVisibility })
      showLoginModal.value = newVisibility
    }

    // Set up event listener for auth events
    onMounted(() => {
      window.addEventListener('auth-state-changed', updateModalVisibility)
      
      // Слушаем события от роутера
      const unsubscribe = authEvents.on((event) => {
        console.log('AuthManager received event:', event)
        if (event === 'tokenExpired') {
          console.log('Showing login modal due to tokenExpired event')
          setLoginModalVisibility(true)
        }
      })
      
      updateModalVisibility() // Initial check
      console.log('AuthManager mounted, initial modal visibility:', showLoginModal.value)
      
      // Cleanup function
      return () => {
        window.removeEventListener('auth-state-changed', updateModalVisibility)
        unsubscribe()
      }
    })

    onUnmounted(() => {
      window.removeEventListener('auth-state-changed', updateModalVisibility)
    })

    const handleLoginSuccess = () => {
      setLoginModalVisibility(false)
      // Обновляем страницу для применения изменений после успешного логина
      window.location.reload()
    }

    return {
      showLoginModal,
      handleLoginSuccess
    }
  }
}
</script> 