# Руководство по Onboarding

## Описание

Система onboarding для новых пользователей TLQ. Показывается автоматически при первом входе пользователя в систему.

## Логика работы

### Определение новых пользователей
- **Новый пользователь**: Дата рождения НЕ заполнена
- **Существующий пользователь**: Дата рождения заполнена

### Автоматический показ
Onboarding показывается автоматически если:
1. Пользователь авторизован
2. Дата рождения не заполнена

### Завершение onboarding
Onboarding автоматически скрывается когда:
1. Пользователь заполнил дату рождения на шаге 2
2. Или дата рождения уже была заполнена ранее
3. Система проверяет заполненность даты рождения при каждом входе

## Шаги Onboarding

### Шаг 1: Смена пароля
- **Цель**: Повысить безопасность аккаунта
- **Поля**: Текущий пароль, новый пароль, подтверждение пароля
- **Валидация**: Минимум 6 символов, пароли должны совпадать
- **API**: `POST /api/change-password/`
- **Пропуск**: Возможен

### Шаг 2: Личная информация
- **Цель**: Персонализация профиля
- **Поля**: Имя, фамилия, дата рождения
- **Валидация**: Все поля обязательны
- **API**: `PATCH /users/{id}/`
- **Пропуск**: Невозможен (обязательный шаг)

### Шаг 3: Фото профиля
- **Цель**: Персонализация профиля
- **Функции**: Загрузка, кроп изображения
- **Компонент**: ProfileImageCropper
- **API**: `PATCH /users/{id}/` (multipart/form-data)
- **Пропуск**: Возможен

### Шаг 4: Завершение
- **Цель**: Приветствие и описание возможностей
- **Содержание**: Описание функций TLQ
- **Действие**: Помечание onboarding как завершенного

## Тестирование

### Тестовая страница
Доступна по адресу: `/onboarding-test`

Функции:
- Просмотр статуса onboarding
- Проверка данных пользователя
- Сброс onboarding
- Принудительный показ onboarding

### Сброс onboarding
```javascript
// В консоли браузера - очистить дату рождения
const userData = JSON.parse(localStorage.getItem('userData') || '{}')
userData.birthDate = ''
userData.birthdate = ''
localStorage.setItem('userData', JSON.stringify(userData))
window.location.reload()
```

### Проверка статуса
```javascript
// Проверка данных пользователя
const userData = JSON.parse(localStorage.getItem('userData') || '{}')
const hasBirthDate = userData.birthDate && userData.birthDate.trim() !== ''

// Onboarding нужен если дата рождения не заполнена
const needsOnboarding = !hasBirthDate
```

## Компоненты

### OnboardingModal.vue
Основной компонент модального окна с 4 шагами.

**Props:**
- `show: Boolean` - Показывать ли модальное окно

**Events:**
- `complete` - Вызывается при завершении onboarding

### OnboardingManager.vue
Компонент для управления логикой показа onboarding.

**Функции:**
- Проверка необходимости показа onboarding
- Автоматический показ при необходимости
- Сброс onboarding (только в development)

## API Endpoints

### Смена пароля
```
POST /api/change-password/
{
  "old_password": "string",
  "new_password": "string"
}
```

### Обновление данных пользователя
```
PATCH /users/{id}/
{
  "first_name": "string",
  "last_name": "string", 
  "birthdate": "YYYY-MM-DD"
}
```

**Примечание:** Дата автоматически конвертируется в ISO формат (YYYY-MM-DD) перед отправкой на сервер, независимо от локали пользователя.

### Загрузка фото
```
PATCH /users/{id}/
Content-Type: multipart/form-data
{
  "photo": File
}
```

### Получение данных пользователя
```
GET /users/me/
```

## Интеграция

### В App.vue
```vue
<template>
  <OnboardingManager />
</template>

<script>
import OnboardingManager from '@/components/OnboardingManager.vue'

export default {
  components: {
    OnboardingManager
  }
}
</script>
```

### В userState.js
Onboarding интегрирован с существующей системой управления состоянием пользователя.

## Настройка

### Отключение onboarding
```javascript
// В OnboardingManager.vue
const checkOnboardingNeeded = async () => {
  // Добавить проверку настроек
  const onboardingEnabled = await getOnboardingSettings()
  if (!onboardingEnabled) return false
  
  // ... остальная логика
}
```

### Кастомизация шагов
```javascript
// В OnboardingModal.vue
const steps = [
  { id: 1, title: 'Пароль', required: false },
  { id: 2, title: 'Данные', required: true },
  { id: 3, title: 'Фото', required: false },
  { id: 4, title: 'Завершение', required: true }
]
```

## Отладка

### Логи в консоли
- `Пользователь уже заполнил дату рождения, onboarding не нужен`
- `Пользователь не заполнил дату рождения, показываем onboarding`
- `Onboarding завершен - дата рождения заполнена`

### Проверка localStorage
```javascript
// Проверка данных пользователя
const userData = JSON.parse(localStorage.getItem('userData') || '{}')
console.log('Дата рождения:', userData.birthDate || userData.birthdate)
```

## Возможные проблемы

### Onboarding не показывается
1. Проверить авторизацию пользователя
2. Проверить наличие ID пользователя
3. Проверить заполненность даты рождения

### Ошибки API
1. Проверить доступность endpoints
2. Проверить права доступа
3. Проверить формат данных

### Проблемы с датой
1. Проверить валидность введенной даты
2. Проверить конвертацию в ISO формат
3. Проверить логи в консоли браузера

### Проблемы с фото
1. Проверить размер файла
2. Проверить формат изображения
3. Проверить права на запись 