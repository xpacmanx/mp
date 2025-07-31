<template>
  <Header />
  <div class="onboarding-test-container">
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-white mb-6">Тест Onboarding</h1>
        
        <div class="space-y-4">
          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-2">Статус Onboarding</h3>
            <p class="text-gray-300 mb-2">
              <strong>Дата рождения заполнена:</strong> {{ hasBirthDate ? 'Да' : 'Нет' }}
            </p>
            <p class="text-gray-300 mb-2">
              <strong>Onboarding нужен:</strong> {{ !hasBirthDate ? 'Да' : 'Нет' }}
            </p>
            <p class="text-gray-300 mb-2">
              <strong>ID пользователя:</strong> {{ userData?.id || 'Не найден' }}
            </p>
          </div>

          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-2">Действия</h3>
            <div class="space-y-2">
              <button
                @click="resetOnboarding"
                class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Сбросить Onboarding
              </button>
              <button
                @click="checkUserData"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Проверить данные пользователя
              </button>
              <button
                @click="forceShowOnboarding"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Принудительно показать Onboarding
              </button>
            </div>
          </div>

          <div class="bg-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-2">Данные пользователя</h3>
            <pre class="text-xs text-gray-300 bg-gray-800 p-2 rounded overflow-auto">{{ userDataString }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { userData } from '@/tools/userState'
import Header from '@/components/navigation/Header.vue'
import mpr from '@/tools/mpr'

export default {
  name: 'OnboardingTestView',
  components: {
    Header
  },
  setup() {
    const hasBirthDate = ref(false)
    const userDataString = ref('')

    const checkUserData = async () => {
      try {
        const response = await mpr({
          url: '/users/me/',
          method: 'get'
        })
        
        const user = response.data
        hasBirthDate.value = user.birthdate && user.birthdate.trim() !== ''
        userDataString.value = JSON.stringify(user, null, 2)
        
        console.log('Данные пользователя:', user)
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error)
        userDataString.value = 'Ошибка: ' + error.message
      }
    }

    const resetOnboarding = () => {
      // Очищаем дату рождения в localStorage для тестирования
      if (userData.value) {
        userData.value.birthDate = ''
        userData.value.birthdate = ''
        localStorage.setItem('userData', JSON.stringify(userData.value))
      }
      console.log('Onboarding сброшен (дата рождения очищена)')
    }

    const forceShowOnboarding = () => {
      // Очищаем дату рождения и перезагружаем страницу
      if (userData.value) {
        userData.value.birthDate = ''
        userData.value.birthdate = ''
        localStorage.setItem('userData', JSON.stringify(userData.value))
      }
      window.location.reload()
    }

    onMounted(() => {
      checkUserData()
    })

    return {
      hasBirthDate,
      userDataString,
      userData,
      checkUserData,
      resetOnboarding,
      forceShowOnboarding
    }
  }
}
</script>

<style scoped>
.onboarding-test-container {
  min-height: calc(100vh - 64px);
  background-color: #111827;
}
</style> 