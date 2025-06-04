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
                        </div>

                        <!-- Right Column - Product Info -->
                        <div class="lg:col-span-2">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Информация о товаре</h2>
                            
                            <!-- Basic Info -->
                            <div class="space-y-4">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 class="font-medium text-gray-900 dark:text-white mb-3">Основная информация</h3>
                                    <div class="grid grid-cols-1 gap-3 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Мастер:</span>
                                            <span class="text-gray-900 dark:text-white font-medium">{{ product.master }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Тип товара:</span>
                                            <span class="text-gray-900 dark:text-white">{{ product.product_type }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Семейство:</span>
                                            <span class="text-gray-900 dark:text-white">{{ product.family || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Штрихкод:</span>
                                            <span class="text-gray-900 dark:text-white font-mono">{{ product.barcode }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600 dark:text-gray-400">Вес:</span>
                                            <span class="text-gray-900 dark:text-white">{{ product.weight }} кг</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- WB Info -->
                                <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <h3 class="font-medium text-purple-900 dark:text-purple-100 mb-3">Wildberries</h3>
                                    <div class="grid grid-cols-1 gap-3 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">Артикул WB:</span>
                                            <span class="text-purple-900 dark:text-purple-100 font-medium">{{ product.wbid }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">Цена:</span>
                                            <span class="text-purple-900 dark:text-purple-100 font-medium">{{ formatCurrency(product.wb_price) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">Цена на МП:</span>
                                            <span class="text-purple-900 dark:text-purple-100">{{ formatCurrency(product.wb_mp_price / 100) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">API цена:</span>
                                            <span class="text-purple-900 dark:text-purple-100">{{ formatCurrency(product.wb_api_price) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">Рейтинг:</span>
                                            <span class="text-purple-900 dark:text-purple-100 font-medium">{{ formatRating(product.wb_rating) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">Отзывы:</span>
                                            <span class="text-purple-900 dark:text-purple-100">{{ product.wb_feedbacks || 0 }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">Рентабельность:</span>
                                            <span class="text-purple-900 dark:text-purple-100 font-medium">{{ formatPercentage(product.wb_profitability) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">Продажи 7д:</span>
                                            <span class="text-purple-900 dark:text-purple-100">{{ product.wb_sales7 || 0 }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-purple-700 dark:text-purple-300">Продажи 30д:</span>
                                            <span class="text-purple-900 dark:text-purple-100">{{ product.wb_sales30 || 0 }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Ozon Info -->
                                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-3">Ozon</h3>
                                    <div class="grid grid-cols-1 gap-3 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-blue-700 dark:text-blue-300">Артикул Ozon:</span>
                                            <span class="text-blue-900 dark:text-blue-100 font-medium">{{ product.ozonid || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-blue-700 dark:text-blue-300">SKU:</span>
                                            <span class="text-blue-900 dark:text-blue-100">{{ product.ozonsku || '-' }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-blue-700 dark:text-blue-300">Цена:</span>
                                            <span class="text-blue-900 dark:text-blue-100 font-medium">{{ formatCurrency(product.ozon_price) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-blue-700 dark:text-blue-300">Рентабельность:</span>
                                            <span class="text-blue-900 dark:text-blue-100 font-medium">{{ formatPercentage(product.ozon_profitability) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-blue-700 dark:text-blue-300">Продажи 7д:</span>
                                            <span class="text-blue-900 dark:text-blue-100">{{ product.ozon_sales7 || 0 }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-blue-700 dark:text-blue-300">Продажи 30д:</span>
                                            <span class="text-blue-900 dark:text-blue-100">{{ product.ozon_sales30 || 0 }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Dimensions -->
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
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

                                <!-- Stocks -->
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 class="font-medium text-gray-900 dark:text-white mb-3">Остатки на складах</h3>
                                    <div v-if="loadingStocks" class="flex justify-center py-4">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                                    </div>
                                    <div v-else-if="stocks.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                                        Нет данных о складах
                                    </div>
                                    <div v-else class="space-y-6">
                                        <!-- Wildberries -->
                                        <div v-if="Object.keys(groupedStocks.wb).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-purple-900 dark:text-purple-100">Wildberries</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in groupedStocks.wb" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <span class="text-sm font-medium">Всего: {{ regionData.total }} шт.</span>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="warehouse in regionData.warehouses" :key="warehouse.warehouse_id" 
                                                             class="flex justify-between items-center text-sm">
                                                            <span class="text-gray-600 dark:text-gray-400">{{ warehouse.warehouse_name }}</span>
                                                            <span>{{ warehouse.qty }} шт.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Ozon -->
                                        <div v-if="Object.keys(groupedStocks.ozon).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-blue-900 dark:text-blue-100">Ozon</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in groupedStocks.ozon" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <span class="text-sm font-medium">Всего: {{ regionData.total }} шт.</span>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="warehouse in regionData.warehouses" :key="warehouse.warehouse_id" 
                                                             class="flex justify-between items-center text-sm">
                                                            <span class="text-gray-600 dark:text-gray-400">{{ warehouse.warehouse_name }}</span>
                                                            <span>{{ warehouse.qty }} шт.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- MS -->
                                        <div v-if="Object.keys(groupedStocks.ms).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-green-900 dark:text-green-100">MS</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in groupedStocks.ms" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <span class="text-sm font-medium">Всего: {{ regionData.total }} шт.</span>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="warehouse in regionData.warehouses" :key="warehouse.warehouse_id" 
                                                             class="flex justify-between items-center text-sm">
                                                            <span class="text-gray-600 dark:text-gray-400">{{ warehouse.warehouse_name }}</span>
                                                            <span>{{ warehouse.qty }} шт.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Goals -->
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 class="font-medium text-gray-900 dark:text-white mb-3">Цели продаж</h3>
                                    <div v-if="loadingGoals" class="flex justify-center py-4">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                                    </div>
                                    <div v-else-if="goals.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                                        Нет данных о целях продаж
                                    </div>
                                    <div v-else class="space-y-6">
                                        <!-- Wildberries -->
                                        <div v-if="Object.keys(groupedGoals.wb).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-purple-900 dark:text-purple-100">Wildberries</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in groupedGoals.wb" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <span class="text-sm font-medium">Всего: {{ regionData.total }} шт.</span>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="warehouse in regionData.warehouses" :key="warehouse.warehouse_id" 
                                                             class="flex justify-between items-center text-sm">
                                                            <div class="flex flex-col">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.warehouse_name }}</span>
                                                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                                                    на {{ warehouse.goal_days }} дн.
                                                                </span>
                                                            </div>
                                                            <span>{{ warehouse.sales_goal }} шт.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Ozon -->
                                        <div v-if="Object.keys(groupedGoals.ozon).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-blue-900 dark:text-blue-100">Ozon</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in groupedGoals.ozon" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <span class="text-sm font-medium">Всего: {{ regionData.total }} шт.</span>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="warehouse in regionData.warehouses" :key="warehouse.warehouse_id" 
                                                             class="flex justify-between items-center text-sm">
                                                            <div class="flex flex-col">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.warehouse_name }}</span>
                                                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                                                    на {{ warehouse.goal_days }} дн.
                                                                </span>
                                                            </div>
                                                            <span>{{ warehouse.sales_goal }} шт.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- MS -->
                                        <div v-if="Object.keys(groupedGoals.ms).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-green-900 dark:text-green-100">MS</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in groupedGoals.ms" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <span class="text-sm font-medium">Всего: {{ regionData.total }} шт.</span>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="warehouse in regionData.warehouses" :key="warehouse.warehouse_id" 
                                                             class="flex justify-between items-center text-sm">
                                                            <div class="flex flex-col">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.warehouse_name }}</span>
                                                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                                                    на {{ warehouse.goal_days }} дн.
                                                                </span>
                                                            </div>
                                                            <span>{{ warehouse.sales_goal }} шт.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Ads -->
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 class="font-medium text-gray-900 dark:text-white mb-3">Реклама</h3>
                                    <div v-if="loadingAds" class="flex justify-center py-4">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                                    </div>
                                    <div v-else-if="ads.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                                        Нет активной рекламы
                                    </div>
                                    <div v-else class="space-y-3">
                                        <div v-for="ad in ads" :key="ad.id" class="flex justify-between items-center">
                                            <div class="flex items-center space-x-2">
                                                <span class="text-sm">{{ ad.name }}</span>
                                                <span class="text-sm">{{ ad.id }}</span>
                                                <span :class="getAdStatusClass(ad.status_id)" 
                                                      class="px-2 py-0.5 text-xs font-medium rounded-full">
                                                    {{ getAdStatusText(ad.status_id) }}
                                                </span><br/>
                                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                                    {{ formatDate(ad.created_at) }}
                                                </span>
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

                                <!-- Supply Tasks -->
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 class="font-medium text-gray-900 dark:text-white mb-3">Поставки</h3>
                                    <div v-if="loadingSupplyTasks" class="flex justify-center py-4">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                                    </div>
                                    <div v-else-if="supplyTasks.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                                        Нет активных поставок
                                    </div>
                                    <div v-else class="space-y-3">
                                        <div v-for="task in supplyTasks" :key="task.id" class="flex justify-between items-center">
                                            <div class="flex items-center space-x-2">
                                                <span :class="getSupplyTaskStatusClass(task.status_id)" 
                                                      class="px-2 py-0.5 text-xs font-medium rounded-full">
                                                    {{ getSupplyTaskStatusText(task.status_id) }}
                                                </span>
                                                <span class="text-sm">{{ task.warehouse_name }}</span>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-sm font-medium">{{ task.qty }} шт.</div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400">
                                                    до {{ formatDate(task.estimated_date) }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Combined Stocks and Goals -->
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h3 class="font-medium text-gray-900 dark:text-white mb-3">Остатки и цели</h3>
                                    <div v-if="loadingStocks || loadingGoals" class="flex justify-center py-4">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                                    </div>
                                    <div v-else-if="stocks.length === 0 && goals.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                                        Нет данных об остатках и целях
                                    </div>
                                    <div v-else class="space-y-6">
                                        <!-- Wildberries -->
                                        <div v-if="Object.keys(combinedWarehouseData.wb).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-purple-900 dark:text-purple-100">Wildberries</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in combinedWarehouseData.wb" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center bg-gray-100 dark:bg-gray-600 p-2 rounded">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <div class="flex space-x-4">
                                                            <span class="text-sm">Остатки: {{ regionData.totalStocks }} шт.</span>
                                                            <span class="text-sm">Цели: {{ regionData.totalGoals }} шт.</span>
                                                        </div>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="(warehouse, id) in regionData.warehouses" :key="id" 
                                                             class="flex justify-between items-center text-sm border-b border-gray-200 dark:border-gray-600 py-1">
                                                            <div class="flex flex-col">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.name }}</span>
                                                                <span v-if="warehouse.goalDays" class="text-xs text-gray-500 dark:text-gray-400">
                                                                    на {{ warehouse.goalDays }} дн.
                                                                </span>
                                                            </div>
                                                            <div class="flex space-x-4">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.stocks }} шт.</span>
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.goals }} шт.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Ozon -->
                                        <div v-if="Object.keys(combinedWarehouseData.ozon).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-blue-900 dark:text-blue-100">Ozon</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in combinedWarehouseData.ozon" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center bg-gray-100 dark:bg-gray-600 p-2 rounded">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <div class="flex space-x-4">
                                                            <span class="text-sm">Остатки: {{ regionData.totalStocks }} шт.</span>
                                                            <span class="text-sm">Цели: {{ regionData.totalGoals }} шт.</span>
                                                        </div>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="(warehouse, id) in regionData.warehouses" :key="id" 
                                                             class="flex justify-between items-center text-sm border-b border-gray-200 dark:border-gray-600 py-1">
                                                            <div class="flex flex-col">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.name }}</span>
                                                                <span v-if="warehouse.goalDays" class="text-xs text-gray-500 dark:text-gray-400">
                                                                    на {{ warehouse.goalDays }} дн.
                                                                </span>
                                                            </div>
                                                            <div class="flex space-x-4">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.stocks }} шт.</span>
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.goals }} шт.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- MS -->
                                        <div v-if="Object.keys(combinedWarehouseData.ms).length > 0">
                                            <div class="flex items-center space-x-2 mb-2">
                                                <span class="text-sm font-medium text-green-900 dark:text-green-100">MS</span>
                                            </div>
                                            <div class="space-y-3 pl-4">
                                                <div v-for="(regionData, region) in combinedWarehouseData.ms" :key="region" class="space-y-2">
                                                    <div class="flex justify-between items-center bg-gray-100 dark:bg-gray-600 p-2 rounded">
                                                        <span class="text-sm font-medium">{{ region }}</span>
                                                        <div class="flex space-x-4">
                                                            <span class="text-sm">Остатки: {{ regionData.totalStocks }} шт.</span>
                                                            <span class="text-sm">Цели: {{ regionData.totalGoals }} шт.</span>
                                                        </div>
                                                    </div>
                                                    <div class="space-y-1 pl-4">
                                                        <div v-for="(warehouse, id) in regionData.warehouses" :key="id" 
                                                             class="flex justify-between items-center text-sm border-b border-gray-200 dark:border-gray-600 py-1">
                                                            <div class="flex flex-col">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.name }}</span>
                                                                <span v-if="warehouse.goalDays" class="text-xs text-gray-500 dark:text-gray-400">
                                                                    на {{ warehouse.goalDays }} дн.
                                                                </span>
                                                            </div>
                                                            <div class="flex space-x-4">
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.stocks }} шт.</span>
                                                                <span class="text-gray-600 dark:text-gray-400">{{ warehouse.goals }} шт.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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

<script>
import { useProductStore } from '@/store/productStore'
import mpr from '@/tools/mpr'

export default {
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
            loadingSupplyTasks: true
        }
    },
    async mounted() {
        await this.loadProduct()
        if (this.product) {
            await Promise.all([
                this.loadStocks(),
                this.loadGoals(),
                this.loadAds(),
                this.loadSupplyTasks()
            ])
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
        }
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
            const combined = {
                wb: {},
                ozon: {},
                ms: {}
            }

            // Initialize with stocks data
            this.stocks.forEach(stock => {
                const marketplace = stock.warehouse_type
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

            // Add goals data
            this.goals.forEach(goal => {
                const marketplace = goal.warehouse_type
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

            return combined
        }
    }
}
</script>