<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <h2 class="text-2xl font-bold mb-4 text-center">Вход в систему</h2>
      <div v-if="errorMessage" class="error-message mb-4">
        {{ errorMessage }}
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Логин:</label>
          <input 
            type="text" 
            v-model="login" 
            placeholder="user@teslalasers.com" 
            @keyup.enter="signin"
            class="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль:</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="***" 
            @keyup.enter="signin"
            class="w-full p-2 border rounded-md"
          />
        </div>
        <button 
          @click="signin" 
          :disabled="isLoading"
          class="w-full bg-lime-300 p-2 rounded-md font-bold hover:bg-lime-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { loginUser } from '@/tools/auth'

export default {
  name: 'LoginModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['login-success'],
  setup(props, { emit }) {
    const login = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const isLoading = ref(false)

    const signin = async () => {
      if (!login.value || !password.value) {
        errorMessage.value = 'Пожалуйста, заполните все поля'
        return
      }

      isLoading.value = true
      errorMessage.value = ''
      
      try {
        const result = await loginUser(login.value, password.value)
        if (result.success) {
          emit('login-success')
          login.value = ''
          password.value = ''
        }
      } catch (error) {
        errorMessage.value = error.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      login,
      password,
      errorMessage,
      isLoading,
      signin
    }
  }
}
</script>

<style scoped>
.error-message {
  @apply bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative;
}
</style> 