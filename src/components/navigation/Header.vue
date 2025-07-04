<template>
  <nav>
    <div class="header">
      <div class="header-container">
        <div class="header-menu">
          <div class="flex items-center">
            <div class="logo shrink-0">
              <img class="size-8" src="./../../assets/logo2.svg" alt="TLQ The Last Question">
            </div>

            <div class="hidden md:block">
              <div class="menu2-list space-x-4" v-if="isAuthenticated">
                <router-link to="/" class="ml-5" active-class="bg-lime-300 hover:text-gray-600 visited:text-gray-950">Сервис
                  поставок</router-link>
                <router-link to="/products" active-class="bg-lime-300 hover:text-gray-600 visited:text-gray-950">Товары</router-link>
                <router-link to="/adv" active-class="bg-lime-300 hover:text-gray-600 visited:text-gray-950">Реклама</router-link>
                <router-link v-if="role === 'admin'" to="/users" active-class="bg-lime-300 hover:text-gray-600 visited:text-gray-950">HR</router-link>
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <!-- User profile dropdown -->
            <div v-if="isAuthenticated" class="relative">
              <button @click="toggleDropdown" class="flex items-center focus:outline-none">
                <div class="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center">
                  <img v-if="userData.photo_url" :src="userData.photo_url" alt="Фото" class="w-full h-full rounded-full">
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>

              <!-- Dropdown menu -->
              <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <div class="px-4 py-2 border-b border-gray-700">
                  <div class="text-sm font-medium text-white">{{ username }}</div>
                  <div class="text-xs text-lime-300 font-semibold">{{ role }}</div>
                </div>
                <!-- <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Профиль
                </router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Настройки
                </router-link> -->
                <div class="border-t border-gray-700"></div>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Выйти
                </button>
              </div>
            </div>
          </div>

          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <button type="button"
              class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-controls="mobile-menu" aria-expanded="false">
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              <!-- Menu open: "hidden", Menu closed: "block" -->
              <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <!-- Menu open: "block", Menu closed: "hidden" -->
              <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <!-- div class="md:hidden" id="mobile-menu">
        <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">

          <a href="#" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Reports</a>
        </div>
        <div class="border-t border-gray-700 pb-3 pt-4">
          <div class="flex items-center px-5">
            <div class="shrink-0">
              <img class="size-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
            </div>
            <div class="ml-3">
              <div class="text-base/5 font-medium text-white">Tom Cook</div>
              <div class="text-sm font-medium text-gray-400">tom@example.com</div>
            </div>
            <button type="button" class="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">View notifications</span>
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </button>
          </div>
          <div class="mt-3 space-y-1 px-2">
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Your Profile</a>
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Settings</a>
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Sign out</a>
          </div>
        </div>
      </div-->
    </div>
    <!--div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center">
        <div class="my20 flex items-baseline space-x-4">
          <a href="/" class="px-3 py-2 text-sm font-medium text-gray-950 hover:text-gray-600 visited:text-gray-950">Список складов</a>
          <a href="/ads" class="px-3 py-2 text-sm font-medium text-gray-950 hover:text-gray-600 visited:text-gray-950">Сделать поставку</a>
        </div>
      </div>
  </div-->
  </nav>
</template>

<script>
import { logoutUser } from './../../tools/auth'
import { isAuthenticated, username, role, userData } from './../../tools/userState'
import { ref } from 'vue'

export default {
  name: 'Header',
  setup() {
    const isDropdownOpen = ref(false)

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    // Close dropdown when clicking outside
    const closeDropdown = (event) => {
      if (!event.target.closest('.relative')) {
        isDropdownOpen.value = false
      }
    }

    // Add click event listener to close dropdown
    document.addEventListener('click', closeDropdown)

    return {
      isAuthenticated,
      username,
      role,
      userData,
      isDropdownOpen,
      toggleDropdown
    }
  },
  methods: {
    async logout(){
      await logoutUser(this.$router);
    }
  },
  computed: {
    module(){
      if (this.$router.fullPath.includes('supplytasks')) return 'supplytasks'
      if (this.$router.fullPath.includes('/adv')) return 'adv'
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown)
  }
}
</script>

<style lang="postcss">
.header {
  @apply bg-gray-950;
}

.header-container {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}

.header-menu {
  @apply flex h-16 items-center justify-between;
}

.menu2-list {
  @apply flex items-baseline space-x-4;

  a {
    @apply rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-lime-300 hover:text-gray-950;
  }
}

.btn {
  @apply rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-red-500 hover:text-white;
}
</style>