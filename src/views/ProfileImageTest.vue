<template>
  <div class="profile-image-test">
    <div class="max-w-2xl mx-auto p-8">
      <h1 class="text-3xl font-bold mb-8 text-center">Тест редактора фото профиля</h1>
      
      <div class="bg-white border rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Упрощенный кроппер для профиля</h2>
        <p class="text-gray-600 mb-6">
          Этот кроппер предназначен для редактирования фото профиля пользователя.
          Без кнопок поворота, отражения и сброса.
        </p>
        
        <ProfileImageCropper 
          @photo-cropped="onPhotoCropped"
          @photo-cancelled="onPhotoCancelled"
        />
        
        <!-- Результат -->
        <div v-if="croppedImage" class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 class="font-semibold text-green-800 mb-3">Результат обработки:</h3>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-green-300">
              <img :src="croppedImage" alt="Результат" class="w-full h-full object-cover" />
            </div>
            <div class="text-sm text-green-700">
              <p><strong>DataURL размер:</strong> {{ (croppedImage.length / 1024).toFixed(1) }} KB</p>
              <p><strong>Статус:</strong> Готово к отправке на сервер</p>
            </div>
          </div>
          <button 
            @click="resetTest" 
            class="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Начать заново
          </button>
        </div>
        
        <!-- Инструкции -->
        <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="font-semibold text-blue-800 mb-3">Особенности профильного кроппера:</h3>
          <ul class="text-blue-700 text-sm space-y-1">
            <li>✅ Только основные функции: загрузка, кадрирование, сохранение</li>
            <li>✅ Автоматическое создание квадратной области 1:1</li>
            <li>✅ Перетаскивание и изменение размера области</li>
            <li>✅ Превью в двух форматах: круглый профиль и квадратное досье</li>
            <li>✅ Максимальный размер изображения 400x400px для быстрой загрузки</li>
            <li>✅ Валидация файлов (JPG, PNG до 10MB)</li>
            <li>❌ Убраны кнопки поворота, отражения и сброса</li>
            <li>❌ Упрощенный интерфейс для быстрого редактирования</li>
          </ul>
        </div>
      </div>
      
      <!-- Навигация -->
      <div class="mt-8 text-center">
        <router-link 
          to="/canvas-cropper" 
          class="inline-block px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors mr-4"
        >
          ← Полный кроппер
        </router-link>
        <router-link 
          to="/users" 
          class="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Список пользователей →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProfileImageCropper from '../components/ProfileImageCropper.vue'

const croppedImage = ref('')

const onPhotoCropped = (imageDataUrl) => {
  croppedImage.value = imageDataUrl
  console.log('🎉 Фото профиля готово:', imageDataUrl.substring(0, 50) + '...')
}

const onPhotoCancelled = () => {
  console.log('❌ Редактирование отменено')
}

const resetTest = () => {
  croppedImage.value = ''
}
</script>

<style scoped>
.profile-image-test {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', system-ui, sans-serif;
}
</style> 