# Заметки по настройке проекта

## Проблема с vue-cropper

### Проблема
При первоначальной установке `vue-cropper` возникала ошибка:
```
Failed to resolve import "vue-cropper/dist/index.css" from "src/components/ImageCropper.vue"
```

### Причина
Была установлена версия `vue-cropper` для Vue 2, которая не совместима с Vue 3.

### Решение
1. Удалить старую версию:
```bash
npm uninstall vue-cropper
```

2. Установить версию для Vue 3:
```bash
npm install vue-cropper@next
```

3. Использовать правильный импорт:
```javascript
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
```

### Важно
- Для Vue 3 всегда использовать `vue-cropper@next`
- Для Vue 2 использовать `vue-cropper`

## Структура проекта

### Новые файлы
- `src/components/ImageCropper.vue` - Компонент редактора изображений
- `src/tools/imageUpload.js` - Утилиты для работы с изображениями
- `src/views/ImageCropperDemo.vue` - Демо страница
- `BACKEND_INTEGRATION.md` - Документация по интеграции с Django
- `IMAGE_CROPPER_GUIDE.md` - Руководство по использованию

### Измененные файлы
- `src/components/UserForm.vue` - Добавлена поддержка загрузки фото
- `src/router/index.js` - Добавлен маршрут для демо страницы

## Проверка работоспособности

1. Запустить проект:
```bash
npm run dev
```

2. Открыть демо страницу:
```
http://localhost:5173/image-demo
```

3. Протестировать:
   - Загрузку изображения
   - Кадрирование
   - Поворот
   - Превью

## Возможные проблемы

### CSS не загружается
Убедитесь, что установлена версия `vue-cropper@next` и импорт:
```javascript
import 'vue-cropper/dist/index.css'
```

### Компонент не найден
Проверьте импорт компонента:
```javascript
import { VueCropper } from 'vue-cropper'
```

### Ошибки TypeScript
Если используете TypeScript, может потребоваться добавить типы или объявления. 