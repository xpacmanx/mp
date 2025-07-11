# Руководство по использованию редактора изображений

## Обзор

Реализован полнофункциональный редактор изображений с возможностью загрузки, кадрирования и превью фотографий пользователей. Решение состоит из нескольких компонентов:

1. **ImageCropper.vue** - Основной компонент для кадрирования
2. **UserForm.vue** - Обновленная форма пользователя с поддержкой загрузки фото
3. **imageUpload.js** - Утилиты для работы с изображениями
4. **BACKEND_INTEGRATION.md** - Документация по интеграции с Django

## Возможности

### ✅ Загрузка изображений
- Поддержка форматов: JPEG, PNG, GIF, WEBP
- Валидация размера файла (до 10MB)
- Автоматическое сжатие больших файлов

### ✅ Редактирование
- Кадрирование в квадратном формате
- Поворот изображения влево/вправо
- Сброс изменений
- Перемещение и масштабирование области кадрирования

### ✅ Превью
- Большое квадратное превью (400x400px) для досье
- Маленький круглый аватар (80x80px) для профиля
- Показ размеров превью

### ✅ Интеграция с формой
- Модальное окно для редактирования
- Предварительный просмотр текущего фото
- Возможность изменения загруженного фото

## Использование

### 1. Прямое использование ImageCropper

```vue
<template>
  <ImageCropper 
    @photo-selected="onPhotoSelected"
    @photo-saved="onPhotoSaved"
  />
</template>

<script setup>
import ImageCropper from './components/ImageCropper.vue'

const onPhotoSelected = (photoData) => {
  // photoData содержит: { blob, file, url }
  console.log('Фото выбрано:', photoData)
}

const onPhotoSaved = (photoUrl) => {
  console.log('Фото сохранено:', photoUrl)
}
</script>
```

### 2. Использование в UserForm

```vue
<template>
  <UserForm 
    :user="user"
    :is-edit="false"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup>
import UserForm from './components/UserForm.vue'

const handleSubmit = (formData) => {
  // formData - это FormData объект готовый для отправки
  // Содержит поле 'photo' с файлом если загружено изображение
  
  fetch('/api/users/', {
    method: 'POST',
    body: formData
  })
}
</script>
```

### 3. Использование утилит

```javascript
import { 
  validateImageFile, 
  compressImage, 
  createImagePreviews 
} from './tools/imageUpload.js'

// Валидация файла
const validation = validateImageFile(file)
if (!validation.isValid) {
  console.error(validation.errors)
}

// Сжатие изображения
const compressedBlob = await compressImage(file, 800, 600, 0.8)

// Создание превью разных размеров
const previews = await createImagePreviews(file, [
  { width: 400, height: 400, quality: 0.8, name: 'large' },
  { width: 80, height: 80, quality: 0.7, name: 'small' }
])
```

## Демо

Для тестирования функциональности:

1. Запустите проект: `npm run dev`
2. Перейдите по адресу: `http://localhost:5173/image-demo`
3. Протестируйте загрузку и кадрирование изображений

## События и данные

### ImageCropper События

#### @photo-selected
Вызывается при кадрировании изображения
```javascript
{
  blob: Blob,      // Файл-объект кадрированного изображения
  file: File,      // File объект для отправки на сервер
  url: string      // URL для отображения превью
}
```

#### @photo-saved
Вызывается при сохранении кадрированного изображения
```javascript
photoUrl: string  // URL сохраненного изображения
```

### UserForm События

#### @submit
Отправляет FormData объект с данными формы:
- Все поля формы как строки
- Поле 'photo' как File объект (если загружено)

#### @cancel
Вызывается при отмене формы

## Интеграция с бекендом

См. файл `BACKEND_INTEGRATION.md` для:
- Настройки Django моделей
- Конфигурации API endpoints
- Автоматического создания превью на сервере
- Валидации изображений

## Кастомизация

### Размеры превью

Измените размеры в `ImageCropper.vue`:

```vue
<!-- Большое превью -->
<div class="w-40 h-40"> <!-- Измените w-40 h-40 -->

<!-- Маленькое превью -->
<div class="w-20 h-20"> <!-- Измените w-20 h-20 -->
```

### Настройки кадрирования

В `ImageCropper.vue` компонент `VueCropper`:

```vue
<VueCropper
  :auto-crop-width="0.8"    <!-- Размер области кадрирования -->
  :auto-crop-height="0.8"   <!-- Размер области кадрирования -->
  :fixed="true"             <!-- Фиксированные пропорции -->
  :fixed-number="[1, 1]"    <!-- Соотношение сторон -->
  :output-size="1"          <!-- Качество вывода -->
  :enlarge="1"              <!-- Масштабирование -->
/>
```

### Валидация файлов

В `imageUpload.js` функция `validateImageFile`:

```javascript
const options = {
  maxSize: 10 * 1024 * 1024,  // Максимальный размер
  allowedTypes: ['image/jpeg', 'image/png'], // Разрешенные типы
  minWidth: 100,              // Минимальная ширина
  minHeight: 100              // Минимальная высота
}
```

## Поддерживаемые браузеры

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Зависимости

- **vue-cropper@next**: Основной компонент кадрирования (версия для Vue 3)
- **Vue 3**: Composition API
- **Tailwind CSS**: Стилизация

## Решение проблем

### Ошибка импорта vue-cropper
```bash
# Для Vue 3 используйте версию @next
npm install vue-cropper@next
```

### Большие файлы
Файлы > 2MB автоматически сжимаются до 1200x1200px

### Неподдерживаемые форматы
Проверьте `validateImageFile` - поддерживаются JPEG, PNG, GIF, WEBP

### Проблемы с CORS
Настройте `django-cors-headers` на бекенде (см. BACKEND_INTEGRATION.md) 