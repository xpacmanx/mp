<template>
  <div>
    <!-- Показываем контент только авторизованным пользователям -->
    <div v-if="isAuthenticated">
      <slot />
    </div>
    
    <!-- Показываем сообщение для неавторизованных пользователей -->
    <div v-else class="auth-required-message">
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Требуется авторизация</h2>
          <p class="text-gray-600 mb-6">Для доступа к этой странице необходимо войти в систему</p>
          <button 
            @click="showLoginModal"
            class="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded"
          >
            Войти в систему
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isAuthenticated } from '@/tools/userState'
import { setLoginModalVisibility } from '@/tools/auth'

export default {
  name: 'AuthGuard',
  setup() {
    const showLoginModal = () => {
      setLoginModalVisibility(true)
    }

    return {
      isAuthenticated,
      showLoginModal
    }
  }
}
</script>

<style scoped>
.auth-required-message {
  @apply bg-gray-50;
}
</style> 