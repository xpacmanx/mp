<template>
  <div class="product-details-container">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
    </div>
    
    <div v-else-if="product" class="content-wrapper">
      <!-- Header -->
      <div class="page-header flex-between mb-6">
        <div>
          <h1 class="page-title">{{ product.name }}</h1>
          <p class="page-subtitle">{{ product.code }}</p>
        </div>
        <router-link to="/products">
          <TacticalButton variant="secondary" size="sm">
            <ChevronLeft size="16" class="mr-1" /> НАЗАД К СПИСКУ
          </TacticalButton>
        </router-link>
      </div>

      <!-- Metrics Chart -->
      <TacticalCard title="Метрики по WB" subtitle="ДИНАМИКА ПОКАЗАТЕЛЕЙ" class="mb-6">
        <template #header-right>
          <div class="date-picker-wrapper">
            <VueDatePicker
              v-model="dateRange"
              range
              :enable-time-picker="false"
              auto-apply
              :max-date="new Date()"
              :clearable="false"
              :hide-input-icon="true"
              locale="ru"
              format="dd.MM.yyyy"
              placeholder="Выберите период"
              dark
              @update:model-value="handleDateRangeChange"
            />
          </div>
        </template>
        
        <div class="chart-section">
          <div v-if="loadingMetrics" class="loading-placeholder">
            <div class="loading-spinner"></div>
          </div>
          <canvas v-else ref="metricsChart" height="80"></canvas>
          
          <div class="metrics-toggles mt-4">
            <label v-for="opt in metricsOptions" :key="opt.key" class="metric-toggle">
              <input type="checkbox" v-model="opt.checked" @change="debouncedRenderMetricsChart" :disabled="isRenderingChart" />
              <span :style="{ color: opt.color }">{{ opt.label }}</span>
            </label>
          </div>
        </div>
      </TacticalCard>

      <div class="grid-layout">
        <!-- Left Column - Images & Info -->
        <div class="left-column">
          <TacticalCard title="Фото товара" subtitle="ГАЛЕРЕЯ" class="mb-6">
            <div v-if="product.pics && product.pics.length > 0" class="gallery-container">
              <!-- Main image -->
              <div class="main-image">
                <img :src="selectedImage" :alt="product.name" />
              </div>
              
              <!-- Thumbnail grid -->
              <div class="thumbnails-grid">
                <div 
                  v-for="(pic, index) in product.pics" 
                  :key="index"
                  @click="selectedImage = pic.big || pic.tm"
                  class="thumbnail-item"
                  :class="{ 'active': selectedImage === (pic.big) }"
                >
                  <img :src="pic.tm || pic.square" :alt="`${product.name} ${index + 1}`" />
                </div>
              </div>
            </div>
            <div v-else class="no-images">
              <span>НЕТ ИЗОБРАЖЕНИЙ</span>
            </div>
            
            <!-- Video if available -->
            <div v-if="product.video" class="mt-4">
              <h3 class="section-label mb-2">ВИДЕО</h3>
              <video 
                :src="product.video" 
                controls 
                class="product-video"
                preload="metadata"
              >
                Ваш браузер не поддерживает видео.
              </video>
            </div>
          </TacticalCard>

          <!-- Dimensions -->
          <TacticalCard title="Размеры и логистика" subtitle="ХАРАКТЕРИСТИКИ" class="mb-6">
            <div class="info-list">
              <div class="info-item">
                <span class="label">Размеры (Д×Ш×В)</span>
                <span class="value">{{ product.dimensions?.length }}×{{ product.dimensions?.width }}×{{ product.dimensions?.height }} см</span>
              </div>
              <div class="info-item">
                <span class="label">Объем</span>
                <span class="value">{{ product.volume }} л</span>
              </div>
              <div class="info-item">
                <span class="label">Вес брутто</span>
                <span class="value">{{ product.dimensions?.weightBrutto || product.weight }} кг</span>
              </div>
              <div class="info-item">
                <span class="label">Дней до готовности</span>
                <span class="value">{{ product.days_to_ready }}</span>
              </div>
            </div>
          </TacticalCard>

          <!-- Dates -->
          <TacticalCard title="Даты" subtitle="ИСТОРИЯ" class="mb-6">
            <div class="info-list">
              <div class="info-item">
                <span class="label">Создано</span>
                <span class="value">{{ formatDate(product.created_on) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Обновлено</span>
                <span class="value">{{ formatDate(product.updated_on) }}</span>
              </div>
            </div>
          </TacticalCard>
        </div>

        <!-- Right Column - Product Info -->
        <div class="right-column">
          <TacticalCard title="Общая информация" subtitle="СВОДКА" class="mb-6">
            <div class="metrics-grid">
              <div class="metric-box">
                <span class="metric-label">МАСТЕР</span>
                <span class="metric-value">{{ product.master || 'Нет' }}</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">СЕМЕЙСТВО</span>
                <span class="metric-value">{{ product.family || '-' }}</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">ШТРИХКОД</span>
                <span class="metric-value">{{ product.barcode || '-' }}</span>
              </div>
            </div>
          </TacticalCard>

          <!-- Wildberries Info -->
          <TacticalCard title="Wildberries" :subtitle="product.wbid" class="mb-6">
            <template #header-right>
              <div class="flex gap-2">
                <TacticalBadge variant="primary">WB</TacticalBadge>
              </div>
            </template>
            
            <div class="metrics-grid mb-6">
              <div class="metric-box">
                <span class="metric-label">ЦЕНА</span>
                <span class="metric-value">{{ product.wb_api_price || '-' }} ₽</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">СПП</span>
                <span class="metric-value">{{ wb_spp || '-' }}%</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">ЦЕНА МСК</span>
                <span class="metric-value">{{ wb_price_moscow || '-' }} ₽</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">РЕЙТИНГ</span>
                <span class="metric-value">{{ formatRating(product.wb_rating) }}</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">ОТЗЫВЫ</span>
                <span class="metric-value">{{ product.wb_feedbacks || '-' }}</span>
              </div>
            </div>

            <h3 class="section-label mb-3">ПРОДАЖИ И ПРИБЫЛЬ</h3>
            <div class="metrics-grid">
              <div class="metric-box">
                <span class="metric-label">7 ДНЕЙ</span>
                <span class="metric-value">{{ product.wb_sales7 || '-' }} шт</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">30 ДНЕЙ</span>
                <span class="metric-value">{{ product.wb_sales30 || '-' }} шт</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">РЕНТАБЕЛЬНОСТЬ</span>
                <span class="metric-value" :class="getProfitabilityClass(product.wb_profitability)">
                  {{ formatPercentage(product.wb_profitability) }}
                </span>
              </div>
            </div>
          </TacticalCard>

          <!-- Ads -->
          <TacticalCard title="Реклама" subtitle="КАМПАНИИ" class="mb-6">
            <div v-if="loadingAds" class="loading-placeholder sm">
              <div class="loading-spinner sm"></div>
            </div>
            <div v-else-if="ads.length === 0" class="empty-state">
              Нет активной рекламы
            </div>
            <div v-else class="ads-list">
              <div v-for="ad in ads" :key="ad.id" class="ad-item">
                <div class="ad-info">
                  <router-link :to="`/adv/${ad.id}`" class="ad-link">{{ ad.id }}</router-link>
                  <TacticalBadge :variant="getAdStatusVariant(ad.status_id)" size="sm">
                    {{ getAdStatusText(ad.status_id) }}
                  </TacticalBadge>
                  <TacticalBadge :variant="getCampaignStatusVariant(ad.step_date, ad.profitability)" size="sm">
                    {{ getCampaignStatusText(ad.step_date, ad.profitability) }}
                  </TacticalBadge>
                </div>
                <div class="ad-metrics">
                  <span class="drr-value">{{ formatPercentage(ad.drr) }}</span>
                  <span class="drr-label">ДРР</span>
                </div>
              </div>
            </div>
          </TacticalCard>

          <!-- Ozon Info -->
          <TacticalCard title="Ozon" :subtitle="product.ozonid" class="mb-6">
            <template #header-right>
              <div class="flex gap-2">
                <TacticalBadge variant="info">OZON</TacticalBadge>
              </div>
            </template>
            
            <div class="metrics-grid mb-6">
              <div class="metric-box">
                <span class="metric-label">ЦЕНА</span>
                <span class="metric-value">{{ product.ozon_price || '-' }} ₽</span>
              </div>
            </div>

            <h3 class="section-label mb-3">ПРОДАЖИ И ПРИБЫЛЬ</h3>
            <div class="metrics-grid">
              <div class="metric-box">
                <span class="metric-label">7 ДНЕЙ</span>
                <span class="metric-value">{{ product.ozon_sales7 || '-' }} ₽</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">30 ДНЕЙ</span>
                <span class="metric-value">{{ product.ozon_sales30 || '-' }} шт</span>
              </div>
              <div class="metric-box">
                <span class="metric-label">РЕНТАБЕЛЬНОСТЬ</span>
                <span class="metric-value" :class="getProfitabilityClass(product.ozon_profitability)">
                  {{ formatPercentage(product.ozon_profitability) }}
                </span>
              </div>
            </div>
          </TacticalCard>

          <!-- Stocks and Goals -->
          <TacticalCard title="Остатки и цели" subtitle="СКЛАДЫ" class="mb-6">
            <template v-if="loadingStocks || loadingGoals">
              <div class="loading-placeholder sm">
                <div class="loading-spinner sm"></div>
              </div>
            </template>
            <template v-else-if="stocks.length === 0 && goals.length === 0">
              <div class="empty-state">
                Нет данных об остатках и целях
              </div>
            </template>
            <template v-else>
              <div class="stocks-table-wrapper">
                <table class="tactical-table-simple">
                  <thead>
                    <tr>
                      <th class="text-left">Регион</th>
                      <th class="text-right">Остатки</th>
                      <th class="text-right">Цели</th>
                      <th class="text-right">Дней</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="mp in ['wb', 'ozon']">
                      <tr>
                        <td colspan="4" class="mp-header" :class="mp">
                          {{ mp === 'wb' ? 'Wildberries' : 'Ozon' }}
                        </td>
                      </tr>
                      <template v-for="(regionData, region) in (combinedWarehouseData[mp] || {})" :key="mp + '-' + region">
                        <tr class="region-row">
                          <td class="font-bold">{{ region }}</td>
                          <td class="text-right font-bold">{{ regionData.totalStocks }}</td>
                          <td class="text-right font-bold">{{ regionData.totalGoals }}</td>
                          <td></td>
                        </tr>
                        <template v-for="(warehouse, id) in regionData.warehouses" :key="mp + '-' + region + '-' + id">
                          <tr class="warehouse-row">
                            <td class="pl-4">{{ warehouse.name }}</td>
                            <td class="text-right">{{ warehouse.stocks }}</td>
                            <td class="text-right">{{ warehouse.goals }}</td>
                            <td class="text-right">{{ warehouse.goalDays || '-' }}</td>
                          </tr>
                          <tr v-if="filteredSupplyTasks(warehouse.name).length > 0">
                            <td colspan="4" class="supply-tasks-cell">
                              <div class="supply-tasks-list">
                                <span class="task-label">🚚 В пути:</span>
                                <template v-for="task in filteredSupplyTasks(warehouse.name)" :key="task.id">
                                  <span class="supply-task-badge">
                                    {{ task.qty }} шт. до {{ formatShortDate(task.estimated_date) }}
                                  </span>
                                </template>
                              </div>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>
            </template>
          </TacticalCard>
        </div>
      </div>
    </div>
    
    <div v-else class="error-state">
      <TacticalCard>
        <div class="text-center py-8">
          <p class="text-muted">Товар не найден</p>
          <router-link to="/products" class="mt-4 inline-block">
            <TacticalButton variant="primary">ВЕРНУТЬСЯ К СПИСКУ</TacticalButton>
          </router-link>
        </div>
      </TacticalCard>
    </div>
  </div>
</template>

<style scoped>
.product-details-container {
  padding: var(--spacing-6);
  max-width: 1600px;
  margin: 0 auto;
}

.loading-state, .error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-bg-tertiary);
  border-top-color: var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.sm {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  margin-bottom: 4px;
}

.page-subtitle {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-6);
}

@media (max-width: 1024px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

/* Chart Section */
.chart-section {
  position: relative;
  min-height: 300px;
}

.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--border-radius-md);
}

.loading-placeholder.sm {
  height: 100px;
}

.metrics-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.metric-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-family: var(--font-family-mono);
  font-size: 0.75rem;
  user-select: none;
}

/* Gallery */
.gallery-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.main-image {
  aspect-ratio: 3/4;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnails-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-2);
}

.thumbnail-item {
  aspect-ratio: 3/4;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--color-border-subtle);
  transition: all 0.2s;
}

.thumbnail-item:hover, .thumbnail-item.active {
  border-color: var(--color-accent-primary);
  transform: translateY(-2px);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-images {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius-md);
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
  font-size: 0.8rem;
}

.product-video {
  width: 100%;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border-subtle);
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  color: var(--color-text-muted);
}

.info-item .value {
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  text-align: right;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-4);
}

.metric-box {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3);
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
  font-family: var(--font-family-mono);
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
}

.section-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-family-mono);
  margin-top: var(--spacing-2);
}

/* Ads List */
.ads-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.ad-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.ad-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.ad-link {
  font-family: var(--font-family-mono);
  color: var(--color-accent-primary);
  font-size: 0.85rem;
  text-decoration: none;
}

.ad-link:hover {
  text-decoration: underline;
}

.ad-metrics {
  text-align: right;
}

.drr-value {
  display: block;
  font-family: var(--font-family-mono);
  font-weight: 700;
  font-size: 0.9rem;
}

.drr-label {
  font-size: 0.65rem;
  color: var(--color-text-muted);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-4);
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-style: italic;
}

/* Simple Table */
.tactical-table-simple {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.tactical-table-simple th {
  padding: 8px;
  color: var(--color-text-muted);
  font-weight: normal;
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  border-bottom: 1px solid var(--color-border-subtle);
}

.tactical-table-simple td {
  padding: 8px;
  color: var(--color-text-primary);
}

.mp-header {
  background-color: rgba(255, 255, 255, 0.05);
  font-family: var(--font-family-mono);
  font-weight: 700;
  text-align: center;
  padding: 6px !important;
  font-size: 0.8rem;
}

.mp-header.wb { color: #a855f7; }
.mp-header.ozon { color: #3b82f6; }

.region-row td {
  background-color: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.warehouse-row td {
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
  font-family: var(--font-family-mono);
  font-size: 0.8rem;
}

.supply-tasks-cell {
  padding: 4px 8px 12px 24px !important;
}

.supply-tasks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.task-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.supply-task-badge {
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  font-family: var(--font-family-mono);
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* Date Picker Overrides */
:deep(.dp__input) {
  background-color: var(--color-bg-tertiary) !important;
  border-color: var(--color-border-subtle) !important;
  color: var(--color-text-primary) !important;
  font-family: var(--font-family-mono) !important;
  font-size: 0.85rem !important;
}

:deep(.dp__menu) {
  background-color: var(--color-bg-secondary) !important;
  border-color: var(--color-border-subtle) !important;
}

:deep(.dp__theme_dark) {
  --dp-background-color: var(--color-bg-secondary);
  --dp-text-color: var(--color-text-primary);
  --dp-hover-color: rgba(255, 255, 255, 0.1);
  --dp-hover-text-color: var(--color-text-primary);
  --dp-hover-icon-color: var(--color-text-primary);
  --dp-primary-color: var(--color-accent-primary);
  --dp-primary-text-color: #000;
  --dp-secondary-color: var(--color-text-muted);
  --dp-border-color: var(--color-border-subtle);
  --dp-menu-border-color: var(--color-border-subtle);
  --dp-border-color-hover: var(--color-text-muted);
}
</style>

<script>
import { useProductStore } from '@/store/productStore'
import mpr from '@/tools/mpr'
import Chart from 'chart.js/auto'
import { defineComponent } from 'vue'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import TacticalCard from '@/components/TacticalCard.vue'
import TacticalButton from '@/components/TacticalButton.vue'
import TacticalBadge from '@/components/TacticalBadge.vue'
import { ChevronLeft } from 'lucide-vue-next'

function debounce(fn, delay) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

export default {
    components: {
        VueDatePicker,
        TacticalCard,
        TacticalButton,
        TacticalBadge,
        ChevronLeft
    },
    data() {
        return {
            product: null,
            loading: true,
            selectedImage: null,
            stocks: [],
            goals: [],
            ads: [],
            supplyTasks: [],
            loadingStocks: true,
            loadingGoals: true,
            loadingAds: true,
            loadingSupplyTasks: true,
            metrics: [],
            metricsChart: null,
            metricsOptions: [
                { key: 'total_orders_per_day', label: 'Кол-во заказов в день', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)', checked: true }, // серый
                { key: 'total_amount_per_day', label: 'Выручка в день', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', checked: false }, // голубой
                { key: 'average_price_per_order', label: 'Ср. цена', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)', checked: false }, // сиреневый
                { key: 'average_spp_percent', label: 'Средняя СПП', color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)', checked: false }, // мятный
                { key: 'marketing_amount_per_day', label: 'Маркетинг (₽/день)', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)', checked: false }, // желтый
                { key: 'marketing_percent', label: '% на маркетинг', color: '#F472B6', bg: 'rgba(244, 114, 182, 0.15)', checked: true }, // розовый
                { key: 'profit_amount_per_day', label: 'Марж. прибыль', color: '#FCA5A5', bg: 'rgba(252, 165, 165, 0.15)', checked: false }, // светло-красный
                { key: 'profit_margin', label: 'Рентабельность', color: '#C4B5FD', bg: 'rgba(196, 181, 253, 0.15)', checked: true } // светло-сиреневый
            ],
            loadingMetrics: true,
            isRenderingChart: false,
            dateRange: [
                new Date(new Date().setDate(new Date().getDate() - 8)), // последние 30 дней по умолчанию
                new Date(new Date().setDate(new Date().getDate() - 1)),
            ]
        }
    },
    created() {
      this.debouncedRenderMetricsChart = debounce(this.renderMetricsChart, 200)
    },
    async mounted() {
        await this.loadProduct()
        if (this.product) {
            await Promise.all([
                this.loadStocks(),
                this.loadGoals(),
                this.loadAds(),
                this.loadSupplyTasks(),
                this.loadMetrics()
            ])
            this.$nextTick(this.renderMetricsChart)
        }
    },
    methods: {
        async loadProduct() {
            const productId = this.$route.params.id
            
            try {
                // First try to get from store
                const productStore = useProductStore()
                if (productStore.products) {
                    const product = productStore.products.find(p => p.id.toString() === productId)
                    if (product) {
                        this.product = product
                        this.setDefaultImage()
                        this.loading = false
                        return
                    }
                }
                
                // If not found in store, fetch from API
                const response = await mpr({ url: `/products/${productId}` })
                this.product = response.data.result
                this.setDefaultImage()
            } catch (error) {
                console.error('Error loading product:', error)
            } finally {
                this.loading = false
            }
        },
        setDefaultImage() {
            if (this.product?.pics && this.product.pics.length > 0) {
                this.selectedImage = this.product.pics[0].big || this.product.pics[0].tm
            }
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
        formatRating(value) {
            if (!value && value !== 0) return '-'
            return value.toFixed(1)
        },
        formatPercentage(value) {
            if (!value && value !== 0) return '-'
            return `${(value * 100).toFixed(1)}%`
        },
        formatDate(date) {
            if (!date) return '-'
            return new Date(date).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        formatChartDate(date) {
            if (!date) return ''
            const d = new Date(date)
            const day = String(d.getDate()).padStart(2, '0')
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const year = d.getFullYear()
            return `${day}.${month}.${year}`
        },
        async loadStocks() {
            try {
                const response = await mpr({ url: `/products/${this.$route.params.id}/stocks` })
                this.stocks = response.data.result
            } catch (error) {
                console.error('Error loading stocks:', error)
            } finally {
                this.loadingStocks = false
            }
        },
        async loadGoals() {
            try {
                const response = await mpr({ url: `/products/${this.$route.params.id}/goals` })
                this.goals = response.data.result
            } catch (error) {
                console.error('Error loading goals:', error)
            } finally {
                this.loadingGoals = false
            }
        },
        async loadAds() {
            try {
                const response = await mpr({ url: `/products/${this.$route.params.id}/ads` })
                this.ads = response.data.result
            } catch (error) {
                console.error('Error loading ads:', error)
            } finally {
                this.loadingAds = false
            }
        },
        async loadSupplyTasks() {
            try {
                const response = await mpr({ url: `/products/${this.$route.params.id}/supplytasks` })
                this.supplyTasks = response.data.result
            } catch (error) {
                console.error('Error loading supply tasks:', error)
            } finally {
                this.loadingSupplyTasks = false
            }
        },
        async loadMetrics() {
            try {
                const startDate = this.formatDateForAPI(this.dateRange[0])
                const endDate = this.formatDateForAPI(this.dateRange[1])
                const response = await mpr({ 
                    url: `/products/${this.$route.params.id}/metrics`,
                    params: {
                        from: startDate,
                        to: endDate
                    }
                })
                this.metrics = response.data.result
                this.loadingMetrics = false
            } catch (error) {
                console.error('Error loading metrics:', error)
                this.loadingMetrics = false
            }
        },
        formatDateForAPI(date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        },
        renderMetricsChart() {
            this.isRenderingChart = true
            if (!this.metrics || this.metrics.length === 0) {
                this.isRenderingChart = false
                return
            }
            if (!this.$refs.metricsChart) {
                this.isRenderingChart = false
                return
            }
            // Удаляем старый график максимально безопасно
            if (this.metricsChart) {
                try {
                    this.metricsChart.destroy()
                } catch (e) {}
                this.metricsChart = null
            }
            // Проверяем, что canvas всё ещё есть
            if (!this.$refs.metricsChart) {
                this.isRenderingChart = false
                return
            }
            const ctx = this.$refs.metricsChart.getContext('2d')
            // Формируем выбранные датасеты и оси
            const selected = this.metricsOptions.filter(opt => opt.checked)
            const percentKeys = ['average_spp_percent', 'marketing_percent', 'profit_margin']
            const datasets = selected.map((opt, idx) => ({
                label: opt.label,
                data: this.metrics.map(m => percentKeys.includes(opt.key) && typeof m[opt.key] === 'number' ? m[opt.key] * 100 : m[opt.key]),
                borderColor: opt.color,
                backgroundColor: opt.bg,
                fill: false,
                tension: 0.3,
                yAxisID: 'y' + idx,
                spanGaps: true
            }))
            // Динамически создаём оси
            const scales = {}
            selected.forEach((opt, idx) => {
                const axisId = 'y' + idx
                scales[axisId] = {
                    position: idx % 2 === 0 ? 'left' : 'right',
                    display: false,
                    grid: { display: false },
                    ticks: { display: false },
                    beginAtZero: true
                }
            })
            scales['x'] = { title: { display: true, text: 'Дата'} }
            this.metricsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.metrics.map(m => this.formatChartDate(m.order_date)),
                    datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true },
                        title: { display: false, text: 'Динамика по выбранным метрикам' }
                    },
                    animation: false,
                    scales
                }
            })
            this.isRenderingChart = false
        },
        getWarehouseTypeClass(type) {
            switch (type) {
                case 'marketplace':
                    return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                case 'office':
                    return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                default:
                    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }
        },
        getAdStatusClass(status) {
            switch (status) {
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
                default:
                    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }
        },
        getAdStatusText(status) {
            switch (status) {
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
                default:
                    return 'Неизвестно'
            }
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
        getSupplyTaskStatusClass(status) {
            switch (status) {
                case 1: // в работе
                    return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                case 2: // выполнено
                    return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                case 3: // отменено
                    return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                default:
                    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }
        },
        getSupplyTaskStatusText(status) {
            switch (status) {
                case 1:
                    return 'В работе'
                case 2:
                    return 'Выполнено'
                case 3:
                    return 'Отменено'
                default:
                    return 'Неизвестно'
            }
        },
        filteredSupplyTasks(warehouseName) {
            // Возвращает supplyTasks для склада с совпадающим именем и статусом != 10, отсортированные по дате
            return (this.supplyTasks || [])
                .filter(task => task.warehouse_name === warehouseName && task.status_id !== 10)
                .sort((a, b) => new Date(a.estimated_date) - new Date(b.estimated_date))
        },
        formatShortDate(date) {
            if (!date) return '-'
            const d = new Date(date)
            const day = String(d.getDate()).padStart(2, '0')
            const month = String(d.getMonth() + 1).padStart(2, '0')
            return `${day}.${month}`
        },
        getProfitabilityClass(value) {
            if (value === undefined || value === null) return ''
            if (value >= 0.3) return 'text-success'
            if (value >= 0.1) return 'text-warning'
            return 'text-danger'
        },
        getAdStatusVariant(status) {
            switch (status) {
                case 9: return 'success' // идут показы
                case 11: return 'warning' // на паузе
                case 4: return 'primary' // готова к запуску
                case 7: return 'neutral' // завершена
                case 8: return 'danger' // отказался
                default: return 'neutral'
            }
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
        handleDateRangeChange() {
            this.loadingMetrics = true
            this.loadMetrics()
            this.$nextTick(this.renderMetricsChart)
        },
    },
    computed: {
        groupedStocks() {
            const grouped = {
                wb: {},
                ozon: {},
                ms: {}
            }

            this.stocks.forEach(stock => {
                const marketplace = stock.warehouse_type
                const region = stock.warehouse_region || 'Не указан'
                
                if (!grouped[marketplace][region]) {
                    grouped[marketplace][region] = {
                        total: 0,
                        warehouses: []
                    }
                }
                
                grouped[marketplace][region].total += stock.qty
                grouped[marketplace][region].warehouses.push(stock)
            })

            return grouped
        },
        groupedGoals() {
            const grouped = {
                wb: {},
                ozon: {},
                ms: {}
            }

            this.goals.forEach(goal => {
                const marketplace = goal.warehouse_type
                const region = goal.warehouse_region || 'Не указан'
                
                if (!grouped[marketplace][region]) {
                    grouped[marketplace][region] = {
                        total: 0,
                        warehouses: []
                    }
                }
                
                grouped[marketplace][region].total += goal.sales_goal
                grouped[marketplace][region].warehouses.push(goal)
            })

            return grouped
        },
        combinedWarehouseData() {
            // Гарантируем, что всегда возвращаем объект с wb и ozon
            const combined = { wb: {}, ozon: {} }

            if (Array.isArray(this.stocks)) {
                this.stocks.forEach(stock => {
                    const marketplace = stock.warehouse_type
                    if (!['wb', 'ozon'].includes(marketplace)) return
                    const region = stock.warehouse_region || 'Не указан'
                    if (!combined[marketplace][region]) {
                        combined[marketplace][region] = {
                            totalStocks: 0,
                            totalGoals: 0,
                            warehouses: {}
                        }
                    }
                    combined[marketplace][region].totalStocks += stock.qty
                    combined[marketplace][region].warehouses[stock.warehouse_id] = {
                        name: stock.warehouse_name,
                        stocks: stock.qty,
                        goals: 0,
                        goalDays: 0
                    }
                })
            }

            if (Array.isArray(this.goals)) {
                this.goals.forEach(goal => {
                    const marketplace = goal.warehouse_type
                    if (!['wb', 'ozon'].includes(marketplace)) return
                    const region = goal.warehouse_region || 'Не указан'
                    if (!combined[marketplace][region]) {
                        combined[marketplace][region] = {
                            totalStocks: 0,
                            totalGoals: 0,
                            warehouses: {}
                        }
                    }
                    combined[marketplace][region].totalGoals += goal.sales_goal
                    if (!combined[marketplace][region].warehouses[goal.warehouse_id]) {
                        combined[marketplace][region].warehouses[goal.warehouse_id] = {
                            name: goal.warehouse_name,
                            stocks: 0,
                            goals: 0,
                            goalDays: 0
                        }
                    }
                    combined[marketplace][region].warehouses[goal.warehouse_id].goals = goal.sales_goal
                    combined[marketplace][region].warehouses[goal.warehouse_id].goalDays = goal.goal_days
                })
            }
            return combined
        },
        wb_spp() {
            if (!this.product || !this.product.wb_mp_price || !this.product.wb_api_price) return 0
            return Math.ceil(100 - (this.product.wb_mp_price / this.product.wb_api_price))
        },
        wb_price_moscow() {
            if (!this.product || !this.product.wb_api_price) return 0
            const spp = this.wb_spp / 100
            return Math.floor(Math.floor(this.product.wb_api_price * (1 - spp)) * (1 - 0.02))
        }
    }
}
</script>