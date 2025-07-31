<template>
  <OnboardingModal 
    :show="showOnboarding" 
    @complete="handleOnboardingComplete"
  />
  
  <!-- Кнопка для сброса onboarding (только для разработки) -->
  <!--div v-if="showResetButton" class="fixed bottom-4 right-4 z-50">
    <button
      @click="resetOnboarding"
      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
    >
      Сбросить Onboarding
    </button>
  </div> -->
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { userData } from '@/tools/userState'
import OnboardingModal from './OnboardingModal.vue'
import mpr from '@/tools/mpr'

export default {
  name: 'OnboardingManager',
  components: {
    OnboardingModal
  },
  setup() {
    const showOnboarding = ref(false)
    const showResetButton = ref(process.env.NODE_ENV === 'development')

    // Функция для проверки, нужно ли показывать onboarding
    const checkOnboardingNeeded = async () => {
      try {
        // Проверяем, есть ли данные пользователя
        if (!userData.value?.id) {
          console.log('Нет данных пользователя для проверки onboarding')
          return false
        }

        // Загружаем актуальные данные пользователя с сервера
        const response = await mpr({
          url: '/users/me/',
          method: 'get'
        })
        
        const user = response.data
        
        // Проверяем, заполнена ли дата рождения
        const hasBirthDate = user.birthdate && user.birthdate.trim() !== ''
        
        if (hasBirthDate) {
          console.log('Пользователь уже заполнил дату рождения, onboarding не нужен')
          return false
        } else {
          console.log('Пользователь не заполнил дату рождения, показываем onboarding')
          return true
        }
      } catch (error) {
        console.error('Ошибка при проверке необходимости onboarding:', error)
        return false
      }
    }

    // Функция для показа onboarding
    const showOnboardingIfNeeded = async () => {
      const needsOnboarding = await checkOnboardingNeeded()
      showOnboarding.value = needsOnboarding
    }

    // Обработчик завершения onboarding
    const handleOnboardingComplete = () => {
      showOnboarding.value = false
      console.log('Onboarding завершен')
    }

    // Функция для сброса onboarding (для тестирования)
    const resetOnboarding = () => {
      // Очищаем дату рождения в localStorage для тестирования
      if (userData.value) {
        userData.value.birthDate = ''
        userData.value.birthdate = ''
        localStorage.setItem('userData', JSON.stringify(userData.value))
      }
      showOnboardingIfNeeded()
      console.log('Onboarding сброшен (дата рождения очищена)')
    }

    // Следим за изменениями в userData
    watch(userData, async (newUserData) => {
      if (newUserData?.id) {
        await showOnboardingIfNeeded()
      }
    }, { immediate: true })

    onMounted(async () => {
      // Проверяем onboarding при монтировании компонента
      await showOnboardingIfNeeded()
    })

    return {
      showOnboarding,
      showResetButton,
      handleOnboardingComplete,
      resetOnboarding
    }
  }
}
</script> 