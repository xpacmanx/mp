<template>
  <div class="image-cropper-container">

    
    <!-- Кнопка для выбора файла -->
    <div v-if="!imageSrc" class="upload-area">
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        @change="handleFileSelect"
        class="hidden"
      />
      <button 
        type="button"
        @click="$refs.fileInput.click()"
        class="upload-btn"
      >
        <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        Загрузить фото
      </button>
    </div>

    <!-- Редактор кадрирования -->
    <div v-if="imageSrc && showCropper" class="cropper-section">
      
      
      <div class="cropper-container">
        
        <!-- Заглушка - функциональность перенесена в ModernCropper -->
        <div class="flex items-center justify-center h-full bg-gray-100 rounded border-2 border-dashed border-gray-300">
          <div class="text-center p-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Устаревший компонент</h3>
            <p class="text-gray-600 mb-4">Функциональность перенесена в новый Modern Cropper</p>
            <a 
              href="/modern-cropper-test" 
              class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Перейти к Modern Cropper
            </a>
          </div>
        </div>
      </div>
      
      <div class="cropper-controls">
        <button @click="rotateLeft" class="control-btn">
          ↺ Влево 90°
        </button>
        <button @click="rotateRight" class="control-btn">
          ↻ Вправо 90°
        </button>
        <button @click="flipHorizontal" class="control-btn">
          ⇄ Отразить
        </button>
        <button @click="resetCrop" class="control-btn">
          ⟲ Сбросить
        </button>
        <button @click="fitImage" class="control-btn">
          ⛶ По размеру
        </button>
      </div>

      <div class="action-buttons">
        <button @click="cancelCrop" class="btn btn-cancel">
          Отмена
        </button>
        <button @click="cropImage" class="btn btn-primary">
          Применить
        </button>
      </div>
    </div>

    <!-- Превью результатов -->
    <div v-if="croppedImage && !showCropper" class="preview-section">
      <div class="preview-container">
        <!-- Большое квадратное превью для досье -->
        <div class="preview-large">
          <h4 class="preview-title">Фото для досье</h4>
          <div class="preview-square">
            <img :src="croppedImage" alt="Превью досье" class="preview-img-square" />
          </div>
          <p class="preview-size">400x400px</p>
        </div>

        <!-- Маленькое круглое превью для профиля -->
        <div class="preview-small">
          <h4 class="preview-title">Фото профиля</h4>
          <div class="preview-circle">
            <img :src="croppedImage" alt="Превью профиля" class="preview-img-circle" />
          </div>
          <p class="preview-size">80x80px</p>
        </div>
      </div>

      <div class="final-actions">
        <button @click="changePhoto" class="btn btn-secondary">
          Изменить фото
        </button>
        <button @click="savePhoto" class="btn btn-success">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { validateImageFile, compressImage } from '../tools/imageUpload.js'

const emit = defineEmits(['photo-selected', 'photo-saved'])

const fileInput = ref(null)
const cropper = ref(null)
const imageSrc = ref('')
const croppedImage = ref('')
const showCropper = ref(false)

// Инициализация компонента
console.log('🚀 ImageCropper инициализирован')

const handleFileSelect = async (event) => {
  console.log('🟢 handleFileSelect вызван')
  
  const file = event.target.files[0]
  console.log('📁 Выбранный файл:', {
    name: file?.name,
    size: file?.size,
    type: file?.type
  })
  
  if (file) {
    // Валидация файла
    console.log('🔍 Начинаем валидацию файла...')
    const validation = validateImageFile(file)
    console.log('✅ Результат валидации:', validation)
    
    if (!validation.isValid) {
      console.error('❌ Валидация провалена:', validation.errors)
      alert(validation.errors.join('\n'))
      return
    }

    try {
      console.log('🔄 Начинаем обработку изображения...')
      
      // Сжимаем изображение если оно слишком большое
      let processedFile = file
      if (file.size > 2 * 1024 * 1024) { // Сжимаем если больше 2MB
        console.log('📦 Файл большой, сжимаем...')
        const compressedBlob = await compressImage(file, 1200, 1200, 0.8)
        processedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' })
        console.log('✅ Файл сжат. Новый размер:', processedFile.size)
      } else {
        console.log('✅ Файл не требует сжатия')
      }

      console.log('📖 Читаем файл как DataURL...')
      const reader = new FileReader()
      
      reader.onload = (e) => {
        console.log('✅ Файл прочитан успешно')
        console.log('🖼️ Устанавливаем imageSrc...')
        imageSrc.value = e.target.result
        console.log('🔧 Показываем cropper...')
        showCropper.value = true
        console.log('🗑️ Очищаем старое обрезанное изображение...')
        croppedImage.value = ''
        
        console.log('📊 Текущее состояние:')
        console.log('- imageSrc.value:', !!imageSrc.value)
        console.log('- showCropper.value:', showCropper.value)
        console.log('- croppedImage.value:', !!croppedImage.value)
      }
      
      reader.onerror = (error) => {
        console.error('❌ Ошибка чтения файла:', error)
        alert('Ошибка при чтении файла')
      }
      
      reader.readAsDataURL(processedFile)
    } catch (error) {
      console.error('❌ Ошибка обработки изображения:', error)
      alert('Ошибка при обработке изображения: ' + error.message)
    }
  } else {
    console.log('❌ Файл не выбран')
  }
}

const rotateLeft = () => {
  console.log('🔄 Поворот влево - функция отключена, используйте Modern Cropper')
  alert('Используйте Modern Cropper для кадрирования изображений')
}

const rotateRight = () => {
  console.log('🔄 Поворот вправо - функция отключена, используйте Modern Cropper')
  alert('Используйте Modern Cropper для кадрирования изображений')
}

const resetCrop = () => {
  console.log('🔄 Сброс кадрирования - функция отключена, используйте Modern Cropper')
  alert('Используйте Modern Cropper для кадрирования изображений')
}

const flipHorizontal = () => {
  console.log('🔄 Отражение по горизонтали - функция отключена, используйте Modern Cropper')
  alert('Используйте Modern Cropper для кадрирования изображений')
}

const fitImage = () => {
  console.log('🔄 Подгонка изображения по размеру - функция отключена, используйте Modern Cropper')
  alert('Используйте Modern Cropper для кадрирования изображений')
}

const cancelCrop = () => {
  console.log('❌ Отмена кадрирования')
  imageSrc.value = ''
  showCropper.value = false
  croppedImage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  console.log('✅ Состояние сброшено')
}

const cropImage = () => {
  console.log('✂️ Кадрирование - функция отключена, используйте Modern Cropper')
  alert('Используйте Modern Cropper для кадрирования изображений')
}

const changePhoto = () => {
  console.log('🔄 Смена фото')
  showCropper.value = true
}

const savePhoto = () => {
  console.log('💾 Сохранение фото:', croppedImage.value)
  emit('photo-saved', croppedImage.value)
}

// Функции удалены - используйте Modern Cropper для полной функциональности
</script>

<style scoped>
.image-cropper-container {
  max-width: 800px;
  margin: 0 auto;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors;
}

.upload-btn {
  @apply flex flex-col items-center justify-center w-full py-4 px-6 text-gray-600 hover:text-gray-800 transition-colors;
}

.cropper-section {
  @apply space-y-4;
}

.cropper-container {
  height: 400px;
  width: 100%;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.cropper-component {
  width: 100%;
  height: 100%;
}

.cropper-controls {
  @apply flex justify-center space-x-2 flex-wrap gap-2;
}

.control-btn {
  @apply px-3 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm transition-colors font-medium text-gray-700;
  min-width: 80px;
}

.control-btn:hover {
  @apply shadow-md;
}

.action-buttons {
  @apply flex justify-center space-x-4;
}

.preview-section {
  @apply space-y-6;
}

.preview-container {
  @apply flex justify-center items-start space-x-8;
}

.preview-large, .preview-small {
  @apply text-center;
}

.preview-title {
  @apply font-medium mb-2 text-gray-700;
}

.preview-square {
  @apply w-40 h-40 border rounded-lg overflow-hidden mx-auto mb-2 shadow-sm;
}

.preview-img-square {
  @apply w-full h-full object-cover;
}

.preview-circle {
  @apply w-20 h-20 border rounded-full overflow-hidden mx-auto mb-2 shadow-sm;
}

.preview-img-circle {
  @apply w-full h-full object-cover;
}

.preview-size {
  @apply text-xs text-gray-500;
}

.final-actions {
  @apply flex justify-center space-x-4;
}

.btn {
  @apply px-4 py-2 rounded font-medium transition-colors;
}

.btn-cancel {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700;
}

.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white;
}

.btn-secondary {
  @apply bg-gray-500 hover:bg-gray-600 text-white;
}

.btn-success {
  @apply bg-green-500 hover:bg-green-600 text-white;
}

.hidden {
  display: none;
}
</style> 