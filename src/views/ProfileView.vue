<template>
  <Header />
  <div class="profile-container">
    <div class="max-w-2xl mx-auto p-6">
      <div v-if="isLoading" class="bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center">
        <div class="text-center">
          <div class="w-8 h-8 border-4 border-lime-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-lime-300">Загрузка профиля...</p>
        </div>
      </div>
      <div v-else class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-white mb-6">Профиль пользователя</h1>
        
        <form @submit.prevent="saveProfile" class="space-y-6">
          <!-- Фото профиля -->
          <div class="flex flex-col items-center space-y-4">
            <div class="relative">
              <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                <img 
                  v-if="profileData.photo" 
                  :src="profileData.photo" 
                  alt="Фото профиля" 
                  class="w-full h-full object-cover"
                >
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <button 
                type="button"
                @click="openImageCropper"
                class="absolute bottom-0 right-0 bg-lime-500 hover:bg-lime-600 text-white rounded-full p-2 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-400">Нажмите на камеру, чтобы изменить фото</p>
          </div>

          <!-- Имя -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-300 mb-2">
              Имя
            </label>
            <input
              id="firstName"
              v-model="profileData.firstName"
              type="text"
              :class="[
                'w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent',
                errors.firstName ? 'border-red-500' : 'border-gray-600'
              ]"
              placeholder="Введите имя"
            >
            <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
          </div>

          <!-- Фамилия -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-300 mb-2">
              Фамилия
            </label>
            <input
              id="lastName"
              v-model="profileData.lastName"
              type="text"
              :class="[
                'w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent',
                errors.lastName ? 'border-red-500' : 'border-gray-600'
              ]"
              placeholder="Введите фамилию"
            >
            <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
          </div>

          <!-- Дата рождения -->
          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-300 mb-2">
              Дата рождения
            </label>
            <input
              id="birthDate"
              v-model="profileData.birthDate"
              type="date"
              :class="[
                'w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent',
                errors.birthDate ? 'border-red-500' : 'border-gray-600'
              ]"
            >
            <p v-if="errors.birthDate" class="text-red-500 text-sm mt-1">{{ errors.birthDate }}</p>
          </div>

          <!-- Email (только для чтения) -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              :value="profileData.email"
              type="email"
              disabled
              class="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
            >
            <p class="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
          </div>

          <!-- Роль (только для чтения) -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-300 mb-2">
              Роль
            </label>
            <input
              id="role"
              :value="profileData.role"
              type="text"
              disabled
              class="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
            >
          </div>

          <!-- Кнопки -->
          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              :disabled="isSaving"
              class="flex-1 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <span v-if="isSaving" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Сохранение...
              </span>
              <span v-else>Сохранить изменения</span>
            </button>
            <button
              type="button"
              @click="resetForm"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно для кроппера изображений -->
    <div v-if="showImageCropper" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-white">Изменить фото профиля</h3>
          <button 
            @click="closeImageCropper"
            class="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <ProfileImageCropper
          @image-cropped="handleImageCropped"
          @cancel="closeImageCropper"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { userData, username, role } from '@/tools/userState'
import ProfileImageCropper from '@/components/ProfileImageCropper.vue'
import Header from '@/components/navigation/Header.vue'
import mpr from '@/tools/mpr'

export default {
  name: 'ProfileView',
  components: {
    ProfileImageCropper,
    Header
  },
  setup() {
    const isSaving = ref(false)
    const isLoading = ref(true)
    const showImageCropper = ref(false)
    const errors = reactive({})
    
    const profileData = reactive({
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      role: '',
      photo: ''
    })

    const originalData = ref({})

    const loadUserData = async () => {
      try {
        // Загружаем актуальные данные пользователя с сервера
        const response = await mpr({
          url: '/users/me/',
          method: 'get'
        })
        
        const userData = response.data
        
        // Заполняем форму актуальными данными
        profileData.firstName = userData.first_name || ''
        profileData.lastName = userData.last_name || ''
        profileData.birthDate = userData.birthdate || ''
        profileData.email = userData.email || ''
        profileData.role = userData.role || ''
        profileData.photo = userData.photo || ''

        // Сохраняем оригинальные данные для сравнения
        originalData.value = { ...profileData }
        
        console.log('Данные профиля загружены:', userData)
      } catch (error) {
        console.error('Ошибка при загрузке данных профиля:', error)
        
        // Fallback на данные из userState если запрос не удался
        profileData.firstName = userData.value?.firstName || userData.value?.first_name || ''
        profileData.lastName = userData.value?.lastName || userData.value?.last_name || ''
        profileData.birthDate = userData.value?.birthDate || userData.value?.birthdate || ''
        profileData.email = userData.value?.email || username.value || ''
        profileData.role = role.value || ''
        profileData.photo = userData.value?.photo || ''

        originalData.value = { ...profileData }
      } finally {
        isLoading.value = false
      }
    }

    const openImageCropper = () => {
      showImageCropper.value = true
    }

    const closeImageCropper = () => {
      showImageCropper.value = false
    }

    const handleImageCropped = (croppedImageData) => {
      profileData.photo = croppedImageData
      closeImageCropper()
    }

    const validateForm = () => {
      Object.keys(errors).forEach(key => delete errors[key])
      
      // Валидация имени
      if (!profileData.firstName.trim()) {
        errors.firstName = 'Имя обязательно для заполнения'
      } else if (profileData.firstName.trim().length < 2) {
        errors.firstName = 'Имя должно содержать минимум 2 символа'
      }
      
      // Валидация фамилии
      if (!profileData.lastName.trim()) {
        errors.lastName = 'Фамилия обязательна для заполнения'
      } else if (profileData.lastName.trim().length < 2) {
        errors.lastName = 'Фамилия должна содержать минимум 2 символа'
      }
      
      // Валидация даты рождения
      if (profileData.birthDate) {
        const birthDate = new Date(profileData.birthDate)
        const today = new Date()
        
        if (birthDate > today) {
          errors.birthDate = 'Дата рождения не может быть в будущем'
        } else if (birthDate.getFullYear() < 1900) {
          errors.birthDate = 'Дата рождения не может быть раньше 1900 года'
        }
      }
      
      return Object.keys(errors).length === 0
    }

    const saveProfile = async () => {
      if (!validateForm()) {
        return
      }
      
      isSaving.value = true
      
      try {
        // Создаем объект с только измененными данными
        const changedData = {}
        
        // Проверяем, изменились ли данные по сравнению с оригинальными
        if (profileData.firstName.trim() !== originalData.value.firstName) {
          changedData.first_name = profileData.firstName.trim()
        }
        if (profileData.lastName.trim() !== originalData.value.lastName) {
          changedData.last_name = profileData.lastName.trim()
        }
        if (profileData.birthDate !== originalData.value.birthDate) {
          changedData.birthdate = profileData.birthDate
        }
        if (profileData.photo !== originalData.value.photo) {
          changedData.photo = profileData.photo
        }
        
        // Если нет изменений, просто выходим
        if (Object.keys(changedData).length === 0) {
          alert('Нет изменений для сохранения')
          return
        }
        
        // Получаем ID пользователя из userData
        const userId = userData.value?.id
        if (!userId) {
          throw new Error('ID пользователя не найден')
        }
        
        const response = await mpr({
          url: `/users/${userId}/`,
          method: 'patch',
          data: changedData
        })

        // Обновляем данные в userState
        Object.assign(userData.value, {
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName.trim(),
          birthDate: profileData.birthDate,
          photo: profileData.photo
        })

        // Обновляем оригинальные данные
        originalData.value = { ...profileData }
        
        alert('Профиль успешно обновлен!')
      } catch (error) {
        console.error('Ошибка при сохранении профиля:', error)
        alert('Ошибка при сохранении профиля. Попробуйте еще раз.')
      } finally {
        isSaving.value = false
      }
    }

    const resetForm = () => {
      // Восстанавливаем оригинальные данные
      Object.assign(profileData, originalData.value)
    }

    onMounted(async () => {
      await loadUserData()
    })

    return {
      profileData,
      errors,
      isLoading,
      isSaving,
      showImageCropper,
      openImageCropper,
      closeImageCropper,
      handleImageCropped,
      saveProfile,
      resetForm
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: calc(100vh - 64px);
  background-color: #111827;
}
</style> 