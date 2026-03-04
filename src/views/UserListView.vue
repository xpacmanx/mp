<template>
  <div class="hr-container">
    <div class="toolbar mb-6 flex-between">
      <div class="flex items-center gap-4">
        <h2 class="page-title">ПЕРСОНАЛ <span class="jp-title">人事</span></h2>
        <div class="search-box">
          <input v-model="searchQuery" type="text" placeholder="ПОИСК СОТРУДНИКА..." class="tactical-input" />
        </div>
      </div>
      <div class="filters flex gap-2">
        <TacticalButton 
          variant="outline" 
          size="sm" 
          @click="openAddUserModal"
        >
          + ДОБАВИТЬ
        </TacticalButton>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>ЗАГРУЗКА ДАННЫХ...</span>
    </div>

    <div v-else class="employee-grid">
      <div v-for="user in filteredUsers" :key="user.id" class="employee-card">
        <div class="card-header flex-between">
          <span class="id-tag">ID: {{ user.id }}</span>
          <TacticalBadge :variant="getRoleVariant(user.role)" outline>{{ getRoleName(user.role) }}</TacticalBadge>
        </div>
        
        <div class="card-body">
          <div class="avatar-placeholder">
            <img v-if="user.photo" :src="user.photo" class="avatar-img" />
            <span v-else class="initials">{{ getInitials(user) }}</span>
            <div class="status-indicator bg-success"></div>
          </div>
          
          <div class="info">
            <h3 class="name">{{ formatFullName(user.first_name, user.last_name) }}</h3>
            <div class="role">{{ user.username }}</div>
            <div class="clearance" v-if="user.telegram_nick">
              TG: <a :href="`https://t.me/${user.telegram_nick.replace(/^@/, '')}`" target="_blank" class="text-accent hover:underline">@{{ user.telegram_nick.replace(/^@/, '') }}</a>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="stat">
            <span class="label">EMAIL</span>
            <span class="value text-xs">{{ user.email }}</span>
          </div>
          <div class="actions flex gap-2">
            <button class="icon-btn" @click="openEditUserModal(user)" title="Редактировать">
              <Edit size="16" />
            </button>
            <button class="icon-btn text-danger" @click="deleteUser(user)" title="Удалить">
              <Trash2 size="16" />
            </button>
          </div>
        </div>
        
        <!-- Decorators -->
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
      </div>
    </div>

    <div v-if="!loading && filteredUsers.length === 0" class="empty-state">
      НЕТ ДАННЫХ
    </div>

    <!-- Modals -->
    <TacticalModal v-model="showAddModal" title="ДОБАВИТЬ СОТРУДНИКА">
      <UserForm @submit="handleAddUser" @cancel="closeAddUserModal" />
    </TacticalModal>

    <TacticalModal v-model="showEditModal" title="РЕДАКТИРОВАТЬ ДАННЫЕ">
      <UserForm :user="editUserData" :isEdit="true" @submit="handleEditUser" @cancel="closeEditUserModal" />
    </TacticalModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import mpr from '@/tools/mpr'
import UserForm from '@/components/UserForm.vue'
import TacticalButton from '@/components/TacticalButton.vue'
import TacticalBadge from '@/components/TacticalBadge.vue'
import TacticalModal from '@/components/TacticalModal.vue'
import { Edit, Trash2 } from 'lucide-vue-next'

const users = ref([])
const loading = ref(true)
const searchQuery = ref('')

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
  return 'UNNAMED'
}

function getInitials(user) {
  const f = user.first_name ? user.first_name[0] : ''
  const l = user.last_name ? user.last_name[0] : ''
  return (f + l).toUpperCase() || '??'
}

function getRoleName(role) {
  const roles = {
    'admin': 'АДМИН',
    'user': 'ПОЛЬЗОВАТЕЛЬ',
    'top': 'ТОП-МЕНЕДЖЕР',
    'logistics': 'ЛОГИСТ',
    'masters': 'МАСТЕР',
    'marketing': 'МАРКЕТИНГ',
    'production': 'ПРОИЗВОДСТВО',
    'packers': 'УПАКОВЩИК'
  }
  return roles[role] || role || 'НЕТ РОЛИ'
}

function getRoleVariant(role) {
  if (role === 'admin' || role === 'top') return 'primary'
  if (role === 'marketing') return 'warning'
  if (role === 'production' || role === 'packers') return 'neutral'
  return 'success'
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => {
    const fullName = formatFullName(user.first_name, user.last_name).toLowerCase()
    const username = (user.username || '').toLowerCase()
    const email = (user.email || '').toLowerCase()
    return fullName.includes(query) || username.includes(query) || email.includes(query)
  })
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
    await mpr({ 
      url: '/users/', 
      method: 'post', 
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    closeAddUserModal()
    await fetchUsers()
  } catch (e) {
    console.error('Error creating user:', e)
  }
}

async function handleEditUser(formData) {
  try {
    if (!editUserData.value || !editUserData.value.id) return
    
    if (formData instanceof FormData) {
      await mpr({ 
        url: `/users/${editUserData.value.id}/`, 
        method: 'patch', 
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
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
    console.error('Error editing user:', e)
  }
}

function deleteUser(user) {
  if (confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
    // TODO: Implement delete API call
    console.log('Delete user', user.id)
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.hr-container {
  padding-bottom: 40px;
}

.page-title {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-text-primary);
}

.jp-title {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.8em;
  opacity: 0.6;
  margin-left: var(--spacing-2);
  font-weight: normal;
}

.tactical-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-primary);
  padding: var(--spacing-2) var(--spacing-4);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  width: 300px;
  outline: none;
  border-radius: var(--border-radius-sm);
}

.tactical-input:focus {
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.employee-card {
  background-color: var(--color-bg-panel);
  border: 1px solid var(--color-border-subtle);
  position: relative;
  padding: var(--spacing-4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.employee-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  border-color: var(--color-border-strong);
}

.card-header {
  margin-bottom: var(--spacing-4);
}

.id-tag {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  letter-spacing: 1px;
}

.card-body {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-4);
  position: relative;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-bg-panel);
}

.bg-success { background-color: var(--color-accent-success); }

.info {
  flex: 1;
  overflow: hidden;
}

.name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: var(--spacing-2);
}

.clearance {
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border-subtle);
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat .label {
  font-size: 0.6rem;
  color: var(--color-text-muted);
  margin-bottom: 2px;
}

.stat .value {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.icon-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: var(--color-text-primary);
}

.icon-btn.text-danger:hover {
  color: var(--color-accent-danger);
}

.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid var(--color-accent-primary);
  opacity: 0.5;
}

.top-right { top: -1px; right: -1px; border-bottom: none; border-left: none; }
.bottom-left { bottom: -1px; left: -1px; border-top: none; border-right: none; }

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 2px solid var(--color-accent-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-4);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 