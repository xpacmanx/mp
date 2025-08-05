<template>
<div class="min-h-full bg-gray-50 dark:bg-gray-900">
    <div class="py-10">
        <div class="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Список продуктов</h2>
                
                <!-- Search and filters -->
                <div class="flex space-x-4">
                    <!-- Master filter -->
                    <select
                        v-model="filters.master"
                        @change="loadProductsAndUpdateURL"
                        class="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Все мастера</option>
                        <option v-for="master in uniqueMasters" :key="master" :value="master">{{ master }}</option>
                    </select>
                    
                    <!-- Type filter -->
                    <select
                        v-model="filters.product_type"
                        @change="loadProductsAndUpdateURL"
                        class="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Все типы</option>
                        <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                    
                    <!-- Price range filter -->
                    <div class="flex space-x-2">
                        <input
                            type="number"
                            v-model="filters.price_min"
                            placeholder="Цена от"
                            @change="loadProductsAndUpdateURL"
                            class="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-24"
                        />
                        <input
                            type="number"
                            v-model="filters.price_max"
                            placeholder="Цена до"
                            @change="loadProductsAndUpdateURL"
                            class="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-24"
                        />
                    </div>
                    
                    <!-- Search field -->
                    <div class="w-96">
                        <div class="relative">
                            <input
                                type="text"
                                v-model="search"
                                @input="debounceSearch"
                                placeholder="Поиск по названию, коду или артикулу..."
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
            </div>
            
            <!-- Loading indicator -->
            <div v-if="loading" class="flex justify-center items-center py-4">
                <!-- <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div> -->
            </div>
            
            <!-- Error message -->
            <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Ошибка загрузки</h3>
                        <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                            {{ error }}
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-if="!error" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th v-for="column in columns" 
                                    :key="column.key" 
                                    @click="sort(column.key)"
                                    :class="column.sortable ? 'cursor-pointer' : ''"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
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
                            <!-- Loading skeleton -->
                            <template v-if="loading">
                                <tr v-for="i in 10" :key="`skeleton-${i}`" class="animate-pulse">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex flex-col space-y-2">
                                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-col space-y-1">
                                            <div class="flex items-center">
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4 mr-1"></div>
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                            </div>
                                            <div class="flex items-center">
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mr-1"></div>
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                            </div>
                                            <div class="flex items-center">
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 mr-1"></div>
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                            </div>
                                            <div class="flex items-center">
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mr-1"></div>
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-col space-y-1">
                                            <div class="flex items-center">
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4 mr-1"></div>
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                            </div>
                                            <div class="flex items-center">
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 mr-1"></div>
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-col space-y-1">
                                            <div class="flex items-center">
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4 mr-1"></div>
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                            </div>
                                            <div class="flex items-center">
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 mr-1"></div>
                                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4 mr-1"></div>
                                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            
                            <!-- Actual data -->
                            <template v-else>
                                <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <img 
                                            v-if="product.pics && product.pics[0] && product.pics[0].tm" 
                                            :src="product.pics[0].tm" 
                                            :alt="product.name"
                                            class="h-16 w-16 object-cover rounded"
                                        />
                                        <div v-else class="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                            <span class="text-gray-400 dark:text-gray-500 text-xs">Пусто</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex flex-col">
                                            <router-link 
                                                :to="'/products/' + product.id"
                                                class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline"
                                                :title="product.name"
                                            >
                                                {{ truncateName(product.name) }}
                                            </router-link>
                                            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span class="inline-block">
                                                    <span class="font-medium">Код:</span> {{ product.code }}
                                                </span>
                                            </div>
                                            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span class="inline-block">
                                                    <span class="font-medium">Тип:</span> {{ product.product_type || '-' }}
                                                </span>
                                            </div>
                                            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span class="inline-block">
                                                    <span class="font-medium">Артикул ВБ:</span> {{ product.wbid || '-' }}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{{ product.master }}</td>
                                    <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div class="flex flex-col space-y-1">
                                            <div class="flex items-center">
                                                <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">WB:</span>
                                                <span>{{ formatCurrency(product.wb_price) }}</span>
                                            </div>
                                            <div class="flex items-center">
                                                <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">WB на сайте:</span>
                                                <span>{{ formatCurrency(product.wb_mp_price) }}</span>
                                            </div>
                                            <div class="flex items-center">
                                                <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">Ozon:</span>
                                                <span>{{ formatCurrency(product.ozon_price) }}</span>
                                            </div>
                                            <div class="flex items-center">
                                                <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">Ozon на сайте:</span>
                                                <span>{{ formatCurrency(product.ozon_mp_price) }}</span>
                                            </div>
                                        </div>
                                    </td> -->
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div class="flex flex-col space-y-1">
                                            <div class="flex items-center">
                                                <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">WB:</span>
                                                <span>{{ formatCurrency(product.wb_revenue30) }}</span>
                                            </div>
                                            <div class="flex items-center">
                                                <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">Ozon:</span>
                                                <span>{{ formatCurrency(product.ozon_revenue30) }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div class="flex flex-col space-y-1">
                                            <div class="flex items-center">
                                                <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">WB:</span>
                                                <span>{{ formatPercentage(product.wb_profitability) }}</span>
                                            </div>
                                            <div class="flex items-center">
                                                <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">Ozon:</span>
                                                <span>{{ formatPercentage(product.ozon_profitability) }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div class="flex items-center">
                                            <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">WB:</span>
                                            <span>{{ formatRating(product.wb_rating) }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                    <!-- Loading skeleton for pagination -->
                    <template v-if="loading">
                        <div class="flex-1 flex justify-between sm:hidden">
                            <div class="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div class="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
                        </div>
                    </template>
                    
                    <!-- Actual pagination -->
                    <template v-else>
                        <div class="flex-1 flex justify-between sm:hidden">
                            <button
                                @click="changePage(currentPage - 1)"
                                :disabled="currentPage <= 1"
                                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Назад
                            </button>
                            <button
                                @click="changePage(currentPage + 1)"
                                :disabled="currentPage >= totalPages"
                                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Вперед
                            </button>
                        </div>
                        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p class="text-sm text-gray-700 dark:text-gray-300">
                                    Показано <span class="font-medium">{{ ((currentPage - 1) * pageSize) + 1 }}</span> 
                                    до <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> 
                                    из <span class="font-medium">{{ totalItems }}</span> результатов
                                </p>
                            </div>
                            <div>
                                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        @click="changePage(currentPage - 1)"
                                        :disabled="currentPage <= 1"
                                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span class="sr-only">Предыдущая</span>
                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    
                                    <template v-for="page in visiblePages" :key="page">
                                        <button
                                            v-if="page !== '...'"
                                            @click="changePage(page)"
                                            :class="page === currentPage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                                            class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                        >
                                            {{ page }}
                                        </button>
                                        <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                            ...
                                        </span>
                                    </template>
                                    
                                    <button
                                        @click="changePage(currentPage + 1)"
                                        :disabled="currentPage >= totalPages"
                                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span class="sr-only">Следующая</span>
                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import mpr from '@/tools/mpr'

export default {
    data() {
        return {
            products: [],
            loading: false,
            error: null,
            search: '',
            searchTimeout: null,
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            totalPages: 0,
            sortConfig: {
                key: 'wb_revenue30',
                direction: 'desc'
            },
            filters: {
                master: '',
                product_type: '',
                price_min: '',
                price_max: ''
            },
            uniqueMasters: [],
            uniqueTypes: [],
            filtersLoaded: false,
            columns: [
                { key: 'image', label: 'Изображение', sortable: false },
                { key: 'name', label: 'Товар', sortable: true },
                { key: 'master', label: 'Мастер', sortable: true },
                // { key: 'prices', label: 'Цены', sortable: false },
                { key: 'revenue', label: 'Выручка 30 дней', sortable: false },
                { key: 'profitability', label: 'Рентабельность', sortable: false },
                { key: 'wb_rating', label: 'Рейтинг', sortable: true }
            ]
        }
    },
    computed: {
        visiblePages() {
            const pages = []
            const maxVisible = 7
            
            if (this.totalPages <= maxVisible) {
                for (let i = 1; i <= this.totalPages; i++) {
                    pages.push(i)
                }
            } else {
                if (this.currentPage <= 4) {
                    for (let i = 1; i <= 5; i++) {
                        pages.push(i)
                    }
                    pages.push('...')
                    pages.push(this.totalPages)
                } else if (this.currentPage >= this.totalPages - 3) {
                    pages.push(1)
                    pages.push('...')
                    for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
                        pages.push(i)
                    }
                } else {
                    pages.push(1)
                    pages.push('...')
                    for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
                        pages.push(i)
                    }
                    pages.push('...')
                    pages.push(this.totalPages)
                }
            }
            
            return pages
        }
    },
    async mounted() {
        this.loadFromURL()
        // Load products and filters in parallel
        await Promise.all([
            this.loadProducts(),
            this.loadFilters()
        ])
    },
    methods: {
        async loadProducts() {
            this.loading = true
            this.error = null
            
            try {
                const params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    sort_by: this.sortConfig.key,
                    sort_order: this.sortConfig.direction
                }
                
                // Add search
                if (this.search.trim()) {
                    params.search = this.search.trim()
                }
                
                // Add filters
                if (this.filters.master) {
                    params['filter[master]'] = this.filters.master
                }
                if (this.filters.product_type) {
                    params['filter[product_type]'] = this.filters.product_type
                }
                if (this.filters.price_min) {
                    params['filter[wb_price][min]'] = this.filters.price_min
                }
                if (this.filters.price_max) {
                    params['filter[wb_price][max]'] = this.filters.price_max
                }
                
                const response = await mpr({ 
                    url: '/products/all',
                    params: params
                })
                
                this.products = response.data.result || []
                this.totalItems = response.data.pagination?.total || 0
                this.totalPages = response.data.pagination?.total_pages || 0
                this.currentPage = response.data.pagination?.page || 1
                
            } catch (error) {
                console.error('Error loading products:', error)
                this.products = []
                this.totalItems = 0
                this.totalPages = 0
                this.error = error.response?.data?.message || error.message || 'Ошибка загрузки продуктов'
            } finally {
                this.loading = false
            }
        },
        
        async loadProductsAndUpdateURL() {
            this.currentPage = 1
            await this.loadProducts()
            this.updateURL()
        },
        
        async loadFilters() {
            // Load filters only once
            if (this.filtersLoaded) return
            
            try {
                // Load unique masters and types from dedicated filters endpoint
                const response = await mpr({ 
                    url: '/products/filters'
                })
                
                this.uniqueMasters = response.data.filters?.masters || []
                this.uniqueTypes = response.data.filters?.product_types || []
                this.filtersLoaded = true
                
            } catch (error) {
                console.error('Error loading filters:', error)
                // Fallback: try to get filters from the first page of products
                try {
                    const fallbackResponse = await mpr({ 
                        url: '/products/all',
                        params: { page: 1, page_size: 1000 }
                    })
                    
                    const allProducts = fallbackResponse.data.result || []
                    
                    // Extract unique masters
                    const masters = [...new Set(allProducts.map(p => p.master).filter(Boolean))]
                    this.uniqueMasters = masters.sort()
                    
                    // Extract unique types
                    const types = [...new Set(allProducts.map(p => p.product_type).filter(Boolean))]
                    this.uniqueTypes = types.sort()
                    this.filtersLoaded = true
                    
                } catch (fallbackError) {
                    console.error('Error loading fallback filters:', fallbackError)
                }
            }
        },
        
        debounceSearch() {
            clearTimeout(this.searchTimeout)
            this.searchTimeout = setTimeout(() => {
                this.currentPage = 1
                this.loadProducts()
                this.updateURL()
            }, 500)
        },
        
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page
                this.loadProducts()
                this.updateURL()
            }
        },
        
        sort(key) {
            if (this.sortConfig.key === key) {
                this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc'
            } else {
                this.sortConfig.key = key
                this.sortConfig.direction = 'asc'
            }
            this.loadProducts()
            this.updateURL()
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
            // Конвертируем доли в проценты (умножаем на 100)
            const percentage = value * 100
            return percentage.toFixed(1) + '%'
        },
        
        truncateName(name) {
            if (!name) return '-'
            if (name.length <= 30) return name
            return name.substring(0, 30) + '...'
        },
        
        loadFromURL() {
            const query = this.$route.query
            
            if (query.page) {
                this.currentPage = parseInt(query.page) || 1
            }
            if (query.search) {
                this.search = query.search
            }
            if (query.sort_by) {
                this.sortConfig.key = query.sort_by
            }
            if (query.sort_order) {
                this.sortConfig.direction = query.sort_order
            }
            if (query.master) {
                this.filters.master = query.master
            }
            if (query.product_type) {
                this.filters.product_type = query.product_type
            }
            if (query.price_min) {
                this.filters.price_min = query.price_min
            }
            if (query.price_max) {
                this.filters.price_max = query.price_max
            }
        },
        
        updateURL() {
            const query = {}
            
            if (this.currentPage > 1) query.page = this.currentPage
            if (this.search) query.search = this.search
            if (this.sortConfig.key !== 'wb_revenue30') query.sort_by = this.sortConfig.key
            if (this.sortConfig.direction !== 'desc') query.sort_order = this.sortConfig.direction
            if (this.filters.master) query.master = this.filters.master
            if (this.filters.product_type) query.product_type = this.filters.product_type
            if (this.filters.price_min) query.price_min = this.filters.price_min
            if (this.filters.price_max) query.price_max = this.filters.price_max
            
            this.$router.push({ query })
        }
    }
}
</script>