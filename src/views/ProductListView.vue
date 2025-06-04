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
                        v-model="selectedMaster"
                        class="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Все мастера</option>
                        <option v-for="master in uniqueMasters" :key="master" :value="master">{{ master }}</option>
                    </select>
                    
                    <!-- Type filter -->
                    <select
                        v-model="selectedType"
                        class="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Все типы</option>
                        <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                    
                    <!-- Search field -->
                    <div class="w-96">
                        <div class="relative">
                            <input
                                type="text"
                                v-model="search"
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
            
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
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
                            <tr v-for="product in filteredAndSortedProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <div class="flex items-center">
                                        <span class="text-xs text-gray-400 dark:text-gray-500 mr-1">WB:</span>
                                        <span>{{ formatRating(product.wb_rating) }}</span>
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
import { useProductStore } from '@/store/productStore'
import { storeToRefs } from 'pinia'

export default {
    data() {
        return {
            search: '',
            selectedMaster: '',
            selectedType: '',
            sortConfig: {
                key: 'name',
                direction: 'asc'
            },
            columns: [
                { key: 'image', label: 'Изображение', sortable: false },
                { key: 'name', label: 'Товар', sortable: true },
                { key: 'master', label: 'Мастер', sortable: true },
                { key: 'prices', label: 'Цены', sortable: false },
                { key: 'wb_rating', label: 'Рейтинг', sortable: true }
            ]
        }
    },
    setup() {
        const productStore = useProductStore()
        const { products } = storeToRefs(productStore)

        // Load products when component is mounted
        productStore.load()

        return {
            products,
            productStore
        }
    },
    computed: {
        uniqueMasters() {
            if (!this.products) return []
            const masters = [...new Set(this.products.map(p => p.master).filter(Boolean))]
            return masters.sort()
        },
        uniqueTypes() {
            if (!this.products) return []
            const types = [...new Set(this.products.map(p => p.product_type).filter(Boolean))]
            return types.sort()
        },
        filteredAndSortedProducts() {
            if (!this.products) return []
            let filtered = [...this.products]
            
            // Apply search filter
            if (this.search) {
                const searchLower = this.search.toLowerCase()
                filtered = filtered.filter(product => 
                    product.name?.toLowerCase().includes(searchLower) ||
                    product.code?.toLowerCase().includes(searchLower) ||
                    product.wbid?.toString().toLowerCase().includes(searchLower)
                )
            }
            
            // Apply master filter
            if (this.selectedMaster) {
                filtered = filtered.filter(product => product.master === this.selectedMaster)
            }
            
            // Apply type filter
            if (this.selectedType) {
                filtered = filtered.filter(product => product.product_type === this.selectedType)
            }

            // Apply sorting
            return filtered.sort((a, b) => {
                let aValue = a[this.sortConfig.key]
                let bValue = b[this.sortConfig.key]

                // Handle null/undefined values
                if (aValue == null) aValue = ''
                if (bValue == null) bValue = ''

                // Convert to string for consistent comparison
                aValue = String(aValue)
                bValue = String(bValue)

                if (this.sortConfig.direction === 'asc') {
                    return aValue.localeCompare(bValue, 'ru', { numeric: true })
                }
                return bValue.localeCompare(aValue, 'ru', { numeric: true })
            })
        }
    },
    methods: {
        sort(key) {
            if (this.sortConfig.key === key) {
                this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc'
            } else {
                this.sortConfig.key = key
                this.sortConfig.direction = 'asc'
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
        truncateName(name) {
            if (!name) return '-'
            if (name.length <= 30) return name
            return name.substring(0, 30) + '...'
        }
    }
}
</script>