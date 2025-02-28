<template>
  <div class="min-h-full bg-gray-50 dark:bg-gray-900">
    <Header />

    <div class="py-10">
      <div class="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Бот автоминусации</h2>
          
          <!-- Search field -->
          <div class="w-96">
            <div class="relative">
              <input
                type="text"
                v-model="search"
                placeholder="Поиск по названию, коду, типу..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="overflow-x-auto">
            <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th v-for="column in columns" 
                      :key="column.key" 
                      @click="sort(column.key)"
                      class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 cursor-pointer"
                  >
                    <div class="flex items-center">
                      {{ column.label }}
                      <span class="ml-1" v-if="column.sortable">
                        <template v-if="sortConfig.key === column.key">
                          <svg v-if="sortConfig.direction === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </template>
                        <svg v-else class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="ad in filteredAndSortedAdv" 
                    :key="ad.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(ad.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ ad.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ ad.code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <router-link 
                      :to="'/adv/' + ad.id" 
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline"
                    >
                      {{ ad.name }}
                    </router-link>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ ad.product_type }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ ad.current_cpm }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getCtrClass(ad.min_ctr)">
                    {{ formatCtr(ad.min_ctr) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ (ad.views_to_minus || 0).toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDrr(ad.drr) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ getMinusWordsCount(ad.minus_words) }} из 1000
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <template v-if="hasTrustedWords(ad.trusted_words)">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        Есть
                      </span>
                    </template>
                    <template v-else>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Нет
                      </span>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/navigation/Header.vue'
import Notifications from '@/components/Notifications.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import mpr from './../tools/mpr'
import moment from 'moment'

export default {
  name: 'AdvView',
  components: {
    Header, 
    Notifications, 
    ArrowPathIcon
  },
  data() {
    return {
      adv: [],
      search: '',
      sortConfig: {
        key: 'created_at',
        direction: 'desc'
      },
      columns: [
        { key: 'created_at', label: 'Дата создания', sortable: true },
        { key: 'id', label: 'ID', sortable: true },
        { key: 'code', label: 'Код МС', sortable: true },
        { key: 'name', label: 'Название', sortable: true },
        { key: 'product_type', label: 'Тип товара', sortable: true },
        { key: 'current_cpm', label: 'CPM', sortable: true },
        { key: 'min_ctr', label: 'CTR для минусации', sortable: true },
        { key: 'views_to_minus', label: 'Просмотры для минусации', sortable: true },
        { 
          key: 'drr', 
          label: 'ДРР', 
          sortable: true,
          tooltip: 'ДРР обновляется раз в день по утрам, актуальные ДРР в таблице маркетинга'
        },
        { key: 'minus_words_count', label: 'Минус-слова', sortable: true },
        { key: 'trusted_words', label: 'Проверенные фразы', sortable: true }
      ]
    }
  },
  computed: {
    filteredAndSortedAdv() {
      let filtered = [...this.adv]
      
      // Apply search filter
      if (this.search) {
        const searchLower = this.search.toLowerCase()
        filtered = filtered.filter(ad => 
          ad.name?.toLowerCase().includes(searchLower) ||
          ad.code?.toLowerCase().includes(searchLower) ||
          ad.product_type?.toLowerCase().includes(searchLower)
        )
      }

      // Apply sorting
      return filtered.sort((a, b) => {
        let aValue = a[this.sortConfig.key]
        let bValue = b[this.sortConfig.key]

        // Special handling for specific fields
        if (this.sortConfig.key === 'minus_words_count') {
          aValue = this.getMinusWordsCount(a.minus_words)
          bValue = this.getMinusWordsCount(b.minus_words)
        } else if (this.sortConfig.key === 'trusted_words') {
          aValue = this.hasTrustedWords(a.trusted_words) ? 1 : 0
          bValue = this.hasTrustedWords(b.trusted_words) ? 1 : 0
        }

        if (this.sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
      })
    }
  },
  methods: {
    addNotification(type, text) {
      this.$store.dispatch('add', {type: type, text: text});
    },
    formatCtr(ctr) {
      return (ctr * 100).toFixed(2) + '%'
    },
    getCtrClass(ctr) {
      if (ctr >= 0.1) return 'text-green-600 dark:text-green-400 font-medium'
      if (ctr >= 0.05) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-red-600 dark:text-red-400'
    },
    getAdv() {
      mpr({
        url: '/wbadv/all'
      }).then(res => {
        this.adv = res.data.result;
      })
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    formatDrr(drr) {
      if (!drr && drr !== 0) return '-'
      return `${(drr * 100).toFixed(2)}%`
    },
    getMinusWordsCount(minusWords) {
      if (!minusWords) return 0
      return minusWords.split(',').filter(word => word.trim()).length
    },
    hasTrustedWords(trustedWords) {
      return trustedWords && Array.isArray(trustedWords) && trustedWords.length > 0
    },
    sort(key) {
      if (this.sortConfig.key === key) {
        this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortConfig.key = key
        this.sortConfig.direction = 'asc'
      }
    }
  },
  mounted() {
    this.getAdv();
  }
}
</script>

<style lang="postcss" scoped>
.overflow-x-auto {
  max-height: calc(100vh - 250px);
}

/* Remove horizontal scroll */
.max-w-full {
  width: 100%;
  min-width: 100%;
}

table {
  table-layout: fixed;
}

/* Add reasonable column widths */
th, td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group:hover .group-hover\:block {
  display: block;
}
</style>