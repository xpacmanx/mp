<template>
  <LoginModal 
    :show="showLoginModal" 
    @login-success="handleLoginSuccess"
  />
</template>

<script>
import { ref, onMounted } from 'vue'
import LoginModal from './LoginModal.vue'
import { getLoginModalVisibility, setLoginModalVisibility } from '@/tools/auth'

export default {
  name: 'AuthManager',
  components: {
    LoginModal
  },
  setup() {
    const showLoginModal = ref(false)

    // Watch for changes in login modal visibility
    const checkLoginModalVisibility = () => {
      showLoginModal.value = getLoginModalVisibility()
    }

    // Set up an interval to check for changes
    onMounted(() => {
      setInterval(checkLoginModalVisibility, 100)
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