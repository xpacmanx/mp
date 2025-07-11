<template>
  <div class="image-cropper-demo p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">🎨 Демо редактора изображений</h1>
      
      <!-- Кропперы -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Canvas Cropper - полнофункциональный -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-blue-800 mb-3">🚀 Canvas Cropper</h2>
          <p class="text-blue-700 mb-4 text-sm">
            Полнофункциональный кроппер с поворотами, отражениями и всеми возможностями.
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Поворот</span>
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Отражение</span>
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Сброс</span>
          </div>
          <a 
            href="/canvas-cropper" 
            class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🎨 Открыть →
          </a>
        </div>

        <!-- Profile Image Cropper - упрощенный для профиля -->
        <div class="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-green-800 mb-3">👤 Profile Cropper</h2>
          <p class="text-green-700 mb-4 text-sm">
            Упрощенный кроппер специально для редактирования фото профиля пользователей.
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Только кадрирование</span>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Быстрый</span>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Простой</span>
          </div>
          <a 
            href="/profile-image-test" 
            class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            👤 Открыть →
          </a>
        </div>
      </div>
      
      <!-- Сравнительная таблица -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-8">
        <div class="bg-gray-50 px-6 py-4 border-b">
          <h3 class="text-lg font-semibold">🔍 Сравнение кропперов</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Библиотека</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Проблемы</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Преимущества</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr class="bg-blue-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-blue-900">Canvas Cropper</div>
                  <div class="text-sm text-blue-700">Собственная реализация</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">✅ Рекомендуется</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  Пока не обнаружено
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  Полный контроль, без зависимостей, стабильная работа
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">vue-advanced-cropper</div>
                  <div class="text-sm text-gray-500">Удален из проекта</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">❌ Удален</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  Конфликты CSS, проблемы высоты, нестабильная работа
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  Хорошая документация
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">vue-modern-cropper</div>
                  <div class="text-sm text-gray-500">Удален из проекта</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">❌ Удален</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  Проблемы позиционирования, искажение изображений
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  Vue 3 совместимость, основан на cropperjs@next
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">vanilla cropperjs</div>
                  <div class="text-sm text-gray-500">Удален из проекта</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">❌ Удален</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  Конфликты с Tailwind CSS, сложная интеграция с Vue
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  Хорошо документирован, стабильная библиотека
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Инструкции по использованию -->
      <div class="info-panel bg-gray-50 rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">📋 Инструкции по использованию Canvas Cropper</h3>
        <div class="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 class="font-medium mb-3 text-blue-600">🎯 Основные операции:</h4>
            <ol class="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Перетащите изображение в область загрузки</li>
              <li>Нажмите и протащите по изображению для выбора области</li>
              <li>Используйте кнопки поворота и отражения</li>
              <li>Нажмите "Обрезать изображение"</li>
              <li>Просмотрите результат в разных форматах</li>
              <li>Скачайте или сохраните результат</li>
            </ol>
          </div>
          <div>
            <h4 class="font-medium mb-3 text-green-600">🚀 Технические особенности:</h4>
            <ul class="space-y-2 text-gray-700">
              <li>• <strong>HTML5 Canvas:</strong> Нативная обработка изображений</li>
              <li>• <strong>Touch Support:</strong> Работает на мобильных устройствах</li>
              <li>• <strong>Без зависимостей:</strong> Никаких внешних библиотек</li>
              <li>• <strong>Полный контроль:</strong> Возможность доработки под любые нужды</li>
              <li>• <strong>Tailwind CSS:</strong> Полностью совместим со стилями</li>
              <li>• <strong>Vue 3:</strong> Composition API и реактивность</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Canvas Cropper Demo Page
// Новая демо-страница для показа возможностей собственного кроппера
</script>

<style scoped>
/* Стили для новой демо страницы Canvas Cropper */
.image-cropper-demo {
  font-family: 'Inter', system-ui, sans-serif;
}
</style> 