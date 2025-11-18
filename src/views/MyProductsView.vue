<template>
<div class="min-h-full bg-gray-50 dark:bg-gray-900">
    <div class="py-10">
        <div class="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Мои продукты</h2>
                
                <!-- Search and filters -->
                <div class="flex space-x-4">
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
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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
            
            <!-- Placeholder content for now -->
            <div v-if="!error && !loading" class="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Мои продукты</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Здесь будут отображаться продукты, которые вы создали или к которым у вас есть доступ.
                    </p>
                    <div class="mt-6">
                        <button
                            type="button"
                            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Добавить продукт
                        </button>
                    </div>
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
                product_type: '',
                price_min: '',
                price_max: ''
            },
            uniqueTypes: [],
            filtersLoaded: false
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
                    sort_order: this.sortConfig.direction,
                    my_products: true // Флаг для получения только моих продуктов
                }
                
                // Add search
                if (this.search.trim()) {
                    params.search = this.search.trim()
                }
                
                // Add filters
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
                    url: '/products/my',
                    params: params
                })
                
                this.products = response.data.result || []
                this.totalItems = response.data.pagination?.total || 0
                this.totalPages = response.data.pagination?.total_pages || 0
                this.currentPage = response.data.pagination?.page || 1
                
            } catch (error) {
                console.error('Error loading my products:', error)
                this.products = []
                this.totalItems = 0
                this.totalPages = 0
                this.error = error.response?.data?.message || error.message || 'Ошибка загрузки моих продуктов'
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
                // Load unique types from dedicated filters endpoint
                const response = await mpr({ 
                    url: '/products/filters'
                })
                
                this.uniqueTypes = response.data.filters?.product_types || []
                this.filtersLoaded = true
                
            } catch (error) {
                console.error('Error loading filters:', error)
                // Fallback: try to get filters from the first page of products
                try {
                    const fallbackResponse = await mpr({ 
                        url: '/products/my',
                        params: { page: 1, page_size: 1000 }
                    })
                    
                    const allProducts = fallbackResponse.data.result || []
                    
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
            if (this.filters.product_type) query.product_type = this.filters.product_type
            if (this.filters.price_min) query.price_min = this.filters.price_min
            if (this.filters.price_max) query.price_max = this.filters.price_max
            
            this.$router.push({ query })
        }
    }
}
</script> 