# Интеграция упрощенного кроппера фото профиля

## Обзор

Создан упрощенный компонент `ProfileImageCropper.vue` специально для редактирования фото профиля пользователей. Убраны все дополнительные кнопки (поворот, отражение, сброс) для упрощения интерфейса.

## Созданные файлы

### `src/components/ProfileImageCropper.vue`
- **Назначение**: Упрощенный кроппер только для редактирования фото профиля
- **Размер**: ~20KB, 622 строки
- **Особенности**:
  - Убраны кнопки поворота, отражения и сброса
  - Автоматическое создание квадратной области выделения по центру
  - Два превью: круглое для профиля (80px) и квадратное для досье (128px)
  - Drag & Drop интерфейс для загрузки файлов
  - Валидация размера файла (до 10MB)
  - Вывод результата в формате DataURL

### `src/views/ProfileImageTest.vue`
- **Назначение**: Тестовая страница для демонстрации ProfileImageCropper
- **Маршрут**: `/profile-image-test`
- **Особенности**:
  - Демонстрация всех возможностей компонента
  - Показ размера результирующего изображения
  - Навигация между различными кропперами

## Обновленные файлы

### `src/components/UserForm.vue`
**Изменения**:
- Заменен импорт с `ImageCropper` на `ProfileImageCropper`
- Обновлены события: `@photo-cropped` и `@photo-cancelled`
- Добавлена логика конвертации DataURL в File объект для отправки на сервер
- Убрана неиспользуемая переменная `pendingPhotoData`

**Ключевые методы**:
```javascript
const onPhotoCropped = (croppedImageDataUrl) => {
  // Конвертируем DataURL в Blob для отправки на сервер
  fetch(croppedImageDataUrl)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], `profile_photo_${Date.now()}.jpg`, { 
        type: 'image/jpeg'
      })
      form.photo_url = croppedImageDataUrl
      form.photo_file = file
    })
  
  showImageCropper.value = false
}
```

### `src/views/ImageCropperDemo.vue`
**Изменения**:
- Добавлена карточка для ProfileImageCropper
- Разделены два кроппера на отдельные карточки
- Добавлены ссылки для навигации между кропперами

### `src/router/index.js`
**Изменения**:
- Добавлен маршрут `/profile-image-test` для тестирования

## Интеграция с бэкендом

Компонент готов для интеграции с Django backend. UserForm теперь создает File объект из обрезанного изображения, который можно отправить через FormData:

```javascript
// В родительском компоненте
async function handleUserSubmit(formData) {
  // formData уже содержит поле 'photo' с File объектом
  const response = await fetch('/api/users/', {
    method: 'POST',
    body: formData
  })
}
```

## API компонента ProfileImageCropper

### Events (события)
- **`@photo-cropped`**: Срабатывает когда пользователь обрезает изображение
  - Параметр: `croppedImageDataUrl` (string) - DataURL обрезанного изображения
  
- **`@photo-cancelled`**: Срабатывает когда пользователь отменяет редактирование

### Особенности
- Только квадратное кадрирование (1:1)
- Максимальный размер отображения: 400x400px
- Поддержка touch-событий для мобильных устройств
- Валидация файлов: JPG, PNG до 10MB
- Автоматическое создание области выделения

## Использование

### В форме пользователя (уже интегрировано)
```vue
<ProfileImageCropper 
  @photo-cropped="onPhotoCropped"
  @photo-cancelled="onPhotoCancelled"
/>
```

### Самостоятельно
```vue
<template>
  <ProfileImageCropper 
    @photo-cropped="handlePhotoCropped"
    @photo-cancelled="handlePhotoCancelled"
  />
</template>

<script setup>
import ProfileImageCropper from './components/ProfileImageCropper.vue'

const handlePhotoCropped = (dataUrl) => {
  console.log('Изображение готово:', dataUrl)
  // Конвертация в File если нужно
}

const handlePhotoCancelled = () => {
  console.log('Редактирование отменено')
}
</script>
```

## Тестирование

1. Запустите проект: `npm run dev`
2. Перейдите на `/profile-image-test` для тестирования кроппера
3. Перейдите на `/users` для тестирования в форме пользователя
4. Перейдите на `/image-demo` для сравнения всех кропперов

## Сравнение с полным кроппером

| Функция | CanvasCropper | ProfileImageCropper |
|---------|---------------|-------------------|
| Кадрирование | ✅ | ✅ |
| Поворот | ✅ | ❌ |
| Отражение | ✅ | ❌ |
| Сброс | ✅ | ❌ |
| Интерфейс | Полный | Упрощенный |
| Использование | Универсальный | Только профиль |
| Размер кода | ~28KB | ~20KB |

ProfileImageCropper идеально подходит для быстрого и простого редактирования фото профиля пользователей без лишних кнопок и сложности. 