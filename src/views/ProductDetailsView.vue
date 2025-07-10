<template>
<div class="min-h-full bg-gray-50 dark:bg-gray-900">
    <div class="py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div v-if="loading" class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
            
            <div v-else-if="product" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <!-- Header -->
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ product.name }}</h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ product.code }}</p>
                        </div>
                        <router-link 
                            to="/products" 
                            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            ← Назад к списку
                        </router-link>
                    </div>
                </div>
                <!-- Metrics Chart (moved up) -->
                <div class="mt-4 mx-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Метрики по WB</h3>
                                          <div class="flex justify-between items-center mb-4">
                          <div class="flex items-center space-x-4">
                            <span>Период:</span>
                                <div class="relative">
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
                                      input-class-name="!w-80 !h-10 !px-4 !py-2 !text-sm !border !border-gray-300 !rounded-lg !bg-white dark:!bg-gray-700 dark:!border-gray-600 dark:!text-white focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                                      menu-class-name="!border !border-gray-200 !rounded-lg !shadow-lg"
                                      @update:model-value="handleDateRangeChange"
                                  />
                                </div>
                          </div>
                      </div>
                    <div v-if="loadingMetrics" class="w-full h-48 bg-gray-100 dark:bg-gray-700 animate-pulse rounded"></div>
                    <canvas v-else ref="metricsChart" height="80"></canvas>
                    <div class="flex flex-wrap gap-4 mb-4">
                        <label v-for="opt in metricsOptions" :key="opt.key" class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" v-model="opt.checked" @change="debouncedRenderMetricsChart" :disabled="isRenderingChart" />
                            <span :style="{ color: opt.color }">{{ opt.label }}</span>
                        </label>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Left Column - Images -->
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Фото товара</h2>
                            <div v-if="product.pics && product.pics.length > 0" class="space-y-4">
                                <!-- Main image -->
                                <div class="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <img 
                                        :src="selectedImage" 
                                        :alt="product.name"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                
                                <!-- Thumbnail grid -->
                                <div class="grid grid-cols-5 gap-2">
                                    <div 
                                        v-for="(pic, index) in product.pics" 
                                        :key="index"
                                        @click="selectedImage = pic.big || pic.tm"
                                        class="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer hover:ring-2 hover:ring-blue-500"
                                        :class="{ 'ring-2 ring-blue-500': selectedImage === (pic.big ) }"
                                    >
                                        <img 
                                            :src="pic.tm || pic.square" 
                                            :alt="`${product.name} ${index + 1}`"
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div v-else class="aspect-square rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <span class="text-gray-400 dark:text-gray-500">Нет изображений</span>
                            </div>
                            
                            <!-- Video if available -->
                            <div v-if="product.video" class="mt-4">
                                <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-2">Видео</h3>
                                <video 
                                    :src="product.video" 
                                    controls 
                                    class="w-full rounded-lg"
                                    preload="metadata"
                                >
                                    Ваш браузер не поддерживает видео.
                                </video>
                            </div>

                            <!-- Dimensions -->
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg my-4">
                                <h3 class="font-medium text-gray-900 dark:text-white mb-3">Размеры и логистика</h3>
                                <div class="grid grid-cols-1 gap-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Размеры (Д×Ш×В):</span>
                                        <span class="text-gray-900 dark:text-white">
                                            {{ product.dimensions?.length }}×{{ product.dimensions?.width }}×{{ product.dimensions?.height }} см
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Объем:</span>
                                        <span class="text-gray-900 dark:text-white">{{ product.volume }} л</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Вес брутто:</span>
                                        <span class="text-gray-900 dark:text-white">{{ product.dimensions?.weightBrutto || product.weight }} кг</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Дней до готовности:</span>
                                        <span class="text-gray-900 dark:text-white">{{ product.days_to_ready }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Dates -->
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <h3 class="font-medium text-gray-900 dark:text-white mb-3">Даты</h3>
                                <div class="grid grid-cols-1 gap-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Создано:</span>
                                        <span class="text-gray-900 dark:text-white">{{ formatDate(product.created_on) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Обновлено:</span>
                                        <span class="text-gray-900 dark:text-white">{{ formatDate(product.updated_on) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column - Product Info -->
                        <div class="lg:col-span-2">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Общая информация о товаре</h2>
                            
                            <!-- Basic Info -->
                            <div class="space-y-4">
                                <!-- Метрики карточки -->
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">

                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Мастер</span>
                                        <span class="text-medium font-bold text-gray-900 dark:text-white">{{ product.master || 'Нет' }}</span>
                                    </div>
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Семейство</span>
                                        <span class="text-medium font-bold text-gray-900 dark:text-white">{{ product.family || '-' }}</span>
                                    </div>
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Штрихкод</span>
                                        <span class="text-medium font-bold text-gray-900 dark:text-white">{{ product.barcode || '-' }}</span>
                                    </div>
                                </div>

                                <h2 class="text-medium font-semibold text-gray-900 dark:text-white mb-4">Информация по Wildberries <span class="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 text-sm text-gray-500 dark:text-gray-400 ml-2">{{ product.wbid }}</span></h2>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">

                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Цена</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ product.wb_api_price || '-' }} ₽</span>
                                    </div>
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">СПП</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ wb_spp || '-' }}%</span>
                                    </div>
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Цена в МСК (СПП+Кошелек)</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ wb_price_moscow || '-' }} ₽</span>
                                    </div>

                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Рейтинг</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatRating(product.wb_rating) }}</span>
                                    </div>
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Отзывы</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ product.wb_feedbacks || '-' }}</span>
                                    </div>

                                </div>
                                <h2 class="text-medium font-semibold text-gray-900 dark:text-white mb-4">Данные по Wildberries</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Продажи за 7 дней</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ product.wb_sales7 || '-' }} шт</span>
                                    </div>
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Продажи за 30 дней</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ product.wb_sales30 || '-' }} шт</span>
                                    </div>
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Рентабельность</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatPercentage(product.wb_profitability) }}</span>
                                    </div>
                                </div>

                                <!-- Ads -->
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-6">
                                    <h3 class="font-bold text-gray-900 dark:text-white mb-3">Реклама</h3>
                                    <div v-if="loadingAds" class="flex justify-center py-4">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                                    </div>
                                    <div v-else-if="ads.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                                        Нет активной рекламы
                                    </div>
                                    <div v-else class="space-y-3">
                                        <div v-for="ad in ads" :key="ad.id" class="flex justify-between items-center">
                                            <div class="flex items-center space-x-2">
                                                <span class="text-sm"><router-link :to="`/ads/${ad.id}`" class="text-blue-500 dark:text-blue-400">{{ ad.id }}</router-link></span>
                                                <!-- <span class="text-sm">{{ ad.name }}</span> -->
                                                <span :class="getAdStatusClass(ad.status_id)" 
                                                      class="px-2 py-0.5 text-xs font-medium rounded-full">
                                                    {{ getAdStatusText(ad.status_id) }}
                                                </span>
                                                <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ml-2">
                                                    {{ getCampaignStatusText(ad.step_date, ad.profitability) }}
                                                </span>
                                                <!-- <br/>
                                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                                    {{ formatDate(ad.step_date) }}
                                                </span> -->
                                            </div>
                                            <div class="text-right">
                                                <div class="text-sm font-medium">{{ formatPercentage(ad.drr) }}</div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400">
                                                    ДРР
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Информация по Ozon <span class="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 text-sm text-gray-500 dark:text-gray-400 ml-2">{{ product.ozonid }}</span></h2>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Цена</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ product.ozon_price || '-' }} ₽</span>
                                    </div>
                                </div>

                                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Данные по Ozon</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Продажи за 7 дней</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ product.ozon_sales7 || '-' }}  ₽</span>
                                    </div>


                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Продажи за 30 дней</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ product.ozon_sales30 || '-' }} шт</span>
                                    </div>
                                    <div class="border bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Рентабельность</span>
                                        <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatPercentage(product.ozon_profitability) }}</span>
                                    </div>

                                </div>

                                

                                <!-- Combined Stocks and Goals -->
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 class="font-medium text-gray-900 dark:text-white mb-3">Остатки и цели</h3>
                                    <template v-if="loadingStocks || loadingGoals">
                                        <div class="flex justify-center py-4">
                                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                                        </div>
                                    </template>
                                    <template v-else-if="stocks.length === 0 && goals.length === 0">
                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                            Нет данных об остатках и целях
                                        </div>
                                    </template>
                                    <template v-else>
                                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                            <thead class="bg-gray-100 dark:bg-gray-600">
                                                <tr>
                                                    <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Регион</th>
                                                    <!-- <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Склад</th> -->
                                                    <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Остатки</th>
                                                    <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Цели</th>
                                                    <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Дней</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <template v-for="mp in ['wb', 'ozon']">
                                                    <tr>
                                                        <td :colspan="5" class="bg-gray-200 dark:bg-gray-800 text-lg font-semibold py-2 px-2 border-t border-b border-gray-300 dark:border-gray-600 text-center"
                                                            :class="mp === 'wb' ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300'">
                                                            {{ mp === 'wb' ? 'Wildberries' : 'Ozon' }}
                                                        </td>
                                                    </tr>
                                                    <template v-for="(regionData, region) in (combinedWarehouseData[mp] || {})" :key="mp + '-' + region">
                                                        <tr class="bg-gray-100 dark:bg-gray-700">
                                                            <td class="px-2 py-1 text-sm font-bold">{{ region }}</td>
                                                            <td class="px-2 py-1 text-sm text-right font-bold">{{ regionData.totalStocks }}</td>
                                                            <td class="px-2 py-1 text-sm text-right font-bold">{{ regionData.totalGoals }}</td>
                                                            <td class="px-2 py-1 text-sm text-right">&nbsp;</td>
                                                        </tr>
                                                        <template v-for="(warehouse, id) in regionData.warehouses" :key="mp + '-' + region + '-' + id">
                                                            <tr>
                                                                <!-- <td class="px-2 py-1 text-sm">&nbsp;</td> -->
                                                                <td class="px-2 py-1 text-sm">{{ warehouse.name }}</td>
                                                                <td class="px-2 py-1 text-sm text-right">{{ warehouse.stocks }}</td>
                                                                <td class="px-2 py-1 text-sm text-right">{{ warehouse.goals }}</td>
                                                                <td class="px-2 py-1 text-sm text-right">{{ warehouse.goalDays || '-' }}</td>
                                                            </tr>
                                                            <tr v-if="filteredSupplyTasks(warehouse.name).length > 0">
                                                                <td colspan="4" class="px-2 pb-2 pt-0">
                                                                    <div class="flex flex-wrap gap-2">
                                                                        <span class="inline-flex items-center text-xs font-medium text-blue-800 dark:text-blue-100">🚚 В пути:</span>
                                                                        <template v-for="task in filteredSupplyTasks(warehouse.name)" :key="task.id">
                                                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
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
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <p class="text-gray-500 dark:text-gray-400">Товар не найден</p>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
/* Кастомные стили для VueDatePicker */
:deep(.dp__input) {
  width: 320px !important;
  height: 40px !important;
  padding: 8px 16px !important;
  font-size: 14px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  background-color: white !important;
}

:deep(.dark .dp__input) {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
  color: white !important;
}

:deep(.dp__input:focus) {
  ring: 2px !important;
  ring-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
  outline: none !important;
}



:deep(.dp__menu) {
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

:deep(.dark .dp__menu) {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
}
</style>

<script>
import { useProductStore } from '@/store/productStore'
import mpr from '@/tools/mpr'
import Chart from 'chart.js/auto'
import { defineComponent } from 'vue'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

function debounce(fn, delay) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

export default {
    components: {
        VueDatePicker
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
        async handleDateRangeChange() {
            this.loadingMetrics = true
            await this.loadMetrics()
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