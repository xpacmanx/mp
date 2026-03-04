<template>
  <div class="adv-list-container">
    <div class="page-header flex-between mb-6">
      <h1 class="page-title">Бот автоминусации</h1>
      
      <!-- Search field -->
      <div class="search-wrapper">
        <div class="relative">
          <input
            type="text"
            v-model="search"
            placeholder="Поиск по названию, коду, типу..."
            class="tactical-input"
          />
          <div class="search-icon">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign Status Filter Panel -->
    <div class="filter-panel mb-6">
      <div class="flex items-center space-x-4">
        <span class="filter-label">Этап кампании:</span>
        <div class="flex items-center gap-2">
          <template v-for="(status, index) in campaignStatuses" :key="status.key">
            <TacticalButton
              @click="setCampaignStatusFilter(status.key)"
              :variant="selectedCampaignStatus === status.key ? status.variant : 'secondary'"
              size="sm"
              class="filter-btn"
            >
              <span>{{ status.label }}</span>
              <span class="count-badge">
                {{ getCampaignStatusCount(status.key) }}
              </span>
            </TacticalButton>
            <svg 
              v-if="index < campaignStatuses.length - 1" 
              class="w-4 h-4 text-gray-600 mx-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </template>
        </div>
        <button
          v-if="selectedCampaignStatus !== null"
          @click="clearCampaignStatusFilter"
          class="reset-btn"
        >
          Сбросить
        </button>
      </div>
    </div>
    
    <TacticalCard class="table-card">
      <TacticalTable 
        :columns="columns" 
        :data="filteredAndSortedAdv"
        @header-click="sort"
      >
        <!-- Custom Slots -->
        <template #created_at="{ row }">
          <div class="flex flex-col">
            <span class="font-mono">{{ formatDate(row.created_at) }}</span>
            <span class="text-xs text-muted">
              {{ getCampaignWeeks(row.created_at) }}
            </span>
          </div>
        </template>

        <template #name="{ row }">
          <div class="flex flex-col">
            <router-link 
              :to="'/adv/' + row.id" 
              class="product-link"
            >
              {{ row.name }}
            </router-link>
            <div class="mt-1 text-xs text-muted font-mono">
              <span class="inline-block">
                ID: {{ row.id }}
              </span>
              <span class="inline-block ml-3">
                Тип: {{ row.product_type || '-' }}
              </span>
            </div>
            <div class="mt-2">
              <div class="flex items-center space-x-2">
                <TacticalBadge :variant="getCampaignStatusVariant(row.step_date, row.profitability)" size="sm">
                  {{ getCampaignStatusText(row.step_date, row.profitability) }}
                </TacticalBadge>
                
                <div v-if="showProgressBar(row.step_date)" class="flex-1 min-w-[100px] max-w-[150px]">
                  <div class="progress-bar-bg">
                    <div :class="getProgressBarColorClass(row.step_date, row.profitability)" 
                         class="progress-bar-fill" 
                         :style="{ width: getProgressBarWidth(row.step_date) + '%' }">
                    </div>
                  </div>
                  <div class="text-xs text-muted mt-1 text-right">
                    {{ getRemainingDays(row.step_date) }} дн.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #status="{ row }">
          <div class="flex flex-col gap-2">
            <TacticalBadge :variant="getStatusVariant(row.status_id)">
              {{ getStatusText(row.status_id) }}
            </TacticalBadge>
            <div class="text-xs text-muted font-mono">
              Ставка: {{ formatCpm(row.current_cpm) }}
            </div>
            <div class="flex flex-wrap gap-1">
              <span v-if="row.tools?.carousel" class="tool-badge">Карусель</span>
              <span v-if="row.tools?.recom" class="tool-badge">Рек.</span>
              <span v-if="row.tools?.booster" class="tool-badge">Бустер</span>
            </div>
          </div>
        </template>

        <template #minus_words_count="{ row }">
          <div class="flex flex-col space-y-1 text-xs font-mono">
            <div class="flex justify-between">
              <span class="text-muted">Min CTR:</span>
              <span>{{ formatCtr(row.min_ctr) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted">Просмотры:</span>
              <span>{{ (row.views_to_minus || 0).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted">Минус-слова:</span>
              <span>{{ row.minus_words }} / 1000</span>
            </div>
          </div>
        </template>

        <template #drr="{ row }">
          <span :class="getDrrClass(row.drr)" class="font-mono font-bold">
            {{ formatDrr(row.drr) }}
          </span>
        </template>

        <template #profitability="{ row }">
          <span :class="getProfitabilityClass(row.profitability)" class="font-mono font-bold">
            {{ formatProfitability(row.profitability) }}
          </span>
        </template>

        <template #expected_revenue="{ row }">
          <span class="font-mono">{{ formatCurrency(row.expected_revenue) }}</span>
        </template>

        <template #revenue="{ row }">
          <div class="flex flex-col text-xs font-mono">
            <div class="flex justify-between gap-2">
              <span class="text-muted">7 дней:</span>
              <span>{{ formatCurrency(row.revenue7) }}</span>
            </div>
            <div class="flex justify-between gap-2">
              <span class="text-muted">Вчера:</span>
              <span>{{ formatCurrency(row.revenue1) }}</span>
            </div>
          </div>
        </template>

      </TacticalTable>
    </TacticalCard>
  </div>
</template>

<script>
import Notifications from '@/components/Notifications.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useAdvStore } from '@/store/advStore'
import mpr from './../tools/mpr'
import moment from 'moment'

import TacticalTable from '@/components/TacticalTable.vue'
import TacticalButton from '@/components/TacticalButton.vue'
import TacticalBadge from '@/components/TacticalBadge.vue'
import TacticalCard from '@/components/TacticalCard.vue'

export default {
  name: 'AdvListView',
  components: {
    Notifications, 
    ArrowPathIcon,
    TacticalTable,
    TacticalButton,
    TacticalBadge,
    TacticalCard
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
        { key: 'created_at', label: 'Дата создания', sortable: true, width: '10%' },
        { key: 'name', label: 'Название', sortable: true, width: '25%' },
        { key: 'status', label: 'Статус', sortable: true, width: '10%' },
        { key: 'minus_words_count', label: 'Параметры', sortable: true, width: '15%' },
        { key: 'drr', label: 'ДРР', sortable: true, width: '10%' },
        { key: 'profitability', label: 'Рентабельность', sortable: true, width: '12%' },
        { key: 'expected_revenue', label: 'Ожидаемая касса', sortable: true, width: '12%' },
        { key: 'revenue', label: 'Уровень кассы', sortable: true, width: '10%' },
      ],
      campaignStatuses: [
        { key: 'razgon', label: 'Разгон', variant: 'success' },
        { key: 'optimization', label: 'Оптимизация', variant: 'warning' },
        { key: 'stable', label: 'Стабильная', variant: 'primary' },
        { key: 'rescue', label: 'Спасение', variant: 'danger' },
      ],
      selectedCampaignStatus: null
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

      // Apply campaign status filter
      if (this.selectedCampaignStatus) {
        filtered = filtered.filter(ad => {
          const campaignStatus = this.getCampaignStatusText(ad.step_date, ad.profitability)
          const statusMap = {
            'razgon': 'Разгон',
            'optimization': 'Оптимизация',
            'stable': 'Стабильная',
            'rescue': 'Спасение'
          }
          return campaignStatus === statusMap[this.selectedCampaignStatus]
        })
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
      return moment(date).format('DD.MM.YYYY')
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
      this.saveFilterState()
    },
    getStatusVariant(status_id) {
      switch (Number(status_id)) {
        case 9: return 'success'
        case 11: return 'warning'
        case 4: return 'primary'
        case 7: return 'neutral'
        case 8: return 'danger'
        case -1: return 'danger'
        default: return 'neutral'
      }
    },
    getStatusText(status_id) {
      switch (Number(status_id)) {
        case 9: return 'Идут показы'
        case 11: return 'На паузе'
        case 4: return 'Готова к запуску'
        case 7: return 'Завершена'
        case 8: return 'Отказ'
        case -1: return 'Удаляется'
        default: return 'Неизвестно'
      }
    },
    getDrrClass(drr) {
      if (!drr && drr !== 0) return 'text-muted'
      const drrPercentage = drr * 100
      if (drrPercentage <= 5) return 'text-success'
      if (drrPercentage <= 10) return 'text-warning'
      return 'text-danger'
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
    getCampaignStatusVariant(createdAt, profitability) {
      if (!createdAt) return 'neutral'
      const createdDate = new Date(createdAt)
      const now = new Date()
      const diffTime = Math.abs(now - createdDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)

      if (weeks < 4) return 'success'
      if (weeks < 8) return 'warning'
      if (profitability < 0.4) return 'danger'
      return 'primary'
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
    getProgressBarColorClass(createdAt, profitability) {
      if (!createdAt) return 'bg-gray-500'
      if (profitability >= 0.4) return 'bg-success'
      
      const remainingDays = this.getRemainingDays(createdAt)
      if (remainingDays > 14) return 'bg-warning'
      return 'bg-danger'
    },
    getProfitabilityClass(value) {
      if (!value && value !== 0) return 'text-muted'
      
      const percentage = value * 100
      if (percentage >= 40) return 'text-success'
      if (percentage >= 30) return 'text-warning'
      return 'text-danger'
    },
    setCampaignStatusFilter(status) {
      this.selectedCampaignStatus = status
      this.saveFilterState()
    },
    clearCampaignStatusFilter() {
      this.selectedCampaignStatus = null
      this.saveFilterState()
    },
    getCampaignStatusCount(status) {
      const statusMap = {
        'razgon': 'Разгон',
        'optimization': 'Оптимизация',
        'stable': 'Стабильная',
        'rescue': 'Спасение'
      }
      return this.adv.filter(ad => {
        const campaignStatus = this.getCampaignStatusText(ad.step_date, ad.profitability)
        return campaignStatus === statusMap[status]
      }).length
    },
    saveFilterState() {
      const filterState = {
        search: this.search,
        sortConfig: this.sortConfig,
        selectedCampaignStatus: this.selectedCampaignStatus
      }
      localStorage.setItem('advListFilters', JSON.stringify(filterState))
    },
    restoreFilterState() {
      try {
        const savedState = localStorage.getItem('advListFilters')
        if (savedState) {
          const filterState = JSON.parse(savedState)
          this.search = filterState.search || ''
          this.sortConfig = filterState.sortConfig || { key: 'step_date', direction: 'desc' }
          this.selectedCampaignStatus = filterState.selectedCampaignStatus || null
        }
      } catch (error) {
        console.warn('Failed to restore filter state:', error)
      }
    }
  },
  watch: {
    search() {
      this.saveFilterState()
    }
  },
  mounted() {
    this.advStore = useAdvStore()
    this.advStore.load().then(() => {
      this.adv = this.advStore.adv
      this.restoreFilterState()
    })
  }
}
</script>

<style scoped>
.adv-list-container {
  padding: var(--spacing-6);
  max-width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 1px;
}

.search-wrapper {
  width: 320px;
}

.tactical-input {
  width: 100%;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-primary);
  padding: 8px 12px 8px 36px;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-family-mono);
  font-size: 0.85rem;
  transition: all 0.2s;
}

.tactical-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.filter-panel {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.count-badge {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
}

.reset-btn {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-family: var(--font-family-mono);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
}

.reset-btn:hover {
  color: var(--color-text-primary);
}

.product-link {
  color: var(--color-accent-primary);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.product-link:hover {
  color: var(--color-accent-secondary);
  text-decoration: underline;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background-color: var(--color-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-danger { background-color: var(--color-danger); }

.tool-badge {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
  font-size: 0.65rem;
  padding: 1px 4px;
  border-radius: 4px;
  font-family: var(--font-family-mono);
}

.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-danger { color: var(--color-danger); }
.text-muted { color: var(--color-text-muted); }
</style>