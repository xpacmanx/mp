<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-700">
        <h2 class="text-xl font-bold text-white">Добро пожаловать в TLQ!</h2>
        <div class="flex space-x-2">
          <div 
            v-for="step in 4" 
            :key="step"
            :class="[
              'w-3 h-3 rounded-full',
              currentStep >= step ? 'bg-lime-500' : 'bg-gray-600'
            ]"
          ></div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="p-6">
        <!-- Step 1: Change Password -->
        <div v-if="currentStep === 1" class="space-y-4">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Шаг 1: Измените пароль</h3>
            <p class="text-gray-400">Для безопасности рекомендуется сменить пароль по умолчанию</p>
          </div>

          <form @submit.prevent="handlePasswordChange" class="space-y-4">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Текущий пароль
              </label>
              <input
                id="currentPassword"
                v-model="passwordData.currentPassword"
                type="password"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Введите текущий пароль"
                required
              >
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Новый пароль
              </label>
              <input
                id="newPassword"
                v-model="passwordData.newPassword"
                type="password"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Введите новый пароль"
                required
              >
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Подтвердите новый пароль
              </label>
              <input
                id="confirmPassword"
                v-model="passwordData.confirmPassword"
                type="password"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Повторите новый пароль"
                required
              >
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="skipStep"
                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Пропустить
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </span>
                <span v-else>Сохранить пароль</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Personal Information -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Шаг 2: Личная информация</h3>
            <p class="text-gray-400">Заполните свои данные для персонализации сервиса</p>
          </div>

          <form @submit.prevent="handlePersonalInfo" class="space-y-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-300 mb-2">
                Имя *
              </label>
              <input
                id="firstName"
                v-model="personalData.firstName"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Введите имя"
                required
              >
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-300 mb-2">
                Фамилия *
              </label>
              <input
                id="lastName"
                v-model="personalData.lastName"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Введите фамилию"
                required
              >
            </div>

            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-300 mb-2">
                Дата рождения *
              </label>
              <input
                id="birthDate"
                v-model="personalData.birthDate"
                type="date"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                required
              >
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="previousStep"
                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Назад
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </span>
                <span v-else>Сохранить данные</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Step 3: Profile Photo -->
        <div v-if="currentStep === 3" class="space-y-4">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Шаг 3: Фото профиля</h3>
            <p class="text-gray-400">Загрузите свою фотографию для персонализации профиля</p>
          </div>

          <div class="flex flex-col items-center space-y-4">
            <div class="relative">
              <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                <img 
                  v-if="profilePhoto" 
                  :src="profilePhoto" 
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
            <p class="text-sm text-gray-400">Нажмите на камеру, чтобы загрузить фото</p>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="previousStep"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Назад
            </button>
            <button
              type="button"
              @click="skipStep"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Пропустить
            </button>
            <button
              type="button"
              @click="nextStep"
              :disabled="!profilePhoto"
              class="flex-1 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Продолжить
            </button>
          </div>
        </div>

        <!-- Step 4: Welcome -->
        <div v-if="currentStep === 4" class="space-y-4">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Добро пожаловать в TLQ!</h3>
            <p class="text-gray-400">Ваш профиль настроен. Теперь вы можете использовать все возможности сервиса.</p>
          </div>

          <!-- <div class="bg-gray-700 rounded-lg p-4 mb-6">
            <h4 class="text-white font-medium mb-2">Что вы можете делать:</h4>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>• Управлять поставками и складскими операциями</li>
              <li>• Анализировать данные по товарам и складам</li>
              <li>• Создавать и отслеживать задания</li>
              <li>• Настраивать связи между компонентами системы</li>
            </ul>
          </div> -->

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="previousStep"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Назад
            </button>
            <button
              type="button"
              @click="completeOnboarding"
              class="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Начать работу
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Cropper Modal -->
    <div v-if="showImageCropper" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-white">Загрузить фото профиля</h3>
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
import { userData } from '@/tools/userState'
import ProfileImageCropper from '@/components/ProfileImageCropper.vue'
import mpr from '@/tools/mpr'

export default {
  name: 'OnboardingModal',
  components: {
    ProfileImageCropper
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['complete'],
  setup(props, { emit }) {
    const currentStep = ref(1)
    const isLoading = ref(false)
    const showImageCropper = ref(false)
    const profilePhoto = ref('')
    const profilePhotoFile = ref(null)

    const passwordData = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const personalData = reactive({
      firstName: '',
      lastName: '',
      birthDate: ''
    })

    const handlePasswordChange = async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('Пароли не совпадают')
        return
      }

      if (passwordData.newPassword.length < 6) {
        alert('Новый пароль должен содержать минимум 6 символов')
        return
      }

      isLoading.value = true
      try {
        await mpr({
          url: '/api/change-password/',
          method: 'post',
          data: {
            old_password: passwordData.currentPassword,
            new_password: passwordData.newPassword
          }
        })
        
        alert('Пароль успешно изменен!')
        nextStep()
      } catch (error) {
        console.error('Ошибка при смене пароля:', error)
        alert('Ошибка при смене пароля. Проверьте текущий пароль.')
      } finally {
        isLoading.value = false
      }
    }

    const handlePersonalInfo = async () => {
      if (!personalData.firstName.trim() || !personalData.lastName.trim() || !personalData.birthDate) {
        alert('Пожалуйста, заполните все обязательные поля')
        return
      }

      isLoading.value = true
      try {
        const userId = userData.value?.id
        if (!userId) {
          throw new Error('ID пользователя не найден')
        }

        await mpr({
          url: `/users/${userId}/`,
          method: 'patch',
          data: {
            first_name: personalData.firstName.trim(),
            last_name: personalData.lastName.trim(),
            birthdate: personalData.birthDate
          }
        })

        // Обновляем данные в userState
        Object.assign(userData.value, {
          firstName: personalData.firstName.trim(),
          lastName: personalData.lastName.trim(),
          birthDate: personalData.birthDate
        })

        alert('Данные успешно сохранены!')
        nextStep()
      } catch (error) {
        console.error('Ошибка при сохранении данных:', error)
        alert('Ошибка при сохранении данных. Попробуйте еще раз.')
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
      fetch(croppedImageData)
        .then(res => res.blob())
        .then(blob => {
          const timestamp = Date.now()
          const file = new File([blob], `profile_photo_${timestamp}.jpg`, { 
            type: 'image/jpeg',
            lastModified: timestamp
          })
          
          profilePhoto.value = croppedImageData
          profilePhotoFile.value = file
        })
        .catch(error => {
          console.error('Ошибка конвертации изображения:', error)
        })
      
      closeImageCropper()
    }

    const saveProfilePhoto = async () => {
      if (!profilePhotoFile.value) return

      try {
        const userId = userData.value?.id
        if (!userId) {
          throw new Error('ID пользователя не найден')
        }

        const formData = new FormData()
        formData.append('photo', profilePhotoFile.value)

        await mpr({
          url: `/users/${userId}/`,
          method: 'patch',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Обновляем фото в userState
        userData.value.photo = profilePhoto.value
      } catch (error) {
        console.error('Ошибка при сохранении фото:', error)
      }
    }

    const nextStep = async () => {
      if (currentStep.value === 3 && profilePhoto.value) {
        await saveProfilePhoto()
      }
      
      if (currentStep.value < 4) {
        currentStep.value++
      }
    }

    const previousStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }

    const skipStep = () => {
      nextStep()
    }

    const completeOnboarding = async () => {
      // Сохраняем фото если оно было загружено
      if (profilePhoto.value && profilePhotoFile.value) {
        await saveProfilePhoto()
      }

      // Onboarding завершен - дата рождения уже сохранена на шаге 2
      console.log('Onboarding завершен - дата рождения заполнена')
      
      emit('complete')
    }

    onMounted(() => {
      // Загружаем существующие данные пользователя
      if (userData.value) {
        personalData.firstName = userData.value.firstName || userData.value.first_name || ''
        personalData.lastName = userData.value.lastName || userData.value.last_name || ''
        personalData.birthDate = userData.value.birthDate || userData.value.birthdate || ''
        profilePhoto.value = userData.value.photo || ''
      }
    })

    return {
      currentStep,
      isLoading,
      showImageCropper,
      profilePhoto,
      passwordData,
      personalData,
      handlePasswordChange,
      handlePersonalInfo,
      openImageCropper,
      closeImageCropper,
      handleImageCropped,
      nextStep,
      previousStep,
      skipStep,
      completeOnboarding
    }
  }
}
</script> 