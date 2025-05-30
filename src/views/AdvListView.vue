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
                    <div class="flex flex-col">
                      <span>{{ formatDate(ad.created_at) }}</span>
                      <span class="text-xs text-gray-400 dark:text-gray-500">
                        {{ getCampaignWeeks(ad.created_at) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <router-link 
                        :to="'/adv/' + ad.id" 
                        class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline"
                      >
                        {{ ad.name }}
                      </router-link>
                      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span class="inline-block">
                          <span class="font-medium">ID:</span> {{ ad.id }}
                        </span>
                        <span class="inline-block ml-3">
                          <span class="font-medium">Тип:</span> {{ ad.product_type || '-' }}
                        </span>
                      </div>
                      <div class="mt-1">
                        <div class="flex items-center space-x-2">
                          <span :class="getCampaignStatusClass(ad.created_at, ad.profitability)" 
                                class="px-2 py-0.5 text-xs font-medium rounded-full">
                            {{ getCampaignStatusText(ad.created_at, ad.profitability) }}
                          </span>
                          <div v-if="showProgressBar(ad.created_at)" class="flex-1">
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div :class="getProgressBarColor(ad.created_at, ad.profitability)" 
                                   class="h-1.5 rounded-full" 
                                   :style="{ width: getProgressBarWidth(ad.created_at) + '%' }">
                              </div>
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Осталось {{ getRemainingDays(ad.created_at) }} дней
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col">
                      <span :class="getStatusClass(ad.status_id)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ getStatusText(ad.status_id) }}
                      </span>
                      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span class="font-medium">Ставка:</span> {{ formatCpm(ad.current_cpm) }}
                      </div>
                      <div class="mt-1 flex flex-wrap gap-1">
                        <span v-if="ad.tools?.carousel" 
                              class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          Карусель
                        </span>
                        <span v-if="ad.tools?.recom" 
                              class="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                          Рекомендации
                        </span>
                        <span v-if="ad.tools?.booster" 
                              class="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
                          Бустер
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col space-y-1">
                      <div class="flex items-center">
                        <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">Min CTR:</span>
                        <span>{{ formatCtr(ad.min_ctr) }}</span>
                      </div>
                      <div class="flex items-center">
                        <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">Min Просмотры:</span>
                        <span>{{ (ad.views_to_minus || 0).toLocaleString() }}</span>
                      </div>
                      <div class="flex items-center">
                        <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">Минус-слова:</span>
                        <span>{{ ad.minus_words }} из 1000</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getDrrClass(ad.drr)">
                    {{ formatDrr(ad.drr) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getProfitabilityClass(ad.profitability)">
                    {{ formatProfitability(ad.profitability) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatCurrency(ad.expected_revenue) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-400 dark:text-gray-500">по 7 дням:</span>
                      <span>{{ formatCurrency(ad.revenue7) }}</span>
                      <span class="text-xs text-gray-400 dark:text-gray-500 mt-1">по вчера:</span>
                      <span>{{ formatCurrency(ad.revenue1) }}</span>
                    </div>
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
import { useAdvStore } from '@/store/advStore'
import mpr from './../tools/mpr'
import moment from 'moment'

export default {
  name: 'AdvListView',
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
        { key: 'name', label: 'Название', sortable: true },
        { key: 'status', label: 'Статус', sortable: true },
        { key: 'minus_words_count', label: 'Параметры', sortable: true },
        // { key: 'views_to_minus', label: `Просмотры для минусации`, sortable: true },
        // { key: 'minus_words_count', label: 'Минус-слова', sortable: true },
        { key: 'drr', label: 'ДРР', sortable: true },
        { key: 'profitability', label: 'Рентабельность', sortable: true },
        { key: 'expected_revenue', label: 'Ожидаемая касса', sortable: true },
        { key: 'revenue', label: 'Уровень кассы', sortable: true },
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
          ad.product_type?.toLowerCase().includes(searchLower)
        )
      }

      // Apply sorting
      return filtered.sort((a, b) => {
        let aValue = a[this.sortConfig.key]
        let bValue = b[this.sortConfig.key]

        // Handle revenue sorting
        if (this.sortConfig.key === 'revenue') {
          aValue = a.revenue7 || 0
          bValue = b.revenue7 || 0
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
      return ''
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
    sort(key) {
      if (this.sortConfig.key === key) {
        this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortConfig.key = key
        this.sortConfig.direction = 'asc'
      }
    },
    getStatusClass(status_id) {
      switch (Number(status_id)) {
        case 9: // идут показы
          return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
        case 11: // на паузе
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
        case 4: // готова к запуску
          return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
        case 7: // завершена
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        case 8: // отказался
          return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        case -1: // в процессе удаления
          return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }
    },
    getStatusText(status_id) {
      switch (Number(status_id)) {
        case 9:
          return 'Идут показы'
        case 11:
          return 'На паузе'
        case 4:
          return 'Готова к запуску'
        case 7:
          return 'Завершена'
        case 8:
          return 'Отказ'
        case -1:
          return 'Удаляется'
        default:
          return 'Неизвестно'
      }
    },
    getDrrClass(drr) {
      if (!drr && drr !== 0) return 'text-gray-500 dark:text-gray-400'
      
      const drrPercentage = drr * 100
      if (drrPercentage <= 5) return 'text-green-600 dark:text-green-400 font-medium'
      if (drrPercentage <= 10) return 'text-yellow-600 dark:text-yellow-400 font-medium'
      return 'text-red-600 dark:text-red-400 font-medium'
    },
    formatCurrency(value) {
      if (!value && value !== 0) return '-'
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    },
    formatProfitability(value) {
      if (!value && value !== 0) return '-'
      return `${(value * 100).toFixed(1)}%`
    },
    formatCpm(value) {
      if (!value && value !== 0) return '-'
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    },
    getCampaignWeeks(createdAt) {
      if (!createdAt) return '-'
      const createdDate = new Date(createdAt)
      const now = new Date()
      const diffTime = Math.abs(now - createdDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)
      
      if (weeks === 0) return 'Менее недели'
      if (weeks === 1) return '1 неделя'
      if (weeks >= 2 && weeks <= 4) return `${weeks} недели`
      return `${weeks} недель`
    },
    getCampaignStatusText(createdAt, profitability) {
      if (!createdAt) return '-'
      const createdDate = new Date(createdAt)
      const now = new Date()
      const diffTime = Math.abs(now - createdDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)

      if (weeks < 4) return 'Разгон'
      if (weeks < 8) return 'Оптимизация'
      if (profitability < 0.4) return 'Спасение'
      return 'Стабильная'
    },
    getCampaignStatusClass(createdAt, profitability) {
      if (!createdAt) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      const createdDate = new Date(createdAt)
      const now = new Date()
      const diffTime = Math.abs(now - createdDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)

      if (weeks < 4) return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      if (weeks < 8) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
      if (profitability < 0.4) return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    },
    showProgressBar(createdAt) {
      if (!createdAt) return false
      const createdDate = new Date(createdAt)
      const now = new Date()
      const diffTime = Math.abs(now - createdDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)
      return weeks < 8 // Show progress bar for both phases
    },
    getProgressBarWidth(createdAt) {
      if (!createdAt) return 0
      const createdDate = new Date(createdAt)
      const now = new Date()
      const diffTime = Math.abs(now - createdDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)

      if (weeks < 4) {
        // For "Разгон" phase: 0% at start, 100% at 4 weeks
        return Math.min(100, (diffDays / 28) * 100)
      } else {
        // For "Оптимизация" phase: 0% at 4 weeks, 100% at 8 weeks
        return Math.min(100, ((diffDays - 28) / 28) * 100)
      }
    },
    getRemainingDays(createdAt) {
      if (!createdAt) return 0
      const createdDate = new Date(createdAt)
      const now = new Date()
      const diffTime = Math.abs(now - createdDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)

      if (weeks < 4) {
        // For "Разгон" phase: days until 4 weeks
        return Math.max(0, 28 - diffDays)
      } else {
        // For "Оптимизация" phase: days until 8 weeks
        return Math.max(0, 56 - diffDays)
      }
    },
    getProgressBarColor(createdAt, profitability) {
      if (!createdAt) return 'bg-gray-500'
      if (profitability >= 0.4) return 'bg-green-500'
      
      const remainingDays = this.getRemainingDays(createdAt)
      if (remainingDays > 14) return 'bg-yellow-500'
      return 'bg-red-500'
    },
    getProfitabilityClass(value) {
      if (!value && value !== 0) return 'text-gray-500 dark:text-gray-400'
      
      const percentage = value * 100
      if (percentage >= 40) return 'text-green-600 dark:text-green-400 font-medium'
      if (percentage >= 30) return 'text-yellow-600 dark:text-yellow-400 font-medium'
      return 'text-red-600 dark:text-red-400 font-medium'
    }
  },
  mounted() {
    this.advStore = useAdvStore()
    this.advStore.load().then(() => {
      this.adv = this.advStore.adv
    })
    // this.getAdv();
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
}

/* Remove whitespace-nowrap from the name column */
td:nth-child(2) {
  white-space: normal;
}

/* Adjust column widths */
th:nth-child(1) { width: 10%; } /* Date */
th:nth-child(2) { width: 25%; } /* Name (with ID and Type) */
th:nth-child(3) { width: 10%; } /* Status */
th:nth-child(4) { width: 15%; } /* Parameters */
th:nth-child(5) { width: 10%; } /* DRR */
th:nth-child(6) { width: 12%; } /* Expected revenue */
th:nth-child(7) { width: 12%; } /* Revenue */
th:nth-child(8) { width: 10%; } /* Profitability */

.group:hover .group-hover\:block {
  display: block;
}
</style>