<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Колонка 1 -->
        <div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Имя</label>
            <input v-model="form.first_name" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Фамилия</label>
            <input v-model="form.last_name" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">День рождения</label>
            <input v-model="form.birthdate" type="date" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Email</label>
            <input v-model="form.email" type="email" class="input" required />
          </div>
        </div>
        <!-- Колонка 2 -->
        <div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Телеграм ник</label>
            <input v-model="form.telegram_nick" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Telegram ID</label>
            <input v-model="form.telegram_id" class="input" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Фото (URL)</label>
            <input v-model="form.photo_url" class="input" />
          </div>
        </div>
        <!-- Колонка 3 -->
        <div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Логин</label>
            <input v-model="form.username" :disabled="isEdit" class="input" required />
          </div>
          <div class="mb-4" v-if="form.role !== undefined">
            <label class="block mb-1 font-medium">Роль</label>
            <select v-model="form.role" class="input">
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label class="block mb-1 font-medium">Пароль</label>
            <input v-model="form.password" type="password" class="input" required />
          </div>
          <div v-if="!isEdit" class="mb-4">
            <label class="block mb-1 font-medium">Повторите пароль</label>
            <input v-model="form.password2" type="password" class="input" required />
          </div>
        </div>
      </div>
      <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
      <div class="flex justify-end space-x-2 mt-4">
        <button type="button" class="btn" @click="$emit('cancel')">Отмена</button>
        <button type="submit" class="btn bg-lime-500 text-white">Сохранить</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch, ref } from 'vue'

const props = defineProps({
  user: { type: Object, default: null },
  isEdit: { type: Boolean, default: false }
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  role: 'user',
  birthdate: '',
  password: '',
  password2: '',
  telegram_nick: '',
  telegram_id: '',
  photo_url: ''
})
const error = ref('')

watch(() => props.user, (val) => {
  if (val) {
    form.username = val.username || ''
    form.email = val.email || ''
    form.first_name = val.first_name || ''
    form.last_name = val.last_name || ''
    form.role = val.role || 'user'
    form.birthdate = val.birthdate || ''
    form.password = ''
    form.password2 = ''
    form.telegram_nick = val.telegram_nick || ''
    form.telegram_id = val.telegram_id || ''
    form.photo_url = val.photo_url || ''
  } else {
    form.username = ''
    form.email = ''
    form.first_name = ''
    form.last_name = ''
    form.role = 'user'
    form.birthdate = ''
    form.password = ''
    form.password2 = ''
    form.telegram_nick = ''
    form.telegram_id = ''
    form.photo_url = ''
  }
}, { immediate: true })

function onSubmit() {
  error.value = ''
  if (!props.isEdit && form.password !== form.password2) {
    error.value = 'Пароли не совпадают'
    return
  }
  // Валидация обязательных полей
  if (!form.username || !form.email || (!props.isEdit && !form.password)) {
    error.value = 'Заполните все обязательные поля'
    return
  }
  emit('submit', { ...form })
}
</script>

<style scoped>
.input {
  @apply w-full border rounded px-3 py-2 mb-1;
}
.btn {
  @apply rounded px-4 py-2 font-bold hover:bg-lime-600 bg-gray-200;
}
form {
  min-width: 700px;
}
</style> 