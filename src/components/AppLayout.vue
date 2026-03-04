<template>
  <div class="app-layout">
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <div class="header-left">
        <div class="logo-container crt-flicker">
          <img src="@/assets/logo3.svg" alt="TLQ Systems" class="logo-img" />
        </div>
        
        <!-- Main Navigation -->
        <nav class="main-menu">
          <div 
            v-for="item in navItems" 
            :key="item.path" 
            class="nav-item-wrapper"
            @mouseenter="setActiveDropdown(item.path)"
            @mouseleave="clearActiveDropdown"
          >
            <router-link :to="item.path" class="nav-item" active-class="active">
              <span class="nav-text">{{ item.name }}</span>
            </router-link>
            
            <!-- Nav Dropdown -->
            <transition name="fade">
              <div v-if="item.children && activeDropdown === item.path" class="nav-dropdown">
                <template v-for="child in item.children" :key="child.name">
                  <router-link 
                    v-if="child.path"
                    :to="child.path" 
                    class="dropdown-item with-icon"
                  >
                    <component :is="child.icon" class="item-icon" size="16" />
                    <div class="item-content">
                      <div class="dropdown-title">{{ child.name }}</div>
                      <div class="dropdown-desc">{{ child.description }}</div>
                    </div>
                  </router-link>
                  <div v-else class="dropdown-item with-icon">
                    <component :is="child.icon" class="item-icon" size="16" />
                    <div class="item-content">
                      <div class="dropdown-title">{{ child.name }}</div>
                      <div class="dropdown-desc">{{ child.description }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </transition>
          </div>
        </nav>
      </div>

      <div class="header-right">
        <div class="system-status">
          <span class="status-dot"></span>
          <span class="status-text">СИСТЕМА: ОНЛАЙН</span>
        </div>

        <div class="header-actions">
          <button class="icon-btn">
            <Search size="20" />
          </button>
          <button class="icon-btn">
            <Bell size="20" />
          </button>
        </div>

        <!-- User Profile -->
        <div class="user-profile-container" v-click-outside="closeProfile" v-if="isAuthenticated">
          <div class="user-profile" @click="toggleProfile">
            <div class="avatar-circle">
              <img :src="userData.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userData.username" alt="User Avatar" />
            </div>
            <div class="user-info">
              <span class="user-name">{{ userData.firstName }} {{ userData.lastName }}</span>
              <span class="user-rank">{{ getRoleName(role) }}</span>
            </div>
            <span class="dropdown-icon">
              <ChevronDown size="16" />
            </span>
          </div>

          <!-- Profile Dropdown -->
          <transition name="fade">
            <div v-if="isProfileOpen" class="profile-dropdown">
              <div class="dropdown-header">
                <span class="header-label">MY ACCOUNT</span>
              </div>
              <router-link to="/profile" class="dropdown-item with-icon">
                <User class="item-icon" size="18" />
                <div class="item-content">
                  <div class="dropdown-title">Профиль</div>
                  <div class="dropdown-desc">Настройки аккаунта</div>
                </div>
              </router-link>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item with-icon text-danger" @click="handleLogout">
                <LogOut class="item-icon" size="18" />
                <div class="item-content">
                  <div class="dropdown-title">Выйти</div>
                  <div class="dropdown-desc">Завершить сессию</div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- Sub Header / Breadcrumbs -->
    <div class="sub-header">
      <div class="breadcrumbs">
        <span class="crumb-root">ROOT</span>
        <span class="separator">/</span>
        <span class="crumb-current">{{ currentRouteName }}</span>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAuthenticated, userData, role } from '@/tools/userState'
import { logoutUser } from '@/tools/auth'
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Activity, 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut, 
  Calendar, 
  CreditCard, 
  Package, 
  Warehouse, 
  FileText, 
  FileJson, 
  List, 
  Tag,
  ChevronDown,
  Bell,
  Search,
  Megaphone
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const currentRouteName = computed(() => {
  return route.meta.title || route.name || 'DASHBOARD'
})

// Role Helper
const getRoleName = (r) => {
  const roles = {
    'admin': 'Администратор',
    'user': 'Пользователь',
    'top': 'Топ-менеджер',
    'logistics': 'Логист',
    'masters': 'Мастер',
    'marketing': 'Маркетинг',
    'production': 'Производство',
    'packers': 'Упаковщик'
  }
  return roles[r] || r || 'Без роли'
}

// Navigation State
const activeDropdown = ref(null)

const setActiveDropdown = (path) => {
  activeDropdown.value = path
}

const clearActiveDropdown = () => {
  activeDropdown.value = null
}

// Navigation Data
const navItems = computed(() => {
  const items = [
    { 
      name: 'ПОСТАВКИ', 
      path: '/', 
      icon: LayoutDashboard,
      children: [
        { name: 'Непринятые задания', description: 'Задания требующие внимания', icon: FileText, path: '/' },
        { name: 'Новая поставка', description: 'Создать новую поставку', icon: Package, path: '/newsupplytask2/' },
        { name: 'Список складов', description: 'Обзор складов', icon: Warehouse, path: '/supplytasks/dashboard' }
      ]
    },
    { 
      name: 'ТОВАРЫ', 
      path: '/products', 
      icon: ShoppingBag,
      children: [
        { name: 'Все продукты', description: 'Просмотр всех доступных товаров', icon: ShoppingBag, path: '/products' },
        { name: 'Мои продукты', description: 'Товары, которые вы создали', icon: List, path: '/products/my' }
      ]
    },
    { 
      name: 'РЕКЛАМА', 
      path: '/adv', 
      icon: Megaphone
    }
  ]

  // Add HR for admin/top
  if (role.value === 'admin' || role.value === 'top') {
    items.push({
      name: 'HR',
      path: '/users',
      icon: Users
    })
  }

  // Add Design System for dev (optional, keeping it for now)
  items.push({
    name: 'СИСТЕМА',
    path: '/system-health',
    icon: Activity,
    children: [
       { name: 'Design System', description: 'UI Style Guide', icon: FileText, path: '/design-system' },
       { name: 'System Health', description: 'Status Monitor', icon: Activity, path: '/system-health' }
    ]
  })

  return items
})

// Profile Dropdown
const isProfileOpen = ref(false)
const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}
const closeProfile = () => {
  isProfileOpen.value = false
}

const handleLogout = async () => {
  await logoutUser(router)
}

// Click Outside Directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
}

/* Top Nav */
.top-nav {
  height: 64px;
  background-color: rgba(10, 10, 10, 0.95);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-6);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

/* Logo */
.logo-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-right: var(--spacing-6); /* Ensure space before menu */
}

.logo-img {
  height: 24px; /* Reduced from 32px */
  width: auto;
  filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.5));
}

@keyframes flicker {
  0%, 90% { opacity: 1; }
  91% { opacity: 0.8; }
  92% { opacity: 0.95; }
  93% { opacity: 0.6; }
  94% { opacity: 0.95; }
  95% { opacity: 0.8; }
  96% { opacity: 0.9; }
  97% { opacity: 1; }
  98% { opacity: 0.7; }
  99% { opacity: 0.95; }
  100% { opacity: 1; }
}

.crt-flicker {
  animation: flicker 10s infinite;
  position: relative;
}

.crt-flicker::after {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  z-index: 10;
  pointer-events: none;
  animation: flicker-overlay 10s infinite;
}

@keyframes flicker-overlay {
  0%, 90% { opacity: 0; }
  91% { opacity: 0.1; }
  93% { opacity: 0.2; }
  95% { opacity: 0.05; }
  97% { opacity: 0.1; }
  100% { opacity: 0; }
}

.logo-sub {
  font-size: 0.5rem;
  color: var(--color-text-muted);
  letter-spacing: 1px;
}

/* Glitch Effect */
.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.glitch::before {
  left: 2px;
  text-shadow: -1px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}
.glitch::after {
  left: -2px;
  text-shadow: -1px 0 #00fff9;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% { clip: rect(35px, 9999px, 11px, 0); }
  20% { clip: rect(68px, 9999px, 96px, 0); }
  40% { clip: rect(12px, 9999px, 58px, 0); }
  60% { clip: rect(84px, 9999px, 5px, 0); }
  80% { clip: rect(26px, 9999px, 63px, 0); }
  100% { clip: rect(5px, 9999px, 88px, 0); }
}
@keyframes glitch-anim2 {
  0% { clip: rect(15px, 9999px, 81px, 0); }
  20% { clip: rect(58px, 9999px, 26px, 0); }
  40% { clip: rect(92px, 9999px, 18px, 0); }
  60% { clip: rect(4px, 9999px, 75px, 0); }
  80% { clip: rect(56px, 9999px, 33px, 0); }
  100% { clip: rect(25px, 9999px, 98px, 0); }
}

/* Main Menu */
.main-menu {
  display: flex;
  gap: var(--spacing-1);
}

.nav-item-wrapper {
  position: relative;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-item:hover, .nav-item.active {
  color: var(--color-text-primary);
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  border-bottom: 2px solid var(--color-accent-primary);
}

/* Dropdowns */
.nav-dropdown, .profile-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #151515; /* Darker background */
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-md);
  padding: 8px;
  min-width: 240px; /* Wider for subtitles */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  z-index: 200;
  margin-top: 8px;
  transform-origin: top left;
}

.nav-dropdown::before, .profile-dropdown::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  height: 8px;
}

.profile-dropdown {
  left: auto;
  right: 0;
  transform-origin: top right;
  min-width: 260px;
}

.dropdown-header {
  padding: 8px 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-label {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  font-weight: 700;
  letter-spacing: 1px;
}

.dropdown-item {
  padding: 10px 12px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  text-decoration: none; /* Ensure links don't have underline */
  color: inherit; /* Inherit color from parent/theme */
}

.dropdown-item.with-icon {
  flex-direction: row;
  align-items: flex-start;
}

.item-icon {
  margin-right: 12px;
  font-size: 1.1rem;
  opacity: 0.7;
  padding-top: 2px;
}

.item-content {
  flex: 1;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.dropdown-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.dropdown-desc {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  line-height: 1.3;
}

.dropdown-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 6px 0;
}

.text-danger .dropdown-title {
  color: var(--color-accent-danger);
}

/* System Status */
.system-status {
  display: flex;
  align-items: center;
  margin-right: var(--spacing-6);
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  color: var(--color-accent-success);
  border: 1px solid rgba(0, 255, 157, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 255, 157, 0.05);
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: var(--color-accent-success);
  border-radius: 50%;
  margin-right: 6px;
  box-shadow: 0 0 8px var(--color-accent-success);
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: var(--spacing-2);
  margin-right: var(--spacing-6);
}

.icon-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: var(--color-text-primary);
  background-color: rgba(255, 255, 255, 0.05);
}

/* User Profile */
.user-profile-container {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: 6px 16px 6px 6px;
  border-radius: 9999px; /* Pill shape */
  background-color: #1a1a1a; /* Dark background */
  transition: background-color 0.2s ease;
  border: 1px solid var(--color-border-subtle);
}

.user-profile:hover {
  background-color: #252525;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: var(--spacing-3);
  border: none;
  background-color: var(--color-bg-tertiary);
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.3;
  margin-right: var(--spacing-3);
}

.user-name {
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 0.85rem;
}

.user-rank {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  font-weight: 400;
  text-transform: none;
}

.dropdown-icon {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  margin-left: 4px;
}

/* Sub Header */
.sub-header {
  height: 40px;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-6);
}

.breadcrumbs {
  font-family: var(--font-family-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
}

.crumb-root {
  color: var(--color-text-secondary);
}

.separator {
  margin: 0 var(--spacing-2);
  color: var(--color-text-muted);
}

.crumb-current {
  color: var(--color-accent-primary);
  font-weight: 600;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: var(--spacing-6);
  overflow-y: auto;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
