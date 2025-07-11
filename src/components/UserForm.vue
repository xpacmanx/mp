<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Колонка 1 -->
        <div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Имя</label>
            <input v-model="form.first_name" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Фамилия</label>
            <input v-model="form.last_name" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">День рождения</label>
            <input v-model="form.birthdate" type="date" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Email</label>
            <input v-model="form.email" type="email" class="input" required />
          </div>
        </div>
        <!-- Колонка 2 -->
        <div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Телеграм ник</label>
            <input v-model="form.telegram_nick" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Telegram ID</label>
            <input v-model="form.telegram_id" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Фото профиля</label>
            <!-- Превью текущего фото -->
            <div v-if="form.photo && !showImageCropper" class="mb-3">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <img :src="form.photo" alt="Текущее фото" class="w-full h-full object-cover" />
                </div>
                <button 
                  type="button" 
                  @click="showImageCropper = true" 
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  Изменить фото
                </button>
              </div>
            </div>
            
            <!-- Кнопка загрузки если фото нет -->
            <button 
              v-if="!form.photo && !showImageCropper"
              type="button" 
              @click="showImageCropper = true"
              class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
            >
              <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="text-gray-600">Загрузить фото</span>
            </button>

            <!-- Модальное окно с редактором -->
            <div v-if="showImageCropper" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                <div class="p-6">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Редактирование фото профиля</h3>
                    <button 
                      @click="closeImageCropper" 
                      class="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <ProfileImageCropper 
                    @photo-cropped="onPhotoCropped"
                    @photo-cancelled="onPhotoCancelled"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Колонка 3 -->
        <div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Логин</label>
            <input v-model="form.username" :disabled="isEdit" class="input" required />
          </div>
          <div class="mb-4" v-if="form.role !== undefined">
            <label class="block mb-1 font-medium">Роль</label>
            <select v-model="form.role" class="input">
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label class="block mb-1 font-medium">Пароль</label>
            <input v-model="form.password" type="password" class="input" required />
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label class="block mb-1 font-medium">Повторите пароль</label>
            <input v-model="form.password2" type="password" class="input" required />
          </div>
        </div>
      </div>
      <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
      <div class="flex justify-end space-x-2 mt-4">
        <button type="button" class="btn" @click="$emit('cancel')">Отмена</button>
        <button type="submit" class="btn bg-lime-500 text-white">Сохранить</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch, ref } from 'vue'
import ProfileImageCropper from './ProfileImageCropper.vue'

const props = defineProps({
  user: { type: Object, default: null },
  isEdit: { type: Boolean, default: false }
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  role: 'user',
  birthdate: '',
  password: '',
  password2: '',
  telegram_nick: '',
  telegram_id: '',
  photo: '',
  photo_file: null // Для хранения загруженного файла
})
const error = ref('')
const showImageCropper = ref(false)

watch(() => props.user, (val) => {
  if (val) {
    form.username = val.username || ''
    form.email = val.email || ''
    form.first_name = val.first_name || ''
    form.last_name = val.last_name || ''
    form.role = val.role || 'user'
    form.birthdate = val.birthdate || ''
    form.password = ''
    form.password2 = ''
    form.telegram_nick = val.telegram_nick || ''
    form.telegram_id = val.telegram_id || ''
    form.photo = val.photo || ''
  } else {
    form.username = ''
    form.email = ''
    form.first_name = ''
    form.last_name = ''
    form.role = 'user'
    form.birthdate = ''
    form.password = ''
    form.password2 = ''
    form.telegram_nick = ''
    form.telegram_id = ''
    form.photo = ''
  }
}, { immediate: true })

// Методы для работы с изображениями
const closeImageCropper = () => {
  showImageCropper.value = false
}

const onPhotoCropped = (croppedImageDataUrl) => {
  // Конвертируем DataURL в Blob для отправки на сервер
  fetch(croppedImageDataUrl)
    .then(res => res.blob())
    .then(blob => {
      // Создаем File объект из Blob
      const timestamp = Date.now()
      const file = new File([blob], `profile_photo_${timestamp}.jpg`, { 
        type: 'image/jpeg',
        lastModified: timestamp
      })
      
      // Устанавливаем URL для предварительного просмотра
      form.photo = croppedImageDataUrl
      form.photo_file = file
      
      console.log('✅ Фото профиля готово к сохранению:', file.size, 'bytes')
    })
    .catch(error => {
      console.error('❌ Ошибка конвертации изображения:', error)
    })
  
  showImageCropper.value = false
}

const onPhotoCancelled = () => {
  showImageCropper.value = false
}

function onSubmit() {
  error.value = ''
  if (!props.isEdit && form.password !== form.password2) {
    error.value = 'Пароли не совпадают'
    return
  }
  // Валидация обязательных полей
  if (!form.username || !form.email || (!props.isEdit && !form.password)) {
    error.value = 'Заполните все обязательные поля'
    return
  }
  
  // Создаем FormData для отправки файла
  const formData = new FormData()
  
  // Добавляем все поля формы
  Object.keys(form).forEach(key => {
    if (key === 'photo_file' && form[key]) {
      formData.append('photo', form[key])
    } else if (key !== 'photo_file' && form[key] !== null && form[key] !== '') {
      formData.append(key, form[key])
    }
  })
  
  emit('submit', formData)
}
</script>

<style scoped>
.input {
  @apply w-full border rounded px-3 py-2 mb-1;
}
.btn {
  @apply rounded px-4 py-2 font-bold hover:bg-lime-600 bg-gray-200;
}
form {
  min-width: 700px;
}
</style> 