<template>
  <Header />
  <div class="bg-slate-950">
    <div class="container mx-auto py-8">
      <h1 class="text-2xl font-bold mb-6 text-yellow-300">Пользователи</h1>
      <div class="flex justify-end mb-4">
        <button class="bg-yellow-300 hover:bg-yellow-200 font-bold py-2 px-4" @click="openAddUserModal">
          Добавить пользователя
        </button>
      </div>
      <div v-if="loading" class="text-center py-8">Загрузка...</div>
      <div v-else>
        <div v-for="(group, role) in groupedUsers" :key="role" class="mb-10">
          <h2 class="text-yellow-300 text-xl font-bold mb-4">{{ groupTitle(role) }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="user in group" :key="user.id" class="relative p-0 flex flex-col border border-teal-300 text-teal-300 transition-all duration-300 ease-out hover:scale-105">

              <img v-if="user.photo" :src="user.photo || placeholderUrl" alt="Фото" class="w-full object-cover object-center" />
              <div v-else class="w-full h-48 bg-teal-300 flex items-center justify-center">
                <img :src="placeholderUrl" class="w-1/3 object-cover object-center opacity-70" />
              </div>

              <div class="flex-1 flex flex-col">
                <div class="bg-yellow-300 text-slate-950 uppercase font-bold text-lg px-4 w-full">{{ formatFullName(user.first_name, user.last_name) }}</div>
                <div class="p-4">
                  <div class="text-sm mb-2" v-if="user.telegram_nick">
                    <span class="font-bold uppercase">Telegram</span><br />
                    <a v-if="user.telegram_nick" :href="`https://t.me/${user.telegram_nick.replace(/^@/, '')}`" target="_blank" class="hover:underline">@{{ user.telegram_nick.replace(/^@/, '') }}</a>
                    <span v-else class="text-gray-400">—</span>
                  </div>
                  <div class="text-sm mb-2" v-if="user.birthdate">
                    <span class="font-bold uppercase">День рождения</span><br/>
                    <span>
                      {{ formatBirthday(user.birthdate) }}
                      <span v-if="user.birthdate"> ({{ getAge(user.birthdate) }})</span>
                    </span>
                  </div>
                  <div class="text-sm mb-2">
                    <span class="font-bold uppercase">Email</span><br/>
                    {{ user.email }}
                  </div>
                </div>
              </div>
              <div class="absolute top-2 right-2 flex flex-col items-end gap-2">
                <button class="icon-btn" @click="openEditUserModal(user)" title="Редактировать">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z" /></svg>
                </button>
                <button class="icon-btn" @click="deleteUser(user)" title="Удалить">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!Object.keys(groupedUsers).length" class="text-center text-gray-500 py-8">Нет пользователей</div>
      </div>
      <!-- Модальные окна -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="text-xl font-bold mb-4">Добавить пользователя</h2>
          <UserForm @submit="handleAddUser" @cancel="closeAddUserModal" />
        </div>
      </div>
      <div v-if="showEditModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="text-xl font-bold mb-4">Редактировать пользователя</h2>
          <UserForm :user="editUserData" :isEdit="true" @submit="handleEditUser" @cancel="closeEditUserModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import mpr from '@/tools/mpr'
import Header from '@/components/navigation/Header.vue'
import UserForm from '@/components/UserForm.vue'

const users = ref([])
const loading = ref(true)
const placeholderUrl = '/src/assets/placeholder.png'

const showAddModal = ref(false)
const showEditModal = ref(false)
const editUserData = ref(null)

function openAddUserModal() { showAddModal.value = true }
function closeAddUserModal() { showAddModal.value = false }
function openEditUserModal(user) { editUserData.value = { ...user }; showEditModal.value = true }
function closeEditUserModal() { showEditModal.value = false; editUserData.value = null }
function formatFullName(first, last) {
  const f = first ? first.trim() : ''
  const l = last ? last.trim() : ''
  if (f && l) return f + ' ' + l
  if (f) return f
  if (l) return l
  return '-'
}
function formatBirthday(birthdate) {
  if (!birthdate) return '-'
  try {
    const date = new Date(birthdate)
    return date.toLocaleDateString('ru-RU')
  } catch {
    return birthdate
  }
}
function getAge(birthdate) {
  if (!birthdate) return ''
  const d = new Date(birthdate)
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  return age
}
function groupTitle(role) {
  if (role === 'admin') return 'Администраторы'
  if (role === 'user') return 'Пользователи'
  return role || 'Без роли'
}
const groupedUsers = computed(() => {
  const groups = {}
  for (const user of users.value) {
    const role = user.role || 'other'
    if (!groups[role]) groups[role] = []
    groups[role].push(user)
  }
  return groups
})

async function fetchUsers() {
  loading.value = true
  try {
    const response = await mpr({ url: '/users' })
    users.value = response.data || []
  } catch (e) {
    users.value = []
  } finally {
    loading.value = false
  }
}

async function handleAddUser(formData) {
  try {
    // FormData уже содержит все необходимые поля включая файл изображения
    // Передаем его напрямую в mpr без преобразований
    await mpr({ 
      url: '/users/', 
      method: 'post', 
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    closeAddUserModal()
    await fetchUsers()
  } catch (e) {
    console.error('Ошибка создания пользователя:', e)
    // TODO: показать ошибку пользователю
  }
}

async function handleEditUser(formData) {
  try {
    if (!editUserData.value || !editUserData.value.id) return
    
    // Если получили FormData (с файлом изображения), отправляем как есть
    if (formData instanceof FormData) {
      await mpr({ 
        url: `/users/${editUserData.value.id}/`, 
        method: 'patch', 
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      // Если получили обычный объект, обрабатываем как раньше
      const changed = {}
      for (const key in formData) {
        if (key === 'password' || key === 'password2' || key === 'photo_file') continue
        const oldVal = editUserData.value[key]
        const newVal = formData[key]
        const isEmpty = v => v === null || v === '' || typeof v === 'undefined'
        if (isEmpty(oldVal) && isEmpty(newVal)) continue
        if (oldVal !== newVal) {
          changed[key] = newVal
        }
      }
      if (Object.keys(changed).length === 0) {
        closeEditUserModal()
        return
      }
      await mpr({ url: `/users/${editUserData.value.id}/`, method: 'patch', data: changed })
    }
    
    closeEditUserModal()
    await fetchUsers()
  } catch (e) {
    console.error('Ошибка редактирования пользователя:', e)
    // TODO: показать ошибку пользователю
  }
}

function deleteUser(user) {
  // TODO: реализовать удаление пользователя
}

onMounted(fetchUsers)
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.icon-btn {
  @apply p-1 hover:bg-gray-100 transition;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  min-width: 350px;
  max-width: 95vw;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
}

</style> 