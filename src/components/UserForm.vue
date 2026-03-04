<template>
  <div>
    <form @submit.prevent="onSubmit" class="tactical-form">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Колонка 1 -->
        <div>
          <div class="mb-4">
            <label class="tactical-label">Имя</label>
            <input v-model="form.first_name" class="tactical-input" />
          </div>
          <div class="mb-4">
            <label class="tactical-label">Фамилия</label>
            <input v-model="form.last_name" class="tactical-input" />
          </div>
          <div class="mb-4">
            <label class="tactical-label">День рождения</label>
            <input v-model="form.birthdate" type="date" class="tactical-input" />
          </div>
          <div class="mb-4">
            <label class="tactical-label">Email</label>
            <input v-model="form.email" type="email" class="tactical-input" required />
          </div>
        </div>
        <!-- Колонка 2 -->
        <div>
          <div class="mb-4">
            <label class="tactical-label">Телеграм ник</label>
            <input v-model="form.telegram_nick" class="tactical-input" />
          </div>
          <div class="mb-4">
            <label class="tactical-label">Telegram ID</label>
            <input v-model="form.telegram_id" class="tactical-input" />
          </div>
          <div class="mb-4">
            <label class="tactical-label">Фото профиля</label>
            <!-- Превью текущего фото -->
            <div v-if="form.photo && !showImageCropper" class="mb-3">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-full overflow-hidden border border-gray-600">
                  <img :src="form.photo" alt="Текущее фото" class="w-full h-full object-cover" />
                </div>
                <button 
                  type="button" 
                  @click="showImageCropper = true" 
                  class="text-sm text-accent hover:underline"
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
              class="w-full border border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-400 transition-colors bg-transparent"
            >
              <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="text-gray-400">Загрузить фото</span>
            </button>

            <!-- Модальное окно с редактором -->
            <div v-if="showImageCropper" class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
              <div class="bg-panel rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto border border-gray-700">
                <div class="p-6">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-white">Редактирование фото профиля</h3>
                    <button 
                      @click="closeImageCropper" 
                      class="text-gray-400 hover:text-white text-2xl"
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
            <label class="tactical-label">Логин</label>
            <input v-model="form.username" :disabled="isEdit" class="tactical-input" required />
          </div>
          <div class="mb-4" v-if="form.role !== undefined">
            <label class="tactical-label">Роль</label>
            <select v-model="form.role" class="tactical-input">
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
              <option value="top">Топ-менеджер</option>
              <option value="logistics">Логист</option>
              <option value="masters">Мастер</option>
              <option value="marketing">Маркетинг</option>
              <option value="production">Производство</option>
              <option value="packers">Упаковщик</option>
            </select>
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label class="tactical-label">Пароль</label>
            <input v-model="form.password" type="password" class="tactical-input" required />
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label class="tactical-label">Повторите пароль</label>
            <input v-model="form.password2" type="password" class="tactical-input" required />
          </div>
        </div>
      </div>
      <div v-if="error" class="text-danger mb-2">{{ error }}</div>
      <div class="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-800">
        <TacticalButton type="button" variant="secondary" @click="$emit('cancel')">ОТМЕНА</TacticalButton>
        <TacticalButton type="submit" variant="primary">СОХРАНИТЬ</TacticalButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch, ref } from 'vue'
import ProfileImageCropper from './ProfileImageCropper.vue'
import TacticalButton from './TacticalButton.vue'

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
.tactical-form {
  min-width: 700px;
}

.tactical-label {
  display: block;
  margin-bottom: 4px;
  font-family: var(--font-family-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tactical-input {
  width: 100%;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-subtle);
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.tactical-input:focus {
  border-color: var(--color-accent-primary);
}

.tactical-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-accent {
  color: var(--color-accent-primary);
}

.text-danger {
  color: var(--color-accent-danger);
}

.bg-panel {
  background-color: var(--color-bg-panel);
}
</style> 