// Утилиты для работы с загрузкой изображений

/**
 * Загружает изображение на сервер
 * @param {File} file - Файл изображения
 * @param {string} userId - ID пользователя (опционально)
 * @returns {Promise<{url: string, id: string}>} - URL загруженного изображения
 */
export async function uploadImage(file, userId = null) {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    if (userId) {
      formData.append('user_id', userId)
    }

    const response = await fetch('/api/upload-image/', {
      method: 'POST',
      body: formData,
      headers: {
        // Не добавляем Content-Type, браузер сам установит для FormData
        'Authorization': `Bearer ${localStorage.getItem('token')}` // если используете токены
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error)
    throw error
  }
}

/**
 * Удаляет изображение с сервера
 * @param {string} imageId - ID изображения для удаления
 * @returns {Promise<boolean>} - Успешность операции
 */
export async function deleteImage(imageId) {
  try {
    const response = await fetch(`/api/delete-image/${imageId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    return response.ok
  } catch (error) {
    console.error('Ошибка удаления изображения:', error)
    throw error
  }
}

/**
 * Создает превью изображения разных размеров
 * @param {File} file - Оригинальный файл
 * @param {Array} sizes - Массив размеров [{width: 400, height: 400, quality: 0.8}]
 * @returns {Promise<Array>} - Массив превью
 */
export function createImagePreviews(file, sizes = [
  { width: 400, height: 400, quality: 0.8, name: 'large' },
  { width: 80, height: 80, quality: 0.7, name: 'small' }
]) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    img.onload = () => {
      const previews = sizes.map(size => {
        canvas.width = size.width
        canvas.height = size.height
        
        // Вычисляем размеры для центрированного кадрирования
        const sourceSize = Math.min(img.width, img.height)
        const sourceX = (img.width - sourceSize) / 2
        const sourceY = (img.height - sourceSize) / 2
        
        // Рисуем изображение с масштабированием и центрированием
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceSize, sourceSize,
          0, 0, size.width, size.height
        )
        
        return new Promise(resolve => {
          canvas.toBlob(resolve, 'image/jpeg', size.quality)
        }).then(blob => ({
          blob,
          url: URL.createObjectURL(blob),
          name: size.name,
          width: size.width,
          height: size.height
        }))
      })
      
      Promise.all(previews).then(resolve).catch(reject)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Валидирует файл изображения
 * @param {File} file - Файл для валидации
 * @param {Object} options - Опции валидации
 * @returns {Object} - Результат валидации
 */
export function validateImageFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB по умолчанию
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    minWidth = 100,
    minHeight = 100
  } = options

  const errors = []

  // Проверка типа файла
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`)
  }

  // Проверка размера файла
  if (file.size > maxSize) {
    errors.push(`Файл слишком большой. Максимальный размер: ${Math.round(maxSize / 1024 / 1024)}MB`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Сжимает изображение до заданного размера
 * @param {File} file - Оригинальный файл
 * @param {number} maxWidth - Максимальная ширина
 * @param {number} maxHeight - Максимальная высота  
 * @param {number} quality - Качество сжатия (0-1)
 * @returns {Promise<Blob>} - Сжатое изображение
 */
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    img.onload = () => {
      // Вычисляем новые размеры с сохранением пропорций
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Рисуем сжатое изображение
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
} 