<template>
    <div class="min-h-full">
        <Header />

        <div class="py-6">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div v-if="adData" class="min-h-screen">
                    <!-- Redesigned Header section -->
                    <div class="mb-8">
                        <!-- Campaign Name and Basic Info -->
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ adData.name }}</h1>
                                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Код: {{ adData.code }}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-500">Последнее обновление: {{ formatDate(adData.updated_at) }}</p>
                            </div>
                        </div>

                        <!-- Campaign Status and Progress Row -->
                        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                            <!-- Current Step -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Текущий этап</h3>
                                        <div class="mt-2">
                                            <span :class="getCampaignStatusClass(adData.step_date, adData.profitability)" 
                                                  class="px-3 py-1 text-sm font-medium rounded-full">
                                                {{ getCampaignStatusText(adData.step_date, adData.profitability) }}
                                            </span>
                                        </div>
                                        <div v-if="showProgressBar(adData.step_date)" class="mt-3">
                                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div :class="getProgressBarColor(adData.step_date, adData.profitability)" 
                                                     class="h-2 rounded-full transition-all duration-300" 
                                                     :style="{ width: getProgressBarWidth(adData.step_date) + '%' }">
                                                </div>
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Осталось {{ getRemainingDays(adData.step_date) }} дней
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Current Status -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Статус рекламы</h3>
                                <div class="mt-2">
                                    <span :class="getStatusClass(adData.status_id)" class="px-3 py-1 text-sm font-medium rounded-full">
                                        {{ getStatusText(adData.status_id) }}
                                    </span>
                                </div>
                                <div class="mt-3">
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Тип: {{ adData.type === 8 ? 'Авто' : 'Поиск' }}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Товар: {{ adData.product_type || '-' }}</p>
                                </div>
                            </div>

                            <!-- DRR -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">ДРР</h3>
                                <div class="mt-2">
                                    <span :class="getDrrClass(adData.drr)" class="text-2xl font-bold">
                                        {{ formatDrr(adData.drr) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Profitability -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Рентабельность</h3>
                                <div class="mt-2">
                                    <span :class="getProfitabilityClass(adData.profitability)" class="text-2xl font-bold">
                                        {{ formatProfitability(adData.profitability) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Revenue and Orders Row -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <!-- Expected Revenue -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Ожидаемая касса</h3>
                                <div class="mt-2">
                                    <span class="text-2xl font-bold text-gray-900 dark:text-white">
                                        {{ formatCurrency(adData.expected_revenue) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Orders 7 days -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Заказы по 7 дней</h3>
                                <div class="mt-2">
                                    <span class="text-2xl font-bold text-gray-900 dark:text-white">
                                        {{ formatCurrency(adData.revenue7) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Orders Yesterday -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Заказы по вчера</h3>
                                <div class="mt-2">
                                    <span class="text-2xl font-bold text-gray-900 dark:text-white">
                                        {{ formatCurrency(adData.revenue1) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Settings Row -->
                        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                            <!-- Current CPM -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Текущий CPM</h3>
                                        <div class="mt-2">
                                            <span class="text-xl font-bold text-gray-900 dark:text-white">
                                                {{ formatCpm(adData.current_cpm) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Bot Status -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Автоминусация</h3>
                                <div class="mt-2 flex items-center">
                                    <button 
                                        @click="toggleBot" 
                                        class="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"
                                        :class="adData.bot_enabled ? 'bg-blue-600' : 'bg-gray-200'"
                                    >
                                        <span 
                                            class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"
                                            :class="adData.bot_enabled ? 'translate-x-6' : 'translate-x-1'"
                                        ></span>
                                    </button>
                                    <span class="ml-2 text-sm font-medium" :class="adData.bot_enabled ? 'text-blue-600' : 'text-gray-500'">
                                        {{ adData.bot_enabled ? 'Вкл' : 'Выкл' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Min CTR -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Мин CTR</h3>
                                        <div class="mt-2">
                                            <span class="text-xl font-bold text-gray-900 dark:text-white">
                                                {{ formatCtr(adData.min_ctr) }}
                                            </span>
                                        </div>
                                    </div>
                                    <button @click="changeMinCtr" class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                                        Изменить
                                    </button>
                                </div>
                            </div>

                            <!-- Views to Minus -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Мин Просмотры</h3>
                                        <div class="mt-2">
                                            <span class="text-xl font-bold text-gray-900 dark:text-white">
                                                {{ (adData.views_to_minus || 0).toLocaleString() }}
                                            </span>
                                        </div>
                                    </div>
                                    <button @click="changeViewsToMinus" class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                                        Изменить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Metrics Chart (Campaign) -->
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4 mb-8">
                        <h3 class="font-medium text-gray-900 dark:text-white mb-3">Метрики товара</h3>
                        <div class="flex flex-wrap gap-4 mb-4">
                            <label v-for="opt in metricsOptions" :key="opt.key" class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" v-model="opt.checked" @change="debouncedRenderMetricsChart" :disabled="isRenderingChart" />
                                <span :style="{ color: opt.color }">{{ opt.label }}</span>
                            </label>
                        </div>
                        <div v-if="loadingMetrics" class="w-full h-48 bg-gray-100 dark:bg-gray-700 animate-pulse rounded"></div>
                        <canvas v-else ref="metricsChart" height="80"></canvas>
                    </div>

                    <!-- Comments and Related Campaigns Section -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Comments Section -->
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div class="p-6">
                                <div class="flex justify-between items-center mb-4">
                                    <h2 class="text-lg font-medium text-gray-900 dark:text-white">Комментарии</h2>
                                    <button
                                        @click="showCommentForm = true"
                                        v-if="!showCommentForm"
                                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:hover:bg-blue-500"
                                    >
                                        Добавить комментарий
                                    </button>
                                </div>
                                
                                <!-- Comment Form -->
                                <div v-if="showCommentForm" class="mb-6">
                                    <div class="flex items-start space-x-4">
                                        <div class="min-w-0 flex-1">
                                            <div class="relative">
                                                <textarea
                                                    rows="3"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                    placeholder="Добавить комментарий..."
                                                    v-model="newComment"
                                                ></textarea>
                                            </div>
                                            <div class="mt-3 flex items-center justify-end space-x-3">
                                                <button
                                                    @click="showCommentForm = false"
                                                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-500"
                                                >
                                                    Отмена
                                                </button>
                                                <button
                                                    @click="addComment"
                                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:hover:bg-blue-500"
                                                >
                                                    Отправить
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Comments List -->
                                <div class="space-y-4">
                                    <div v-for="comment in comments" :key="comment.id" class="flex space-x-3">
                                        <div class="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
                                            <div class="flex items-center justify-between mb-1">
                                                <p class="text-sm text-gray-700 dark:text-gray-300 flex-grow">
                                                    {{ comment.comment }}
                                                </p>
                                                <div class="flex items-center ml-4 space-x-4">
                                                    <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                        {{ formatDate(comment.created_at) }}
                                                    </span>
                                                    <button 
                                                        @click="deleteComment(comment.id)"
                                                        class="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!comments.length" class="text-center text-gray-500 dark:text-gray-400">
                                        Нет комментариев
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Related Campaigns Section -->
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div class="p-6">
                                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Другие кампании</h2>
                                
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead class="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Название
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Статус
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Тип
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    ДРР
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Действия
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr v-for="campaign in relatedCampaigns" :key="campaign.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    <router-link 
                                                        :to="'/adv/' + campaign.id" 
                                                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline"
                                                    >
                                                        {{ campaign.name }}
                                                    </router-link>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span :class="getStatusClass(campaign.status_id)" class="px-2 py-1 text-xs font-medium rounded-full">
                                                        {{ getStatusText(campaign.status_id) }}
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {{ campaign.type === 8 ? 'Авто' : 'Поиск' }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getDrrClass(campaign.drr)">
                                                    {{ formatDrr(campaign.drr) }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    <router-link 
                                                        :to="'/adv/' + campaign.id" 
                                                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                                    >
                                                        Просмотр
                                                    </router-link>
                                                </td>
                                            </tr>
                                            <tr v-if="relatedCampaigns.length === 0">
                                                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    Нет связанных кампаний
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Statistics Section -->
                    <div class="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div class="p-6">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Статистика ключевых слов за 30 дней</h2>
                            
                            <!-- Search field -->
                            <div class="mb-4">
                                <div class="relative">
                                    <input
                                        type="text"
                                        v-model="statsSearch"
                                        placeholder="Поиск по ключевым словам..."
                                        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="overflow-x-auto">
                                <div class="max-h-[600px] overflow-y-auto relative">
                                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('keyword')">
                                                    <div class="flex items-center">
                                                    Ключевое слово
                                                        <span class="ml-1">
                                                            <template v-if="getSortIcon('keyword', statsSort) === 'asc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                                            </template>
                                                            <template v-else-if="getSortIcon('keyword', statsSort) === 'desc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </template>
                                                            <template v-else>
                                                                <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                                            </template>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('views')">
                                                    <div class="flex items-center">
                                                    Просмотры
                                                        <span class="ml-1">
                                                            <template v-if="getSortIcon('views', statsSort) === 'asc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                                            </template>
                                                            <template v-else-if="getSortIcon('views', statsSort) === 'desc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </template>
                                                            <template v-else>
                                                                <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                                            </template>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('clicks')">
                                                    <div class="flex items-center">
                                                    Клики
                                                        <span class="ml-1">
                                                            <template v-if="getSortIcon('clicks', statsSort) === 'asc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                                            </template>
                                                            <template v-else-if="getSortIcon('clicks', statsSort) === 'desc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </template>
                                                            <template v-else>
                                                                <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                                            </template>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('ctr')">
                                                    <div class="flex items-center">
                                                        CTR
                                                        <span class="ml-1">
                                                            <template v-if="getSortIcon('ctr', statsSort) === 'asc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                                            </template>
                                                            <template v-else-if="getSortIcon('ctr', statsSort) === 'desc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </template>
                                                            <template v-else>
                                                                <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                                            </template>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('inMinus')">
                                                    <div class="flex items-center">
                                                        Действия
                                                        <span class="ml-1">
                                                            <template v-if="getSortIcon('inMinus', statsSort) === 'asc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                                            </template>
                                                            <template v-else-if="getSortIcon('inMinus', statsSort) === 'desc'">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </template>
                                                            <template v-else>
                                                                <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                                            </template>
                                                        </span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr v-for="stat in filteredKeywordStats" :key="stat.keyword" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {{ stat.keyword }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {{ (stat.views || 0).toLocaleString() }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {{ (stat.clicks || 0).toLocaleString() }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getCtrClass(stat.ctr)">
                                                    {{ formatCtr(stat.ctr) }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                    <template v-if="isInMinusWords(stat.keyword)">
                                                        <span class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                                            Уже в минусе
                                                        </span>
                                                    </template>
                                                    <button 
                                                        v-else
                                                        @click="addToMinusWords(stat.keyword)"
                                                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                                        :disabled="loading.addingToMinus === stat.keyword"
                                                    >
                                                        <template v-if="loading.addingToMinus === stat.keyword">
                                                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Добавление...
                                                        </template>
                                                        <template v-else>
                                                            Убрать
                                                        </template>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr v-if="filteredKeywordStats.length === 0">
                                                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    {{ statsSearch ? 'Нет результатов по вашему запросу' : 'Нет данных' }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div class="p-6">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Топ ключевых фраз</h2>
                            
                            <div class="overflow-x-auto">
                                <div class="max-h-[600px] overflow-y-auto relative">
                                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('keyword')">
                                                    <div class="flex items-center">
                                                    Ключевое слово
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('views')">
                                                    <div class="flex items-center">
                                                    Рекламная позиция
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('clicks')">
                                                    <div class="flex items-center">
                                                    Органическая позиция
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('ctr')">
                                                    <div class="flex items-center">
                                                        Ставка
                                                    </div>
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="setSortStats('inMinus')">
                                                    <div class="flex items-center">
                                                        Действия
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr v-for="top_keyword in adData.top_keywords" :key="top_keyword.keyword" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {{ top_keyword.keyword }}<br/>
                                                    <span class="text-xsm text-gray-400 dark:text-gray-300">{{ formatDate(top_keyword.date) }}</span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {{ (top_keyword.promo_position || 0).toLocaleString() }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {{ (top_keyword.position || 0).toLocaleString() }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span v-if="top_keyword.cpm == adData.current_cpm" class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                                        Совпадает с текущей ({{ top_keyword.cpm }})
                                                    </span>
                                                    <span v-else class="text-red-600">{{ top_keyword.cpm }}</span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                    <template v-if="isInMinusWords(top_keyword.keyword)">
                                                        <span class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                                            Уже в минусе
                                                        </span>
                                                    </template>
                                                    <button 
                                                        v-else
                                                        @click="addToMinusWords(top_keyword.keyword)"
                                                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                                        :disabled="loading.addingToMinus === top_keyword.keyword"
                                                    >
                                                        <template v-if="loading.addingToMinus === top_keyword.keyword">
                                                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Добавление...
                                                        </template>
                                                        <template v-else>
                                                            Убрать
                                                        </template>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr v-if="adData.top_keywords.length === 0">
                                                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    {{ statsSearch ? 'Нет результатов по вашему запросу' : 'Нет данных' }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Words Tables -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Minus Words - Make it take 2/3 of the space -->
                        <div class="bg-white shadow rounded-lg lg:col-span-2">
                            <div class="p-6">
                                <div class="flex justify-between items-center mb-4">
                                    <h2 class="text-lg font-medium text-gray-900">Минус слова ({{ minusWords.length }} из 1000)</h2>
                                    <div class="flex space-x-2">
                                        <button 
                                            v-if="selectedMinusWords.length > 0"
                                            @click="deleteSelectedMinusWords"
                                            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            :disabled="loading.deletingSelectedWords"
                                        >
                                            <template v-if="loading.deletingSelectedWords">
                                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Удаление...
                                            </template>
                                            <template v-else>
                                                Удалить выбранные ({{ selectedMinusWords.length }})
                                            </template>
                                        </button>
                                        <button 
                                            @click="showRestoreMinusWordsModal"
                                            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Вернуть с CTR выше текущего
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Search field -->
                                <div class="mb-4">
                                    <div class="relative">
                                        <input
                                            type="text"
                                            v-model="minusWordsSearch"
                                            placeholder="Поиск по минус-словам..."
                                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="overflow-x-auto">
                                    <div class="max-h-[400px] overflow-y-auto">
                                        <table class="min-w-full divide-y divide-gray-200">
                                            <thead class="bg-gray-50 sticky top-0 z-10">
                                                <tr>
                                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-10">
                                                        <input 
                                                            type="checkbox" 
                                                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            :checked="filteredMinusWords.length > 0 && selectedMinusWords.length === filteredMinusWords.length"
                                                            :indeterminate="selectedMinusWords.length > 0 && selectedMinusWords.length < filteredMinusWords.length"
                                                            @change="toggleAllMinusWords"
                                                        />
                                                    </th>
                                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer w-3/4" @click="setSortMinusWords('word')">
                                                        <div class="flex items-center">
                                                        Слово
                                                            <span class="ml-1">
                                                                <template v-if="getSortIcon('word', minusWordsSort) === 'asc'">
                                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                                                </template>
                                                                <template v-else-if="getSortIcon('word', minusWordsSort) === 'desc'">
                                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                                </template>
                                                                <template v-else>
                                                                    <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                                                </template>
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <!-- <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer w-1/12" @click="setSortMinusWords('ctr')">
                                                        <div class="flex items-center">
                                                            CTR
                                                            <span class="ml-1">
                                                                <template v-if="getSortIcon('ctr', minusWordsSort) === 'asc'">
                                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                                                                </template>
                                                                <template v-else-if="getSortIcon('ctr', minusWordsSort) === 'desc'">
                                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                                                </template>
                                                                <template v-else>
                                                                    <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                                                </template>
                                                            </span>
                                                        </div>
                                                    </th> -->
                                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-1/12">
                                                        Действия
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-white divide-y divide-gray-200">
                                                <tr v-for="word in filteredMinusWords" :key="word" class="hover:bg-gray-50">
                                                    <td class="px-4 py-4 whitespace-nowrap">
                                                        <input 
                                                            type="checkbox" 
                                                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            :checked="selectedMinusWords.includes(word)"
                                                            @change="toggleMinusWord(word)"
                                                        />
                                                    </td>
                                                    <td class="px-4 py-4 text-sm text-gray-500 break-all">
                                                        {{ word }}
                                                    </td>
                                                    <!-- <td class="px-4 py-4 whitespace-nowrap text-sm" :class="getCtrClass(getWordCtr(word))">
                                                        {{ formatCtr(getWordCtr(word)) }}
                                                    </td> -->
                                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button 
                                                            @click="deleteMinusWord(word)" 
                                                            class="text-red-600 hover:text-red-900"
                                                            :disabled="loading.deletingWord === word"
                                                        >
                                                            <template v-if="loading.deletingWord === word">
                                                                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            </template>
                                                            <template v-else>
                                                                Удалить
                                                            </template>
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr v-if="filteredMinusWords.length === 0">
                                                    <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                                                        {{ minusWordsSearch ? 'Нет результатов по вашему запросу' : 'Нет минус-слов' }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Trusted Words - Make it take 1/3 of the space -->
                        <div class="bg-white shadow rounded-lg">
                            <div class="p-6">
                                <div class="flex justify-between items-center mb-4">
                                    <h2 class="text-lg font-medium text-gray-900">Проверенные слова</h2>
                                    <button 
                                        @click="addTrustedWord"
                                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Добавить
                                    </button>
                                </div>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    <div v-for="word in trustedWords" :key="word" class="inline-flex items-center bg-blue-50 rounded-full px-3 py-1 max-w-full">
                                        <span class="text-sm text-blue-700 truncate">{{ word }}</span>
                                        <button 
                                            @click="deleteTrustedWord(word)"
                                            class="ml-2 text-blue-400 hover:text-blue-600 flex-shrink-0"
                                            :disabled="loading.deletingTrustedWord === word"
                                        >
                                            <template v-if="loading.deletingTrustedWord === word">
                                                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </template>
                                            <template v-else>
                                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </template>
                                        </button>
                                    </div>
                                    <div v-if="!trustedWords.length" class="text-sm text-gray-500 py-2">
                                                        Нет проверенных слов
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Loading state -->
                <div v-else class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </div>
        </div>

        <LoadingBar 
            :loading="loading.global" 
            :progress="loadingProgress" 
        />

        <!-- Add this modal at the end of the template -->
        <div v-if="showRestoreModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-gray-900">Восстановление минус-слов с CTR выше {{ adData.min_ctr * 100 }}%</h3>
                    <button @click="showRestoreModal = false" class="text-gray-400 hover:text-gray-500">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div class="px-6 py-4 flex-grow overflow-auto">
                    <div v-if="loading.checkingMinusWords" class="flex justify-center items-center py-10">
                        <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="ml-2 text-gray-600">Загрузка данных...</span>
                    </div>
                    
                    <div v-else-if="restorableMinusWords.length === 0" class="text-center py-10 text-gray-500">
                        Нет минус-слов с CTR выше текущего порога
                    </div>
                    
                    <table v-else class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input 
                                        type="checkbox" 
                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        :checked="selectedRestoreWords.length === restorableMinusWords.length && restorableMinusWords.length > 0"
                                        :indeterminate="selectedRestoreWords.length > 0 && selectedRestoreWords.length < restorableMinusWords.length"
                                        @change="toggleAllRestoreWords"
                                    />
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ключевое слово
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    CTR
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Просмотры
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Дата
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Статус
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="word in restorableMinusWords" :key="word.keyword" class="hover:bg-gray-50">
                                <td class="px-4 py-4 whitespace-nowrap">
                                    <input 
                                        type="checkbox" 
                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        :checked="selectedRestoreWords.includes(word.keyword)"
                                        @change="toggleRestoreWord(word.keyword)"
                                    />
                                </td>
                                <td class="px-4 py-4 text-sm text-gray-900">
                                    {{ word.keyword }}
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm">
                                    {{ formatCtr(word.ctr) }}
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ word.views }}
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(word.date, 'short') }}
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span v-if="word.force" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        Исключение: {{ word.reason || 'Не указана' }}
                                    </span>
                                    <span v-else>-</span>
                                </td>
                            </tr>
                            <tr v-if="restorableMinusWords.length === 0">
                                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                                    Нет минус-слов с CTR выше текущего порога
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="px-6 py-4 border-t border-gray-200 flex justify-between">
                    <button @click="showRestoreModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Отмена
                    </button>
                    <button 
                        @click="restoreSelectedMinusWords" 
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        :disabled="selectedRestoreWords.length === 0 || loading.restoringWords"
                    >
                        <template v-if="loading.restoringWords">
                            <svg class="animate-spin -ml-1 mr-2 inline-block h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Восстановление...
                        </template>
                        <template v-else>
                            Вернуть выделенные слова ({{ selectedRestoreWords.length }})
                        </template>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/navigation/Header.vue'
import LoadingBar from '@/components/LoadingBar.vue'
import Chart from 'chart.js/auto'
import mpr from './../tools/mpr'

function debounce(fn, delay) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

export default {
    name: 'AdvDetailsView',
    components: {
        Header,
        LoadingBar
    },
    data() {
        return {
            adData: null,
            stats: [],
            comments: [],
            relatedCampaigns: [],
            newComment: '',
            showCommentForm: false,
            selectedMinusWords: [],
            loading: {
                global: false,
                progress: 0,
                deletingWord: null,
                deletingSelectedWords: false,
                addingToMinus: false,
                changingDate: false,
                syncingStats: false,
                addingComment: false,
                deletingComment: false,
                deletingTrustedWord: null,
                restoringWords: false,
                checkingMinusWords: false,
            },
            statsSort: {
                field: 'views',
                direction: 'desc'
            },
            minusWordsSort: {
                field: 'word',
                direction: 'asc'
            },
            statsSearch: '',
            minusWordsSearch: '',
            showRestoreModal: false,
            selectedRestoreWords: [],
            restorableMinusWords: [],
            metrics: [],
            metricsChart: null,
            metricsOptions: [
                { key: 'total_orders_per_day', label: 'Кол-во заказов в день', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)', checked: false },
                { key: 'total_amount_per_day', label: 'Выручка в день', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', checked: true },
                { key: 'average_price_per_order', label: 'Ср. цена заказа', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)', checked: false },
                { key: 'marketing_amount_per_day', label: 'Маркетинг (₽/день)', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)', checked: false },
                { key: 'marketing_percent', label: '% на маркетинг', color: '#F472B6', bg: 'rgba(244, 114, 182, 0.15)', checked: true },
                { key: 'average_spp_percent', label: 'Средняя СПП', color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)', checked: false },
                { key: 'profit_amount_per_day', label: 'Марж. прибыль', color: '#FCA5A5', bg: 'rgba(252, 165, 165, 0.15)', checked: false },
                { key: 'profit_margin', label: 'Рентабельность', color: '#C4B5FD', bg: 'rgba(196, 181, 253, 0.15)', checked: true }
            ],
            loadingMetrics: true,
            isRenderingChart: false,
        }
    },
    computed: {
        minusWords() {
            if (!this.adData?.minus_words) return []
            // If minus_words is already an array, use it directly
            if (Array.isArray(this.adData.minus_words)) return this.adData.minus_words
            // If it's a string and not empty, split it
            return this.adData.minus_words?.split(',').filter(word => word.trim()) || []
        },
        trustedWords() {
            if (!this.adData?.trusted_words) return []
            // If trusted_words is already an array, use it directly
            if (Array.isArray(this.adData.trusted_words)) return this.adData.trusted_words
            // If it's a string and not empty, split it
            return this.adData.trusted_words?.split(',').filter(word => word.trim()) || []
        },
        keywordStats() {
            if (!this.stats || !Array.isArray(this.stats)) return []
            return [...this.stats].sort((a, b) => {
                // Handle potential null/undefined values
                const viewsA = a?.views || 0
                const viewsB = b?.views || 0
                return viewsB - viewsA
            })
        },
        timelineMarkers() {
            if (!this.adData?.created_at) return []
            
            const startDate = new Date(this.adData.created_at)
            const markers = [
                { days: 0, label: this.formatDate(startDate, 'short'), position: 0 },
                { days: 28, label: '4 недели', position: (28/180) * 100 },
                { days: 60, label: '2 месяца', position: (60/180) * 100 },
                { days: 90, label: '3 месяца', position: (90/180) * 100 },
                { days: 120, label: '4 месяца', position: (120/180) * 100 },
                { days: 180, label: '6 месяцев', position: 100 }
            ]
            
            return markers
        },
        loadingProgress() {
            return this.loading.progress
        },
        filteredKeywordStats() {
            if (!this.stats || !Array.isArray(this.stats)) return []
            
            // First filter by search term
            let filtered = this.stats
            if (this.statsSearch.trim()) {
                const search = this.statsSearch.toLowerCase().trim()
                filtered = filtered.filter(stat => 
                    stat.keyword && stat.keyword.toLowerCase().includes(search)
                )
            }
            
            // Then sort
            return [...filtered].sort((a, b) => {
                const aValue = a?.[this.statsSort.field] ?? 0
                const bValue = b?.[this.statsSort.field] ?? 0
                
                // Special case for 'inMinus' field
                if (this.statsSort.field === 'inMinus') {
                    const aInMinus = this.isInMinusWords(a.keyword) ? 1 : 0
                    const bInMinus = this.isInMinusWords(b.keyword) ? 1 : 0
                    return this.statsSort.direction === 'asc' 
                        ? aInMinus - bInMinus 
                        : bInMinus - aInMinus
                }
                
                // Normal numeric/string comparison
                if (this.statsSort.direction === 'asc') {
                    return aValue > bValue ? 1 : -1
                } else {
                    return aValue < bValue ? 1 : -1
                }
            })
        },
        filteredMinusWords() {
            if (!this.minusWords.length) return []
            
            // Filter by search term
            let filtered = this.minusWords
            if (this.minusWordsSearch.trim()) {
                const search = this.minusWordsSearch.toLowerCase().trim()
                filtered = filtered.filter(word => 
                    word && word.toLowerCase().includes(search)
                )
            }
            
            // Sort minus words
            return [...filtered].sort((a, b) => {
                if (this.minusWordsSort.field === 'ctr') {
                    const aCtr = this.getWordCtr(a) || 0
                    const bCtr = this.getWordCtr(b) || 0
                    return this.minusWordsSort.direction === 'asc' 
                        ? aCtr - bCtr 
                        : bCtr - aCtr
                } else {
                    // Default to word sorting
                    return this.minusWordsSort.direction === 'asc' 
                        ? a.localeCompare(b) 
                        : b.localeCompare(a)
                }
            })
        },
    },
    methods: {
        getStatusClass(status) {
            const classes = {
                'идут показы': 'bg-green-100 text-green-800',
                'default': 'bg-gray-100 text-gray-800'
            }
            return classes[status] || classes.default
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
        formatDrr(drr) {
            if (!drr && drr !== 0) return '-'
            return `${(drr * 100).toFixed(2)}%`
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
        getProfitabilityClass(value) {
            if (!value && value !== 0) return 'text-gray-500 dark:text-gray-400'
            
            const percentage = value * 100
            if (percentage >= 40) return 'text-green-600 dark:text-green-400 font-medium'
            if (percentage >= 30) return 'text-yellow-600 dark:text-yellow-400 font-medium'
            return 'text-red-600 dark:text-red-400 font-medium'
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
        getCtrClass(ctr) {
            if (ctr >= 0.1) return 'text-green-600 dark:text-green-400 font-medium'
            if (ctr >= 0.05) return 'text-yellow-600 dark:text-yellow-400'
            return 'text-red-600 dark:text-red-400'
        },
        formatCtr(ctr) {
            if (ctr === null || ctr === undefined) return '0.00%'
            return (ctr * 100).toFixed(2) + '%'
        },
        async loadAllData() {
            this.loading.global = true
            this.loading.progress = 0
            
            try {
                // Fetch ad data
                this.loading.progress = 20
                await this.fetchAdData()
                
                // Fetch stats
                this.loading.progress = 40
                await this.fetchStats()
                
                // Fetch comments
                this.loading.progress = 60
                await this.fetchComments()
                
                // Fetch related campaigns
                this.loading.progress = 80
                await this.fetchRelatedCampaigns()
                
                this.loading.progress = 100
            } catch (error) {
                console.error('Failed to load data:', error)
            } finally {
                // Hide the loading bar after a short delay to show completion
                setTimeout(() => {
                    this.loading.global = false
                    this.loading.progress = 0
                }, 500)
            }
        },
        async fetchAdData() {
            if (!this.loading.global) {
                this.loading.global = true
                this.loading.progress = 30
            }
            
            try {
                const response = await mpr({
                    url: `/wbadv/${this.$route.params.id}`
                })
                this.adData = response.data.result.advertisement
            } catch (error) {
                console.error('Failed to fetch ad data:', error)
            } finally {
                if (!this.loading.global) {
                    setTimeout(() => {
                        this.loading.global = false
                        this.loading.progress = 0
                    }, 500)
                }
            }
        },
        async fetchStats() {
            try {
                const response = await mpr({
                    url: `/wbadv/${this.$route.params.id}/stats`
                })
                this.stats = response.data.result
            } catch (error) {
                console.error('Failed to fetch statistics:', error)
            }
        },
        async fetchComments() {
            try {
                const response = await mpr({
                    url: `/wbadv/${this.$route.params.id}/comments`
                })
                this.comments = response.data.result.map(c => ({
                    ...c,
                    created_at: new Date(c.created_at)
                }))
            } catch (error) {
                console.error('Failed to fetch comments:', error)
            }
        },
        async fetchRelatedCampaigns() {
            try {
                const response = await mpr({
                    url: `/wbadv/${this.$route.params.id}/related`
                })
                this.relatedCampaigns = response.data.result || []
            } catch (error) {
                console.error('Failed to fetch related campaigns:', error)
                this.relatedCampaigns = []
            }
        },
        async changeMinCtr() {
            const newCtr = prompt('Введите новый минимальный CTR (в процентах)', (this.adData.min_ctr * 100).toFixed(2))
            if (newCtr === null) return
            
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/min_ctr`,
                    method: 'PUT',
                    data: { min_ctr: parseFloat(newCtr) / 100 }
                })
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to update min CTR:', error)
            }
        },
        async changeViewsToMinus() {
            const newViews = prompt('Введите новое количество просмотров для минусации', this.adData.views_to_minus)
            if (newViews === null) return
            
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/views_to_minus`,
                    method: 'PUT',
                    data: { views_to_minus: parseInt(newViews) }
                })
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to update views to minus:', error)
            }
        },
        async deleteMinusWord(word) {
            if (!confirm(`Удалить минус-слово "${word}"?`)) return
            
            this.loading.deletingWord = word
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/minus_words`,
                    method: 'DELETE',
                    data: { word }
                })
                // Remove from selected if it was selected
                if (this.selectedMinusWords.includes(word)) {
                    this.selectedMinusWords = this.selectedMinusWords.filter(w => w !== word)
                }
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to delete minus word:', error)
            } finally {
                this.loading.deletingWord = null
            }
        },
        async addTrustedWord() {
            const word = prompt('Введите проверенное слово')
            if (!word) return
            
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/trusted_words`,
                    method: 'POST',
                    data: { word }
                })
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to add trusted word:', error)
            }
        },
        getWordCtr(word) {
            const stat = this.keywordStats.find(s => s.keyword === word)
            return stat ? stat.ctr : 0
        },
        async toggleBot() {
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/bot`,
                    method: 'PUT',
                    data: { enabled: !this.adData.bot_enabled }
                })
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to toggle bot:', error)
            }
        },
        async addToMinusWords(word) {
            if (this.minusWords.includes(word)) return
            
            this.loading.addingToMinus = word
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/minus_words`,
                    method: 'POST',
                    data: { word }
                })
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to add minus word:', error)
            } finally {
                this.loading.addingToMinus = null
            }
        },
        async deleteComment(commentId) {
            if (!confirm('Удалить комментарий?')) return
            
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/comments`,
                    method: 'DELETE',
                    data: { comment_id: commentId }
                })
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to delete comment:', error)
            }
        },
        getProgressPercentage() {
            if (!this.adData?.created_at) return 0
            
            const start = new Date(this.adData.created_at)
            const now = new Date()
            const totalDays = 180 // 6 months
            
            const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24))
            const percentage = Math.min((daysPassed / totalDays) * 100, 100)
            
            return Math.max(percentage, 0)
        },
        isInMinusWords(keyword) {
            if (!keyword) return false
            // Normalize both strings before comparison
            const normalizedKeyword = keyword.toLowerCase().trim()
            return this.minusWords.some(word => 
                word && word.toLowerCase().trim() === normalizedKeyword
            )
        },
        async deleteTrustedWord(word) {
            if (!confirm(`Удалить проверенное слово "${word}"?`)) return
            
            this.loading.deletingTrustedWord = word
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/trusted_words`,
                    method: 'DELETE',
                    data: { word }
                })
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to delete trusted word:', error)
            } finally {
                this.loading.deletingTrustedWord = null
            }
        },
        async addComment() {
            if (!this.newComment.trim()) return

            this.loading.addingComment = true
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/comments`,
                    method: 'POST',
                    data: { comment: this.newComment }
                })
                this.newComment = ''
                this.showCommentForm = false
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to add comment:', error)
            } finally {
                this.loading.addingComment = false
            }
        },
        formatDate(date, format = 'full') {
            if (!date) return ''
            const d = new Date(date)
            if (format === 'short') {
                return d.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit'
                })
            }
            return d.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        toggleAllMinusWords(event) {
            if (event.target.checked) {
                this.selectedMinusWords = [...this.minusWords]
            } else {
                this.selectedMinusWords = []
            }
        },
        toggleMinusWord(word) {
            if (this.selectedMinusWords.includes(word)) {
                this.selectedMinusWords = this.selectedMinusWords.filter(w => w !== word)
            } else {
                this.selectedMinusWords.push(word)
            }
        },
        async deleteSelectedMinusWords() {
            if (this.selectedMinusWords.length === 0) return
            
            if (!confirm(`Удалить ${this.selectedMinusWords.length} выбранных минус-слов?`)) return
            
            this.loading.deletingSelectedWords = true
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/minus_words`,
                    method: 'DELETE',
                    data: { words: this.selectedMinusWords }
                })
                this.selectedMinusWords = []
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to delete selected minus words:', error)
            } finally {
                this.loading.deletingSelectedWords = false
            }
        },
        setSortStats(field) {
            if (this.statsSort.field === field) {
                // Toggle direction if same field
                this.statsSort.direction = this.statsSort.direction === 'asc' ? 'desc' : 'asc'
            } else {
                // Set new field with default direction
                this.statsSort.field = field
                this.statsSort.direction = field === 'keyword' ? 'asc' : 'desc'
            }
        },
        getSortIcon(field, sortState) {
            if (sortState.field !== field) return 'none'
            return sortState.direction === 'asc' ? 'asc' : 'desc'
        },
        setSortMinusWords(field) {
            if (this.minusWordsSort.field === field) {
                // Toggle direction if same field
                this.minusWordsSort.direction = this.minusWordsSort.direction === 'asc' ? 'desc' : 'asc'
            } else {
                // Set new field with default direction
                this.minusWordsSort.field = field
                this.minusWordsSort.direction = field === 'word' ? 'asc' : 'desc'
            }
        },
        async showRestoreMinusWordsModal() {
            this.showRestoreModal = true
            this.selectedRestoreWords = []
            this.restorableMinusWords = []
            
            this.loading.checkingMinusWords = true
            try {
                const response = await mpr({
                    url: `/wbadv/${this.$route.params.id}/check_minus_words`,
                    method: 'POST',
                    data: { ctr: this.adData.min_ctr }
                })
                
                // Make sure we're properly handling the response
                if (response.data && response.data.result) {
                    this.restorableMinusWords = response.data.result
                    console.log('Loaded restorable words:', this.restorableMinusWords.length, this.restorableMinusWords)
                } else {
                    console.error('Unexpected API response format:', response.data)
                    this.restorableMinusWords = []
                }
            } catch (error) {
                console.error('Failed to check minus words:', error)
                this.restorableMinusWords = []
            } finally {
                this.loading.checkingMinusWords = false
            }
        },
        toggleAllRestoreWords(event) {
            if (event.target.checked) {
                this.selectedRestoreWords = this.restorableMinusWords.map(word => word.keyword)
            } else {
                this.selectedRestoreWords = []
            }
        },
        toggleRestoreWord(keyword) {
            if (this.selectedRestoreWords.includes(keyword)) {
                this.selectedRestoreWords = this.selectedRestoreWords.filter(w => w !== keyword)
            } else {
                this.selectedRestoreWords.push(keyword)
            }
        },
        async restoreSelectedMinusWords() {
            if (this.selectedRestoreWords.length === 0) return
            
            if (!confirm(`Вернуть ${this.selectedRestoreWords.length} выбранных минус-слов?`)) return
            
            this.loading.restoringWords = true
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/minus_words`,
                    method: 'DELETE',
                    data: { words: this.selectedRestoreWords }
                })
                
                this.showRestoreModal = false
                this.selectedRestoreWords = []
                await this.loadAllData()
            } catch (error) {
                console.error('Failed to restore minus words:', error)
            } finally {
                this.loading.restoringWords = false
            }
        },
        async loadMetrics() {
            this.loadingMetrics = true
            try {
                if (!this.adData || !this.adData.product_id) {
                    this.metrics = []
                    return
                }
                const response = await mpr({ url: `/products/${this.adData.product_id}/metrics` })
                this.metrics = response.data.result
            } catch (error) {
                console.error('Error loading metrics:', error)
            } finally {
                this.loadingMetrics = false
            }
        },
        formatChartDate(date) {
            if (!date) return ''
            const d = new Date(date)
            const day = String(d.getDate()).padStart(2, '0')
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const year = d.getFullYear()
            return `${day}.${month}.${year}`
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
            if (this.metricsChart) {
                try { this.metricsChart.destroy() } catch (e) {}
                this.metricsChart = null
            }
            if (!this.$refs.metricsChart) {
                this.isRenderingChart = false
                return
            }
            const ctx = this.$refs.metricsChart.getContext('2d')
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
            scales['x'] = { title: { display: true, text: 'Дата' } }
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
                        title: { display: true, text: 'Метрики кампании' }
                    },
                    animation: false,
                    scales
                }
            })
            this.isRenderingChart = false
        },
    },
    created() {
        this.debouncedRenderMetricsChart = debounce(this.renderMetricsChart, 200)
    },
    async mounted() {
        await this.loadAllData()
        await this.loadMetrics()
        this.$nextTick(this.renderMetricsChart)
    }
}
</script> 