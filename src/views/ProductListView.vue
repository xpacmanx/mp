<template>
<div class="product-list-container">
    <div class="toolbar mb-6 flex-between">
        <h2 class="page-title">СПИСОК ПРОДУКТОВ <span class="jp-title">製品リスト</span></h2>
        
        <!-- Search and filters -->
        <div class="flex gap-4 items-center">
            <!-- Master filter -->
            <div class="filter-group">
                <select
                    v-model="filters.master"
                    @change="loadProductsAndUpdateURL"
                    class="tactical-select"
                >
                    <option value="">ВСЕ МАСТЕРА</option>
                    <option v-for="master in uniqueMasters" :key="master" :value="master">{{ master }}</option>
                </select>
            </div>
            
            <!-- Type filter -->
            <div class="filter-group">
                <select
                    v-model="filters.product_type"
                    @change="loadProductsAndUpdateURL"
                    class="tactical-select"
                >
                    <option value="">ВСЕ ТИПЫ</option>
                    <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
                </select>
            </div>
            
            <!-- Price range filter -->
            <div class="flex gap-2">
                <input
                    type="number"
                    v-model="filters.price_min"
                    placeholder="Цена от"
                    @change="loadProductsAndUpdateURL"
                    class="tactical-input w-24"
                />
                <input
                    type="number"
                    v-model="filters.price_max"
                    placeholder="Цена до"
                    @change="loadProductsAndUpdateURL"
                    class="tactical-input w-24"
                />
            </div>
            
            <!-- Search field -->
            <div class="w-80 relative">
                <input
                    type="text"
                    v-model="search"
                    @input="debounceSearch"
                    placeholder="ПОИСК..."
                    class="tactical-input w-full pl-10"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search class="h-4 w-4 text-muted" />
                </div>
            </div>
        </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading && !products.length" class="flex justify-center items-center py-20">
        <RefreshCw class="animate-spin text-accent" size="32" />
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="tactical-alert error mb-4">
        <div class="flex items-center">
            <AlertCircle class="h-5 w-5 text-danger mr-3" />
            <div>
                <h3 class="text-sm font-medium text-danger">ОШИБКА ЗАГРУЗКИ</h3>
                <div class="mt-1 text-sm text-muted">
                    {{ error }}
                </div>
            </div>
        </div>
    </div>
    
    <TacticalCard v-if="!error && (products.length || !loading)" class="mb-8">
        <TacticalTable 
            :columns="columns" 
            :data="products"
            @header-click="handleSort"
        >
            <!-- Header Icon Slot -->
            <template #header-icon="{ column }">
                <span v-if="column.sortable" class="ml-1 inline-block align-middle">
                    <template v-if="sortConfig.key === column.key">
                        <ArrowUp v-if="sortConfig.direction === 'asc'" size="12" />
                        <ArrowDown v-else size="12" />
                    </template>
                    <ChevronsUpDown v-else size="12" class="text-muted opacity-50" />
                </span>
            </template>

            <!-- Image Column -->
            <template #image="{ row }">
                <div class="h-12 w-12 bg-panel border border-subtle rounded flex items-center justify-center overflow-hidden">
                    <img 
                        v-if="row.pics && row.pics[0] && row.pics[0].tm" 
                        :src="row.pics[0].tm" 
                        :alt="row.name"
                        class="h-full w-full object-cover"
                    />
                    <span v-else class="text-muted text-xs">NO IMG</span>
                </div>
            </template>

            <!-- Name Column -->
            <template #name="{ row }">
                <div class="flex flex-col">
                    <router-link 
                        :to="'/products/' + row.id"
                        class="text-sm font-medium text-accent hover:underline hover:text-accent-bright"
                        :title="row.name"
                    >
                        {{ truncateName(row.name) }}
                    </router-link>
                    <div class="mt-1 text-xs text-muted font-mono">
                        <span class="mr-2">CODE: {{ row.code }}</span>
                        <span v-if="row.wbid">WBID: {{ row.wbid }}</span>
                    </div>
                </div>
            </template>

            <!-- Master Column -->
            <template #master="{ row }">
                <span class="text-sm text-primary">{{ row.master }}</span>
            </template>

            <!-- Revenue Column -->
            <template #revenue="{ row }">
                <div class="flex flex-col space-y-1 font-mono text-xs">
                    <div class="flex justify-between w-32">
                        <span class="text-muted">WB:</span>
                        <span class="text-primary">{{ formatCurrency(row.wb_revenue30) }}</span>
                    </div>
                    <div class="flex justify-between w-32">
                        <span class="text-muted">OZ:</span>
                        <span class="text-primary">{{ formatCurrency(row.ozon_revenue30) }}</span>
                    </div>
                </div>
            </template>

            <!-- Profitability Column -->
            <template #profitability="{ row }">
                <div class="flex flex-col space-y-1 font-mono text-xs">
                    <div class="flex justify-between w-24">
                        <span class="text-muted">WB:</span>
                        <span :class="getProfitabilityClass(row.wb_profitability)">{{ formatPercentage(row.wb_profitability) }}</span>
                    </div>
                    <div class="flex justify-between w-24">
                        <span class="text-muted">OZ:</span>
                        <span :class="getProfitabilityClass(row.ozon_profitability)">{{ formatPercentage(row.ozon_profitability) }}</span>
                    </div>
                </div>
            </template>

            <!-- Rating Column -->
            <template #wb_rating="{ row }">
                <div class="flex items-center font-mono text-xs">
                    <Star class="w-3 h-3 text-warning mr-1" fill="currentColor" />
                    <span>{{ formatRating(row.wb_rating) }}</span>
                </div>
            </template>

        </TacticalTable>
        
        <!-- Pagination -->
        <div class="px-4 py-3 flex items-center justify-between border-t border-subtle">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-xs text-muted font-mono">
                        SHOWING <span class="text-primary">{{ ((currentPage - 1) * pageSize) + 1 }}</span> 
                        TO <span class="text-primary">{{ Math.min(currentPage * pageSize, totalItems) }}</span> 
                        OF <span class="text-primary">{{ totalItems }}</span> RESULTS
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <TacticalButton 
                            variant="secondary" 
                            size="sm"
                            @click="changePage(currentPage - 1)"
                            :disabled="currentPage <= 1"
                            class="rounded-l-md"
                        >
                            <ChevronLeft size="14" />
                        </TacticalButton>
                        
                        <template v-for="page in visiblePages" :key="page">
                            <TacticalButton
                                v-if="page !== '...'"
                                :variant="page === currentPage ? 'primary' : 'secondary'"
                                size="sm"
                                @click="changePage(page)"
                                class="mx-0.5"
                            >
                                {{ page }}
                            </TacticalButton>
                            <span v-else class="relative inline-flex items-center px-2 py-1 text-xs font-medium text-muted">
                                ...
                            </span>
                        </template>
                        
                        <TacticalButton 
                            variant="secondary" 
                            size="sm"
                            @click="changePage(currentPage + 1)"
                            :disabled="currentPage >= totalPages"
                            class="rounded-r-md"
                        >
                            <ChevronRight size="14" />
                        </TacticalButton>
                    </nav>
                </div>
            </div>
        </div>
    </TacticalCard>
</div>
</template>

<script>
import mpr from '@/tools/mpr'
import TacticalTable from '@/components/TacticalTable.vue'
import TacticalButton from '@/components/TacticalButton.vue'
import TacticalCard from '@/components/TacticalCard.vue'
import { 
    Search, RefreshCw, AlertCircle, ArrowUp, ArrowDown, 
    ChevronsUpDown, Star, ChevronLeft, ChevronRight 
} from 'lucide-vue-next'

export default {
    components: {
        TacticalTable,
        TacticalButton,
        TacticalCard,
        Search,
        RefreshCw,
        AlertCircle,
        ArrowUp,
        ArrowDown,
        ChevronsUpDown,
        Star,
        ChevronLeft,
        ChevronRight
    },
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
                { key: 'image', label: 'IMG', sortable: false, class: 'w-16' },
                { key: 'name', label: 'PRODUCT', sortable: true },
                { key: 'master', label: 'MASTER', sortable: true },
                { key: 'revenue', label: 'REVENUE (30D)', sortable: false },
                { key: 'profitability', label: 'PROFIT', sortable: false },
                { key: 'wb_rating', label: 'RATING', sortable: true, class: 'w-24' }
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
        
        handleSort(key) {
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

        getProfitabilityClass(value) {
            if (!value && value !== 0) return 'text-muted'
            const percentage = value * 100
            if (percentage >= 20) return 'text-success'
            if (percentage >= 10) return 'text-warning'
            return 'text-danger'
        },
        
        truncateName(name) {
            if (!name) return '-'
            if (name.length <= 40) return name
            return name.substring(0, 40) + '...'
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

<style scoped>
.product-list-container {
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

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tactical-select, .tactical-input {
    background-color: var(--color-bg-panel);
    border: 1px solid var(--color-border-subtle);
    color: var(--color-text-primary);
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    padding: var(--spacing-2) var(--spacing-3);
    outline: none;
    transition: all 0.2s ease;
}

.tactical-select:focus, .tactical-input:focus {
    border-color: var(--color-accent-primary);
    box-shadow: var(--shadow-glow-primary);
}

.tactical-alert {
    padding: var(--spacing-4);
    border: 1px solid;
    background-color: rgba(255, 59, 48, 0.1);
    border-color: rgba(255, 59, 48, 0.3);
}

.text-accent { color: var(--color-accent-primary); }
.text-accent-bright { color: #33f3ff; }
.text-warning { color: var(--color-accent-warning); }
.text-success { color: var(--color-accent-success); }
.text-danger { color: var(--color-accent-danger); }
.text-muted { color: var(--color-text-muted); }
.text-primary { color: var(--color-text-primary); }

.bg-panel { background-color: var(--color-bg-panel); }
.border-subtle { border-color: var(--color-border-subtle); }
</style>