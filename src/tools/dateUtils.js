/**
 * Утилиты для работы с датами
 */

/**
 * Форматирует дату в ISO формат (YYYY-MM-DD) для отправки на бэкенд
 * @param {string|Date} date - Дата в любом формате
 * @returns {string} Дата в формате YYYY-MM-DD
 */
export function formatDateToISO(date) {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    return dateObj.toISOString().split('T')[0]
  } catch (error) {
    console.error('Ошибка форматирования даты:', error)
    return ''
  }
}

/**
 * Проверяет, является ли дата валидной
 * @param {string|Date} date - Дата для проверки
 * @returns {boolean} true если дата валидна
 */
export function isValidDate(date) {
  if (!date) return false
  
  try {
    const dateObj = new Date(date)
    return !isNaN(dateObj.getTime())
  } catch (error) {
    return false
  }
}

/**
 * Форматирует дату для отображения в соответствии с локалью пользователя
 * @param {string|Date} date - Дата в ISO формате
 * @param {string} locale - Локаль (по умолчанию 'ru-RU')
 * @returns {string} Отформатированная дата
 */
export function formatDateForDisplay(date, locale = 'ru-RU') {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString(locale)
  } catch (error) {
    console.error('Ошибка форматирования даты для отображения:', error)
    return ''
  }
} 