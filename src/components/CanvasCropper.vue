<template>
  <div class="canvas-cropper-container p-8 max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-center">🎨 Canvas Image Cropper</h2>
    
    <!-- Загрузка файла -->
    <div v-if="!image" class="upload-area mb-8">
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        @change="handleFileSelect"
        class="hidden"
      />
      <div 
        @click="$refs.fileInput.click()"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
      >
        <svg class="w-16 h-16 mb-4 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Перетащите изображение сюда</h3>
        <p class="text-gray-500 mb-4">или нажмите для выбора файла</p>
        <div class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Выбрать изображение
        </div>
      </div>
    </div>

    <!-- Canvas Cropper -->
    <div v-if="image" class="cropper-section">
      <div class="bg-white border rounded-lg p-6 shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Кадрирование изображения</h3>
        
        <!-- Canvas Container -->
        <div class="canvas-container mb-6 bg-gray-50 border rounded-lg overflow-hidden">
          <canvas 
            ref="canvas"
            :class="[
              'max-w-full block mx-auto',
              cropState.isDragging ? 'cursor-grabbing' : 
              cropState.isHovering ? 'cursor-grab' : 'cursor-crosshair'
            ]"
            @mousedown="startCrop"
            @mousemove="handleMouseMove"
            @mouseup="endCrop"
            @mouseleave="endCrop"
            @touchstart="startCrop"
            @touchmove="doCrop"
            @touchend="endCrop"
          ></canvas>
        </div>

        <!-- Кнопки управления -->
        <div class="flex flex-wrap justify-center gap-3 mb-6">
          <button @click="resetCrop" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
            🔄 Сбросить
          </button>
          <button @click="rotateCCW" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            ↺ Повернуть влево
          </button>
          <button @click="rotateCW" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            ↻ Повернуть вправо
          </button>
          <button @click="flipHorizontal" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            ⇄ Отразить гор.
          </button>
          <button @click="flipVertical" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            ⇅ Отразить верт.
          </button>
        </div>

        <!-- Кнопки действий -->
        <div class="flex justify-center gap-4">
          <button @click="cancelCrop" class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
            Отмена
          </button>
          <button @click="cropImage" :disabled="!hasCropArea" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ hasCropArea ? 'Обрезать изображение' : 'Выберите область для обрезки' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Результат -->
    <div v-if="croppedImage" class="result-section mt-8">
      <div class="bg-white border rounded-lg p-6 shadow-lg">
        <h3 class="text-lg font-semibold mb-4 text-center">Результат кадрирования</h3>
        
        <div class="flex flex-wrap justify-center gap-8 mb-6">
          <!-- Оригинальный размер -->
          <div class="text-center">
            <h4 class="font-medium mb-2">Оригинальный размер</h4>
            <div class="border rounded-lg overflow-hidden shadow inline-block">
              <img :src="croppedImage" alt="Обрезанное изображение" class="max-w-xs max-h-64 object-contain" />
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ cropInfo.width }}x{{ cropInfo.height }}px</p>
          </div>

          <!-- Превью для досье -->
          <div class="text-center">
            <h4 class="font-medium mb-2">Фото для досье</h4>
            <div class="w-40 h-40 border rounded-lg overflow-hidden shadow">
              <img :src="croppedImage" alt="Превью досье" class="w-full h-full object-cover" />
            </div>
            <p class="text-sm text-gray-500 mt-1">400x400px</p>
          </div>

          <!-- Превью для профиля -->
          <div class="text-center">
            <h4 class="font-medium mb-2">Фото профиля</h4>
            <div class="w-20 h-20 border rounded-full overflow-hidden shadow">
              <img :src="croppedImage" alt="Превью профиля" class="w-full h-full object-cover" />
            </div>
            <p class="text-sm text-gray-500 mt-1">80x80px</p>
          </div>
        </div>

        <!-- Кнопки для результата -->
        <div class="flex justify-center gap-4">
          <button @click="newCrop" class="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
            Выбрать другую область
          </button>
          <button @click="downloadImage" class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            💾 Скачать изображение
          </button>
          <button @click="saveImage" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            ✅ Сохранить
          </button>
        </div>
      </div>
    </div>

    <!-- Инструкции -->
    <div v-if="image && !croppedImage" class="instructions mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="font-semibold text-blue-800 mb-2">📋 Инструкции:</h4>
      <ul class="text-blue-700 text-sm space-y-1">
        <li>• <strong>Квадратная область 1:1</strong> создается автоматически при загрузке изображения</li>
        <li>• <strong>Изменить размер:</strong> потащите за белые квадратики в углах красной области</li>
        <li>• <strong>Переместить область:</strong> кликните внутри красной области и перетащите</li>
        <li>• <strong>Создать новую область:</strong> кликните вне красной области и протащите мышью</li>
        <li>• <strong>Соотношение 1:1</strong> автоматически поддерживается во всех операциях</li>
        <li>• Используйте кнопки для поворота и отражения всего изображения</li>
        <li>• Нажмите "Обрезать изображение" когда область выбрана правильно</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'

const fileInput = ref(null)
const canvas = ref(null)
const image = ref(null)
const croppedImage = ref('')

// Состояние кропа
const cropState = reactive({
  isDrawing: false,
  isDragging: false,
  isResizing: false,
  isHovering: false,
  resizeHandle: null, // 'nw', 'ne', 'sw', 'se'
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  dragStartX: 0,
  dragStartY: 0,
  dragOffsetX: 0,
  dragOffsetY: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1
})

// Информация об обрезанном изображении
const cropInfo = reactive({
  width: 0,
  height: 0
})

const hasCropArea = computed(() => {
  return Math.abs(cropState.endX - cropState.startX) > 10 && 
         Math.abs(cropState.endY - cropState.startY) > 10
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    loadImage(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

const loadImage = (file) => {
  console.log('📁 Загружаем изображение:', file.name)
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      console.log('✅ Изображение загружено:', img.width + 'x' + img.height)
      image.value = img
      resetCrop()
      setupCanvas()
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const setupCanvas = async () => {
  await nextTick()
  
  if (!canvas.value || !image.value) return
  
  const ctx = canvas.value.getContext('2d')
  const img = image.value
  
  // Рассчитываем размеры для отображения
  const maxWidth = 800
  const maxHeight = 600
  
  let displayWidth = img.width
  let displayHeight = img.height
  
  // Масштабируем если изображение слишком большое
  if (img.width > maxWidth || img.height > maxHeight) {
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
    displayWidth = img.width * ratio
    displayHeight = img.height * ratio
  }
  
  canvas.value.width = displayWidth
  canvas.value.height = displayHeight
  
  // Сразу создаем квадратную область выделения по центру
  const squareSize = Math.min(displayWidth, displayHeight) * 0.6 // 60% от меньшей стороны
  const centerX = displayWidth / 2
  const centerY = displayHeight / 2
  
  cropState.startX = centerX - squareSize / 2
  cropState.startY = centerY - squareSize / 2
  cropState.endX = centerX + squareSize / 2
  cropState.endY = centerY + squareSize / 2
  
  drawImage()
}

const drawImage = () => {
  if (!canvas.value || !image.value) return
  
  const ctx = canvas.value.getContext('2d')
  const img = image.value
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Сохраняем текущий контекст
  ctx.save()
  
  // Применяем трансформации
  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height / 2
  
  ctx.translate(centerX, centerY)
  ctx.rotate(cropState.rotation * Math.PI / 180)
  ctx.scale(cropState.scaleX, cropState.scaleY)
  ctx.translate(-centerX, -centerY)
  
  // Рисуем изображение
  ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
  
  // Восстанавливаем контекст
  ctx.restore()
  
  // Рисуем область обрезки если есть
  if (hasCropArea.value) {
    drawCropArea()
  }
}

const drawCropArea = () => {
  const ctx = canvas.value.getContext('2d')
  
  const x = Math.min(cropState.startX, cropState.endX)
  const y = Math.min(cropState.startY, cropState.endY)
  const width = Math.abs(cropState.endX - cropState.startX)
  const height = Math.abs(cropState.endY - cropState.startY)
  
  // Создаем маску для затемнения области вне выделения
  ctx.save()
  
  // Затемняем всю область
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Создаем "дырку" в затемнении для выделенной области
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillRect(x, y, width, height)
  
  // Восстанавливаем нормальный режим композиции
  ctx.globalCompositeOperation = 'source-over'
  ctx.restore()
  
  // Рисуем границы области обрезки
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.strokeRect(x, y, width, height)
  ctx.setLineDash([])
  
  // Рисуем интерактивные точки изменения размера в углах
  const handleSize = 12
  const handleBorder = 2
  
  // Координаты углов
  const corners = [
    { x: x, y: y, handle: 'nw' }, // North-West (верхний левый)
    { x: x + width, y: y, handle: 'ne' }, // North-East (верхний правый)
    { x: x, y: y + height, handle: 'sw' }, // South-West (нижний левый)
    { x: x + width, y: y + height, handle: 'se' } // South-East (нижний правый)
  ]
  
  corners.forEach(corner => {
    // Белый фон точки
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(
      corner.x - handleSize / 2, 
      corner.y - handleSize / 2, 
      handleSize, 
      handleSize
    )
    
    // Красная граница точки
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = handleBorder
    ctx.setLineDash([])
    ctx.strokeRect(
      corner.x - handleSize / 2, 
      corner.y - handleSize / 2, 
      handleSize, 
      handleSize
    )
    
    // Добавляем маленький крестик в центре для лучшей видимости
    const crossSize = 4
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(corner.x - crossSize, corner.y)
    ctx.lineTo(corner.x + crossSize, corner.y)
    ctx.moveTo(corner.x, corner.y - crossSize)
    ctx.lineTo(corner.x, corner.y + crossSize)
    ctx.stroke()
  })
}

const getEventPos = (event) => {
  const rect = canvas.value.getBoundingClientRect()
  const clientX = event.clientX || (event.touches && event.touches[0].clientX)
  const clientY = event.clientY || (event.touches && event.touches[0].clientY)
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

const startCrop = (event) => {
  event.preventDefault()
  const pos = getEventPos(event)
  
  // Сначала проверяем, кликнули ли на точку изменения размера
  const resizeHandle = getResizeHandle(pos)
  
  if (resizeHandle) {
    // Начинаем изменение размера
    cropState.isResizing = true
    cropState.resizeHandle = resizeHandle
    cropState.dragStartX = pos.x
    cropState.dragStartY = pos.y
    console.log('🔄 Начинаем изменение размера:', resizeHandle)
    return
  }
  
  // Проверяем, кликнули ли мы внутри существующей области выделения
  const x = Math.min(cropState.startX, cropState.endX)
  const y = Math.min(cropState.startY, cropState.endY)
  const width = Math.abs(cropState.endX - cropState.startX)
  const height = Math.abs(cropState.endY - cropState.startY)
  
  const isInsideCropArea = pos.x >= x && pos.x <= x + width && 
                          pos.y >= y && pos.y <= y + height
  
  if (isInsideCropArea && hasCropArea.value) {
    // Начинаем перетаскивание области
    cropState.isDragging = true
    cropState.dragStartX = pos.x
    cropState.dragStartY = pos.y
    cropState.dragOffsetX = pos.x - x
    cropState.dragOffsetY = pos.y - y
    console.log('🖱️ Начинаем перетаскивание области')
  } else {
    // Начинаем создание новой области
    cropState.isDrawing = true
    cropState.startX = pos.x
    cropState.startY = pos.y
    cropState.endX = pos.x
    cropState.endY = pos.y
    console.log('🖱️ Начинаем выделение новой области')
  }
}

const getResizeHandle = (pos) => {
  if (!hasCropArea.value) return null
  
  const x = Math.min(cropState.startX, cropState.endX)
  const y = Math.min(cropState.startY, cropState.endY)
  const width = Math.abs(cropState.endX - cropState.startX)
  const height = Math.abs(cropState.endY - cropState.startY)
  
  const handleSize = 12
  const tolerance = handleSize / 2
  
  // Проверяем каждый угол
  const corners = [
    { x: x, y: y, handle: 'nw' },
    { x: x + width, y: y, handle: 'ne' },
    { x: x, y: y + height, handle: 'sw' },
    { x: x + width, y: y + height, handle: 'se' }
  ]
  
  for (const corner of corners) {
    if (pos.x >= corner.x - tolerance && pos.x <= corner.x + tolerance &&
        pos.y >= corner.y - tolerance && pos.y <= corner.y + tolerance) {
      return corner.handle
    }
  }
  
  return null
}

const getCursorForHandle = (handle) => {
  switch (handle) {
    case 'nw':
    case 'se':
      return 'cursor-nw-resize'
    case 'ne':
    case 'sw':
      return 'cursor-ne-resize'
    default:
      return 'cursor-crosshair'
  }
}

const handleMouseMove = (event) => {
  const pos = getEventPos(event)
  
  // Проверяем, находится ли курсор над точкой изменения размера
  const resizeHandle = getResizeHandle(pos)
  
  if (resizeHandle) {
    // Курсор над точкой изменения размера
    cropState.isHovering = false
    canvas.value.className = canvas.value.className.replace(/cursor-\w+/g, '') + ' ' + getCursorForHandle(resizeHandle)
  } else if (hasCropArea.value) {
    // Проверяем, находится ли курсор над областью выделения
    const x = Math.min(cropState.startX, cropState.endX)
    const y = Math.min(cropState.startY, cropState.endY)
    const width = Math.abs(cropState.endX - cropState.startX)
    const height = Math.abs(cropState.endY - cropState.startY)
    
    const isInsideCropArea = pos.x >= x && pos.x <= x + width && 
                            pos.y >= y && pos.y <= y + height
    
    cropState.isHovering = isInsideCropArea
  } else {
    cropState.isHovering = false
  }
  
  // Вызываем обычную обработку если идет операция
  if (cropState.isDrawing || cropState.isDragging || cropState.isResizing) {
    doCrop(event)
  }
}

const doCrop = (event) => {
  if (!cropState.isDrawing && !cropState.isDragging && !cropState.isResizing) return
  
  event.preventDefault()
  const pos = getEventPos(event)
  
  if (cropState.isResizing) {
    // Изменяем размер области с сохранением пропорций 1:1
    const currentX = Math.min(cropState.startX, cropState.endX)
    const currentY = Math.min(cropState.startY, cropState.endY)
    const currentWidth = Math.abs(cropState.endX - cropState.startX)
    const currentHeight = Math.abs(cropState.endY - cropState.startY)
    
    // Минимальный размер области
    const minSize = 30
    
    // Рассчитываем новые координаты напрямую от позиции курсора
    let newStartX = currentX
    let newStartY = currentY
    let newEndX = currentX + currentWidth
    let newEndY = currentY + currentHeight
    
    switch (cropState.resizeHandle) {
      case 'nw': // Верхний левый угол
        {
          // Расстояние от курсора до противоположного угла
          const distanceToOpposite = Math.min(
            Math.abs(newEndX - pos.x), 
            Math.abs(newEndY - pos.y)
          )
          // Убеждаемся, что область не становится слишком маленькой
          const finalSize = Math.max(distanceToOpposite, minSize)
          newStartX = newEndX - finalSize
          newStartY = newEndY - finalSize
        }
        break
        
      case 'ne': // Верхний правый угол
        {
          // Расстояние от курсора до противоположного угла
          const distanceToOpposite = Math.min(
            Math.abs(pos.x - newStartX), 
            Math.abs(newEndY - pos.y)
          )
          const finalSize = Math.max(distanceToOpposite, minSize)
          newEndX = newStartX + finalSize
          newStartY = newEndY - finalSize
        }
        break
        
      case 'sw': // Нижний левый угол
        {
          // Расстояние от курсора до противоположного угла
          const distanceToOpposite = Math.min(
            Math.abs(newEndX - pos.x), 
            Math.abs(pos.y - newStartY)
          )
          const finalSize = Math.max(distanceToOpposite, minSize)
          newStartX = newEndX - finalSize
          newEndY = newStartY + finalSize
        }
        break
        
      case 'se': // Нижний правый угол
        {
          // Расстояние от курсора до противоположного угла (левый верхний)
          const distanceToOpposite = Math.min(
            Math.abs(pos.x - newStartX), 
            Math.abs(pos.y - newStartY)
          )
          const finalSize = Math.max(distanceToOpposite, minSize)
          newEndX = newStartX + finalSize
          newEndY = newStartY + finalSize
        }
        break
    }
    
    // Проверяем границы и минимальный размер
    const newWidth = newEndX - newStartX
    const newHeight = newEndY - newStartY
    
    if (newWidth >= minSize && newHeight >= minSize &&
        newStartX >= 0 && newStartY >= 0 &&
        newEndX <= canvas.value.width && newEndY <= canvas.value.height) {
      cropState.startX = newStartX
      cropState.startY = newStartY
      cropState.endX = newEndX
      cropState.endY = newEndY
    }
    
  } else if (cropState.isDragging) {
    // Перетаскиваем существующую область
    const width = Math.abs(cropState.endX - cropState.startX)
    const height = Math.abs(cropState.endY - cropState.startY)
    
    const newX = pos.x - cropState.dragOffsetX
    const newY = pos.y - cropState.dragOffsetY
    
    // Ограничиваем перетаскивание границами canvas
    const limitedX = Math.max(0, Math.min(newX, canvas.value.width - width))
    const limitedY = Math.max(0, Math.min(newY, canvas.value.height - height))
    
    cropState.startX = limitedX
    cropState.startY = limitedY
    cropState.endX = limitedX + width
    cropState.endY = limitedY + height
    
  } else if (cropState.isDrawing) {
    // Создаем новую квадратную область 1:1
    const deltaX = pos.x - cropState.startX
    const deltaY = pos.y - cropState.startY
    
    // Берем меньшую дельту чтобы сохранить пропорции 1:1
    const squareSize = Math.min(Math.abs(deltaX), Math.abs(deltaY))
    
    // Определяем направление
    const signX = deltaX >= 0 ? 1 : -1
    const signY = deltaY >= 0 ? 1 : -1
    
    cropState.endX = cropState.startX + (squareSize * signX)
    cropState.endY = cropState.startY + (squareSize * signY)
  }
  
  drawImage()
}

const endCrop = (event) => {
  if (!cropState.isDrawing && !cropState.isDragging && !cropState.isResizing) return
  
  event.preventDefault()
  
  if (cropState.isDrawing) {
    cropState.isDrawing = false
    console.log('✅ Область создана:', {
      width: Math.abs(cropState.endX - cropState.startX),
      height: Math.abs(cropState.endY - cropState.startY)
    })
  }
  
  if (cropState.isDragging) {
    cropState.isDragging = false
    console.log('✅ Область перемещена')
  }
  
  if (cropState.isResizing) {
    cropState.isResizing = false
    cropState.resizeHandle = null
    console.log('✅ Размер области изменен:', {
      width: Math.abs(cropState.endX - cropState.startX),
      height: Math.abs(cropState.endY - cropState.startY)
    })
  }
}

const resetCrop = () => {
  if (!canvas.value) return
  
  // Создаем новую квадратную область по центру
  const squareSize = Math.min(canvas.value.width, canvas.value.height) * 0.6
  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height / 2
  
  cropState.startX = centerX - squareSize / 2
  cropState.startY = centerY - squareSize / 2
  cropState.endX = centerX + squareSize / 2
  cropState.endY = centerY + squareSize / 2
  cropState.isDrawing = false
  cropState.isDragging = false
  cropState.isResizing = false
  cropState.resizeHandle = null
  croppedImage.value = ''
  drawImage()
}

const rotateCCW = () => {
  cropState.rotation -= 90
  if (cropState.rotation < 0) cropState.rotation = 270
  resetCrop()
  drawImage()
}

const rotateCW = () => {
  cropState.rotation += 90
  if (cropState.rotation >= 360) cropState.rotation = 0
  resetCrop()
  drawImage()
}

const flipHorizontal = () => {
  cropState.scaleX *= -1
  resetCrop()
  drawImage()
}

const flipVertical = () => {
  cropState.scaleY *= -1
  resetCrop()
  drawImage()
}

const cropImage = () => {
  if (!hasCropArea.value) {
    alert('Сначала выберите область для обрезки')
    return
  }
  
  console.log('✂️ Обрезаем изображение')
  
  const x = Math.min(cropState.startX, cropState.endX)
  const y = Math.min(cropState.startY, cropState.endY)
  const width = Math.abs(cropState.endX - cropState.startX)
  const height = Math.abs(cropState.endY - cropState.startY)
  
  // Создаем новый canvas для обрезанного изображения
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  
  // Делаем результат квадратным (берем меньшую сторону)
  const squareSize = Math.min(width, height)
  tempCanvas.width = squareSize
  tempCanvas.height = squareSize
  
  // Создаем промежуточный canvas для правильной обработки трансформаций
  const sourceCanvas = document.createElement('canvas')
  const sourceCtx = sourceCanvas.getContext('2d')
  
  sourceCanvas.width = canvas.value.width
  sourceCanvas.height = canvas.value.height
  
  // Рисуем изображение с трансформациями на промежуточном canvas
  sourceCtx.save()
  
  const centerX = sourceCanvas.width / 2
  const centerY = sourceCanvas.height / 2
  
  sourceCtx.translate(centerX, centerY)
  sourceCtx.rotate(cropState.rotation * Math.PI / 180)
  sourceCtx.scale(cropState.scaleX, cropState.scaleY)
  sourceCtx.translate(-centerX, -centerY)
  
  sourceCtx.drawImage(image.value, 0, 0, sourceCanvas.width, sourceCanvas.height)
  sourceCtx.restore()
  
  // Обрезаем квадратную область из центра выделения
  const centerCropX = x + width / 2 - squareSize / 2
  const centerCropY = y + height / 2 - squareSize / 2
  
  tempCtx.drawImage(
    sourceCanvas,
    centerCropX, centerCropY, squareSize, squareSize,
    0, 0, squareSize, squareSize
  )
  
  croppedImage.value = tempCanvas.toDataURL('image/jpeg', 0.9)
  cropInfo.width = squareSize
  cropInfo.height = squareSize
  
  console.log('✅ Квадратное изображение обрезано:', squareSize + 'x' + squareSize)
}

const newCrop = () => {
  croppedImage.value = ''
  resetCrop()
}

const downloadImage = () => {
  if (!croppedImage.value) return
  
  const link = document.createElement('a')
  link.download = 'cropped-image.jpg'
  link.href = croppedImage.value
  link.click()
  
  console.log('💾 Изображение скачано')
}

const saveImage = () => {
  if (!croppedImage.value) return
  
  console.log('✅ Изображение сохранено')
  alert('Изображение сохранено!')
}

const cancelCrop = () => {
  image.value = null
  croppedImage.value = ''
  resetCrop()
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  console.log('❌ Операция отменена')
}
</script>

<style scoped>
.canvas-cropper-container {
  font-family: 'Inter', system-ui, sans-serif;
}

.canvas-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.hidden {
  display: none;
}

canvas {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

/* Курсоры для изменения размера */
.cursor-nw-resize {
  cursor: nw-resize;
}

.cursor-ne-resize {
  cursor: ne-resize;
}

.cursor-se-resize {
  cursor: se-resize;
}

.cursor-sw-resize {
  cursor: sw-resize;
}
</style> 