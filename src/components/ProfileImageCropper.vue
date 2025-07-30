<template>
  <div class="profile-image-cropper">
    <!-- Загрузка файла -->
    <div v-if="!image" class="upload-area mb-6">
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
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
      >
        <svg class="w-12 h-12 mb-3 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Загрузить фото профиля</h3>
        <p class="text-gray-500 text-sm">Перетащите изображение сюда или нажмите для выбора</p>
        <p class="text-gray-400 text-xs mt-2">JPG, PNG до 10MB</p>
      </div>
    </div>

    <!-- Canvas Cropper -->
    <div v-if="image && !croppedImage" class="cropper-section">
      <div class="bg-white border rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-medium mb-4 text-center">Обрезка фото профиля</h3>
        
        <!-- Canvas Container -->
        <div class="canvas-container mb-4 bg-gray-50 border rounded-lg overflow-hidden">
          <canvas 
            ref="canvas"
            :class="[
              'max-w-full block mx-auto',
              cropState.isDragging ? 'cursor-grabbing' : 
              cropState.isResizing ? 'cursor-nw-resize' : ''
            ]"
            @mousedown="startCrop"
            @mousemove="onMouseMove"
            @mouseup="endCrop"
            @mouseleave="endCrop"
            @touchstart="startCrop"
            @touchmove="onMouseMove"
            @touchend="endCrop"
          ></canvas>
        </div>

        <!-- Инструкция -->
        <div class="text-center text-sm text-gray-600 mb-4">
          <p>Перетащите область для перемещения • Тащите за углы для изменения размера</p>
        </div>

        <!-- Кнопки действий -->
        <div class="flex justify-center gap-3">
          <button @click="cancelCrop" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
            Отмена
          </button>
          <button @click="cropImage" :disabled="!hasCropArea" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Обрезать
          </button>
        </div>
      </div>
    </div>

    <!-- Результат -->
    <div v-if="croppedImage" class="result-section">
      <div class="text-center">
        <h3 class="text-lg font-medium mb-4">Предварительный просмотр</h3>
        
        <div class="flex justify-center items-center gap-6 mb-6">
          <!-- Превью для профиля -->
          <div class="text-center">
            <div class="w-24 h-24 border-2 border-gray-200 rounded-full overflow-hidden shadow-sm mx-auto mb-2">
              <img :src="croppedImage" alt="Фото профиля" class="w-full h-full object-cover" />
            </div>
            <p class="text-sm text-gray-600">Фото профиля</p>
          </div>

          <!-- Превью для досье -->
          <div class="text-center">
            <div class="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm mx-auto mb-2">
              <img :src="croppedImage" alt="Фото для досье" class="w-full h-full object-cover" />
            </div>
            <p class="text-sm text-gray-600">Фото для досье</p>
          </div>
        </div>

        <!-- Кнопки для результата -->
        <div class="flex justify-center gap-3">
          <button @click="newCrop" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
            Изменить
          </button>
          <button @click="saveImage" class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Сохранить фото
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'

const emit = defineEmits(['image-cropped', 'cancel'])

const fileInput = ref(null)
const canvas = ref(null)
const image = ref(null)
const croppedImage = ref('')

// Состояние кропа (упрощенное - без поворотов и отражений)
const cropState = reactive({
  isDrawing: false,
  isDragging: false,
  isResizing: false,
  isHovering: false,
  resizeHandle: null,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  dragStartX: 0,
  dragStartY: 0,
  dragOffsetX: 0,
  dragOffsetY: 0
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
  // Проверка размера файла (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('Файл слишком большой. Максимальный размер: 10MB')
    return
  }

  console.log('📁 Загружаем изображение профиля:', file.name)
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      console.log('✅ Изображение загружено:', img.width + 'x' + img.height)
      image.value = img
      setupCanvas()
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const setupCanvas = async () => {
  await nextTick()
  
  if (!canvas.value || !image.value) return
  
  const img = image.value
  
  // Рассчитываем размеры для отображения (максимум 400x400 для профиля)
  const maxSize = 400
  
  let displayWidth = img.width
  let displayHeight = img.height
  
  // Масштабируем если изображение слишком большое
  if (img.width > maxSize || img.height > maxSize) {
    const ratio = Math.min(maxSize / img.width, maxSize / img.height)
    displayWidth = img.width * ratio
    displayHeight = img.height * ratio
  }
  
  canvas.value.width = displayWidth
  canvas.value.height = displayHeight
  
  // Сразу создаем квадратную область выделения по центру
  const squareSize = Math.min(displayWidth, displayHeight) * 0.7 // 70% от меньшей стороны
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
  
  // Рисуем изображение (без трансформаций)
  ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
  
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
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.strokeRect(x, y, width, height)
  ctx.setLineDash([])
  
  // Рисуем интерактивные точки изменения размера в углах
  const handleSize = 16
  const handleBorder = 2
  
  // Координаты углов
  const corners = [
    { x: x, y: y, handle: 'nw' },
    { x: x + width, y: y, handle: 'ne' },
    { x: x, y: y + height, handle: 'sw' },
    { x: x + width, y: y + height, handle: 'se' }
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
    
    // Синяя граница точки
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = handleBorder
    ctx.setLineDash([])
    ctx.strokeRect(
      corner.x - handleSize / 2, 
      corner.y - handleSize / 2, 
      handleSize, 
      handleSize
    )
  })
}

// Копируем логику взаимодействия из CanvasCropper (упрощенную)
const getEventPos = (event) => {
  const rect = canvas.value.getBoundingClientRect()
  const clientX = event.clientX || (event.touches && event.touches[0].clientX)
  const clientY = event.clientY || (event.touches && event.touches[0].clientY)
  
  // Вычисляем соотношение между CSS размером и внутренним размером canvas
  const scaleX = canvas.value.width / rect.width
  const scaleY = canvas.value.height / rect.height
  
  const pos = {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  }
  

  
  return pos
}

const getResizeHandle = (pos) => {
  if (!hasCropArea.value) return null
  
  const x = Math.min(cropState.startX, cropState.endX)
  const y = Math.min(cropState.startY, cropState.endY)
  const width = Math.abs(cropState.endX - cropState.startX)
  const height = Math.abs(cropState.endY - cropState.startY)
  
  const handleSize = 16
  const tolerance = 12 // Стандартная зона для углов
  
  const corners = [
    { x: x, y: y, handle: 'nw' },
    { x: x + width, y: y, handle: 'ne' },
    { x: x, y: y + height, handle: 'sw' },
    { x: x + width, y: y + height, handle: 'se' }
  ]
  
  for (const corner of corners) {
    const isInside = pos.x >= corner.x - tolerance && pos.x <= corner.x + tolerance &&
                     pos.y >= corner.y - tolerance && pos.y <= corner.y + tolerance
    
    if (isInside) {
      return corner.handle
    }
  }
  
  return null
}

const onMouseMove = (event) => {
  const pos = getEventPos(event)
  
  // Если мы в процессе операции, сразу обрабатываем
  if (cropState.isDrawing || cropState.isDragging || cropState.isResizing) {
    doCrop(event)
    return
  }
  
  // Проверяем, находится ли курсор над точкой изменения размера
  const resizeHandle = getResizeHandle(pos)
  
  if (resizeHandle) {
    // Над точкой изменения размера - устанавливаем соответствующий курсор
    const cursors = {
      'nw': 'nw-resize',
      'ne': 'ne-resize', 
      'sw': 'sw-resize',
      'se': 'se-resize'
    }
    canvas.value.style.cursor = cursors[resizeHandle] || 'nw-resize'
    cropState.isHovering = false
  } else if (hasCropArea.value) {
    // Проверяем, находится ли курсор над областью выделения
    const x = Math.min(cropState.startX, cropState.endX)
    const y = Math.min(cropState.startY, cropState.endY)
    const width = Math.abs(cropState.endX - cropState.startX)
    const height = Math.abs(cropState.endY - cropState.startY)
    
    const isInsideCropArea = pos.x >= x && pos.x <= x + width && 
                            pos.y >= y && pos.y <= y + height
    
    cropState.isHovering = isInsideCropArea
    
    // Устанавливаем курсор в зависимости от области
    if (isInsideCropArea) {
      canvas.value.style.cursor = 'grab'
    } else {
      canvas.value.style.cursor = 'crosshair'
    }
  } else {
    cropState.isHovering = false
    canvas.value.style.cursor = 'crosshair'
  }
}

const startCrop = (event) => {
  event.preventDefault()
  const pos = getEventPos(event)
  
  // Сначала проверяем, кликнули ли на точку изменения размера
  const resizeHandle = getResizeHandle(pos)
  
  if (resizeHandle) {
    cropState.isResizing = true
    cropState.resizeHandle = resizeHandle
    cropState.dragStartX = pos.x
    cropState.dragStartY = pos.y
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
  } else {
    // Начинаем создание новой области
    cropState.isDrawing = true
    cropState.startX = pos.x
    cropState.startY = pos.y
    cropState.endX = pos.x
    cropState.endY = pos.y
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
    
    // Вычисляем минимальный размер в пикселях отображения (200px в оригинальном изображении)
    const originalMinSize = 200 // Минимальный размер в пикселях оригинального изображения
    const scaleRatio = Math.min(canvas.value.width / image.value.width, canvas.value.height / image.value.height)
    const minSize = Math.max(30, originalMinSize * scaleRatio) // Минимум 30px для удобства, но обычно больше
    
    let newStartX = currentX
    let newStartY = currentY
    let newEndX = currentX + currentWidth
    let newEndY = currentY + currentHeight
    
    switch (cropState.resizeHandle) {
      case 'nw':
        {
          const distanceToOpposite = Math.min(
            Math.abs(newEndX - pos.x), 
            Math.abs(newEndY - pos.y)
          )
          const finalSize = Math.max(distanceToOpposite, minSize)
          newStartX = newEndX - finalSize
          newStartY = newEndY - finalSize
        }
        break
        
      case 'ne':
        {
          const distanceToOpposite = Math.min(
            Math.abs(pos.x - newStartX), 
            Math.abs(newEndY - pos.y)
          )
          const finalSize = Math.max(distanceToOpposite, minSize)
          newEndX = newStartX + finalSize
          newStartY = newEndY - finalSize
        }
        break
        
      case 'sw':
        {
          const distanceToOpposite = Math.min(
            Math.abs(newEndX - pos.x), 
            Math.abs(pos.y - newStartY)
          )
          const finalSize = Math.max(distanceToOpposite, minSize)
          newStartX = newEndX - finalSize
          newEndY = newStartY + finalSize
        }
        break
        
      case 'se':
        {
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
  
  // Проверяем минимальный размер области после создания новой области
  if (cropState.isDrawing) {
    const width = Math.abs(cropState.endX - cropState.startX)
    const height = Math.abs(cropState.endY - cropState.startY)
    
    // Вычисляем минимальный размер в пикселях отображения (200px в оригинальном изображении)
    const originalMinSize = 200
    const scaleRatio = Math.min(canvas.value.width / image.value.width, canvas.value.height / image.value.height)
    const minSize = Math.max(30, originalMinSize * scaleRatio)
    
    // Если область слишком маленькая, создаем область минимального размера по центру
    if (width < minSize || height < minSize) {
      const centerX = (cropState.startX + cropState.endX) / 2
      const centerY = (cropState.startY + cropState.endY) / 2
      
      cropState.startX = centerX - minSize / 2
      cropState.startY = centerY - minSize / 2
      cropState.endX = centerX + minSize / 2
      cropState.endY = centerY + minSize / 2
      
      // Убеждаемся что область в границах canvas
      if (cropState.startX < 0) {
        cropState.endX -= cropState.startX
        cropState.startX = 0
      }
      if (cropState.startY < 0) {
        cropState.endY -= cropState.startY
        cropState.startY = 0
      }
      if (cropState.endX > canvas.value.width) {
        cropState.startX -= (cropState.endX - canvas.value.width)
        cropState.endX = canvas.value.width
      }
      if (cropState.endY > canvas.value.height) {
        cropState.startY -= (cropState.endY - canvas.value.height)
        cropState.endY = canvas.value.height
      }
      
      drawImage() // Перерисовываем с новой областью
    }
  }
  
  cropState.isDrawing = false
  cropState.isDragging = false
  cropState.isResizing = false
  cropState.resizeHandle = null
  
  // Сбрасываем курсор после окончания операции
  if (canvas.value) {
    canvas.value.style.cursor = 'crosshair'
  }
}

const cropImage = () => {
  if (!hasCropArea.value) {
    alert('Сначала выберите область для обрезки')
    return
  }

  const x = Math.min(cropState.startX, cropState.endX)
  const y = Math.min(cropState.startY, cropState.endY)
  const width = Math.abs(cropState.endX - cropState.startX)
  const height = Math.abs(cropState.endY - cropState.startY)

  // Размер итогового canvas — всегда 400x400
  const outputSize = 400
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = outputSize
  tempCanvas.height = outputSize

  // Рисуем выделенную область с масштабированием в 400x400
  const sourceCanvas = document.createElement('canvas')
  const sourceCtx = sourceCanvas.getContext('2d')
  sourceCanvas.width = canvas.value.width
  sourceCanvas.height = canvas.value.height
  sourceCtx.drawImage(image.value, 0, 0, sourceCanvas.width, sourceCanvas.height)

  // Обрезаем квадратную область из центра выделения
  const squareSize = Math.min(width, height)
  const centerCropX = x + width / 2 - squareSize / 2
  const centerCropY = y + height / 2 - squareSize / 2

  tempCtx.drawImage(
    sourceCanvas,
    centerCropX, centerCropY, squareSize, squareSize,
    0, 0, outputSize, outputSize // <--- Масштабируем в 400x400
  )

  croppedImage.value = tempCanvas.toDataURL('image/jpeg', 0.9)
}

const newCrop = () => {
  croppedImage.value = ''
}

const saveImage = () => {
  if (!croppedImage.value) return
  
  // Передаем обрезанное изображение родительскому компоненту
  emit('image-cropped', croppedImage.value)
  console.log('✅ Фото профиля сохранено')
}

const cancelCrop = () => {
  image.value = null
  croppedImage.value = ''
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  emit('cancel')
  console.log('❌ Редактирование фото отменено')
}
</script>

<style scoped>
.profile-image-cropper {
  font-family: 'Inter', system-ui, sans-serif;
}

.canvas-container {
  min-height: 200px;
  max-height: 400px;
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
  max-height: 350px;
}

.cursor-nw-resize {
  cursor: nw-resize;
}
</style> 