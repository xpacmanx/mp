<template>
    <div class="min-h-full">
        <Header />

        <div class="py-6">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div v-if="adData" class="min-h-screen">
                    <!-- Header section -->
                    <div class="mb-8">
                        <div class="flex items-center justify-between">
                            <h1 class="text-2xl font-semibold text-gray-900">{{ adData.name }}</h1>
                            <span :class="getStatusClass(adData.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                                {{ adData.status }}
                            </span>
                        </div>
                        <p class="mt-2 text-sm text-gray-600">Код: {{ adData.code }}</p>
                        <p class="mt-2 text-sm text-gray-600">Тип товара: {{ adData.product_type }}</p>
                        <p class="mt-2 text-sm text-gray-600">Тип рекламы: {{ adData.type === 8 ? 'Авто' : 'Поиск' }}</p>
                        <p class="mt-2 text-sm text-gray-500">Последнее обновление: {{ formatDate(adData.updated_at) }}</p>
                    </div>

                    <!-- Timeline Progress -->
                    <div class="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-6">Таймлайн с момента создания</h3>
                        <div class="relative pt-6">
                            <!-- Current Time Marker -->
                            <div 
                                class="absolute transform -translate-x-1/2 top-0"
                                :style="{ left: `${getProgressPercentage()}%` }"
                            >
                                <span class="text-xs font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap block mb-1">
                                    Сейчас
                                </span>
                                <div class="w-px h-3 bg-blue-600 dark:bg-blue-500 mx-auto"></div>
                            </div>

                            <!-- Progress Bar -->
                            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div 
                                    class="h-2 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                                    :style="{ width: `${getProgressPercentage()}%` }"
                                ></div>
                            </div>

                            <!-- Timeline Markers -->
                            <div class="relative h-14">
                                <template v-for="(marker, index) in timelineMarkers" :key="index">
                                    <div 
                                        class="absolute transform"
                                        :style="{ 
                                            left: `${marker.position}%`,
                                            transform: index === 0 ? 'translateX(0)' : index === timelineMarkers.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)'
                                        }"
                                    >
                                        <div 
                                            v-if="index !== 0 && index !== timelineMarkers.length - 1"
                                            class="w-px h-3 bg-gray-300 dark:bg-gray-600 mx-auto mt-1"
                                        ></div>
                                        <span 
                                            class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap block"
                                            :style="{
                                                textAlign: index === 0 ? 'left' : index === timelineMarkers.length - 1 ? 'right' : 'center',
                                                minWidth: '60px',
                                                paddingTop: (index === 0 || index === timelineMarkers.length - 1) ? '16px' : 0,
                                            }"
                                        >
                                            {{ marker.label }}
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <!-- Current CPM -->
                        <div class="bg-white overflow-hidden shadow rounded-lg">
                            <div class="p-5">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                    </div>
                                    <div class="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt class="text-sm font-medium text-gray-500 truncate">Текущий CPM</dt>
                                            <dd class="text-lg font-medium text-gray-900">{{ adData.current_cpm }}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bot Status -->
                        <div class="bg-white overflow-hidden shadow rounded-lg">
                            <div class="p-5">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0">
                                            <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                                            </svg>
                                        </div>
                                        <div class="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt class="text-sm font-medium text-gray-500">Автоминусация</dt>
                                                <dd class="flex items-center mt-1">
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
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Min CTR -->
                        <div class="bg-white overflow-hidden shadow rounded-lg">
                            <div class="p-5">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0">
                                            <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        </div>
                                        <div class="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt class="text-sm font-medium text-gray-500">Мин CTR</dt>
                                                <dd class="text-lg font-medium text-gray-900">{{ formatCtr(adData.min_ctr) }}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                    <button @click="changeMinCtr" class="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                                        Изменить
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Views to Minus -->
                        <div class="bg-white overflow-hidden shadow rounded-lg">
                            <div class="p-5">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0">
                                            <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"></path>
                                            </svg>
                                        </div>
                                        <div class="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt class="text-sm font-medium text-gray-500">Мин Просмотры</dt>
                                                <dd class="text-lg font-medium text-gray-900">{{ adData.views_to_minus }}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                    <button @click="changeViewsToMinus" class="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                                        Изменить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Additional Info -->
                    <!-- <div class="mt-8 mb-8 bg-white shadow rounded-lg">
                        <div class="p-6">
                            <h2 class="text-lg font-medium text-gray-900 mb-4">Дополнительная информация</h2>
                            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Тип товара</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ adData.product_type }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Тип</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ adData.type }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Create CTR</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ adData.create_ctr }}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Выключено</dt>
                                    <dd class="mt-1 text-sm text-gray-900">{{ adData.off ? 'Да' : 'Нет' }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div> -->

                    <!-- Comments Section -->
                    <div class="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg">
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

                    <!-- Statistics Section -->
                    <div class="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div class="p-6">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Статистика ключевых слов за 30 дней</h2>
                            <div class="overflow-x-auto">
                                <div class="max-h-[600px] overflow-y-auto relative">
                                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Ключевое слово
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Просмотры
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Клики
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    CTR
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Действия
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr v-for="stat in keywordStats" :key="stat.keyword" class="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                                                    >
                                                        Убрать
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    

                    <!-- Words Tables -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Minus Words -->
                        <div class="bg-white shadow rounded-lg">
                            <div class="p-6">
                                <h2 class="text-lg font-medium text-gray-900 mb-4">Минус слова ({{ minusWords.length }} из 1000)</h2>
                                <div class="overflow-x-auto">
                                    <div class="max-h-[400px] overflow-y-auto">
                                        <table class="min-w-full divide-y divide-gray-200">
                                            <thead class="bg-gray-50 sticky top-0 z-10">
                                                <tr>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Слово
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        CTR
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Действия
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-white divide-y divide-gray-200">
                                                <tr v-for="word in minusWords" :key="word">
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {{ word }}
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getCtrClass(getWordCtr(word))">
                                                        {{ formatCtr(getWordCtr(word)) }}
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button @click="deleteMinusWord(word)" class="text-red-600 hover:text-red-900">
                                                            Удалить
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Trusted Words -->
                        <div class="bg-white shadow rounded-lg">
                            <div class="p-6">
                                <div class="flex justify-between items-center mb-4">
                                    <h2 class="text-lg font-medium text-gray-900">Проверенные слова</h2>
                                    <button @click="addTrustedWord" class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                                        Добавить слово
                                    </button>
                                </div>
                                <div class="overflow-x-auto">
                                    <div class="max-h-[400px] overflow-y-auto">
                                        <table class="min-w-full divide-y divide-gray-200">
                                            <thead class="bg-gray-50 sticky top-0 z-10">
                                                <tr>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Слово
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-white divide-y divide-gray-200">
                                                <tr v-for="word in trustedWords" :key="word">
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {{ word }}
                                                    </td>
                                                </tr>
                                                <tr v-if="!trustedWords.length">
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                        Нет проверенных слов
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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
    </div>
</template>

<script>
import Header from '@/components/navigation/Header.vue'
import mpr from './../tools/mpr'

export default {
    name: 'AdvDetailsView',
    components: {
        Header
    },
    data() {
        return {
            adData: null,
            stats: [],
            comments: [],
            newComment: '',
            showCommentForm: false,
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
        }
    },
    methods: {
        getStatusClass(status) {
            const classes = {
                'идут показы': 'bg-green-100 text-green-800',
                'default': 'bg-gray-100 text-gray-800'
            }
            return classes[status] || classes.default
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
        async fetchAdData() {
            try {
                const response = await mpr({
                    url: `/wbadv/${this.$route.params.id}`
                })
                this.adData = response.data.result.advertisement
                // this.stats = response.data.result.keyword_stats
            } catch (error) {
                console.error('Failed to fetch ad data:', error)
                // Handle error appropriately
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
                this.fetchAdData()
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
                this.fetchAdData()
            } catch (error) {
                console.error('Failed to update views to minus:', error)
            }
        },
        async deleteMinusWord(word) {
            if (!confirm(`Удалить минус-слово "${word}"?`)) return
            
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/minus_words`,
                    method: 'DELETE',
                    data: { word }
                })
                this.fetchAdData()
            } catch (error) {
                console.error('Failed to delete minus word:', error)
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
                this.fetchAdData()
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
                this.fetchAdData()
            } catch (error) {
                console.error('Failed to toggle bot:', error)
            }
        },
        async addToMinusWords(word) {
            if (this.minusWords.includes(word)) return
            
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/minus_words`,
                    method: 'POST',
                    data: { word }
                })
                this.fetchAdData()
            } catch (error) {
                console.error('Failed to add minus word:', error)
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
        async addComment() {
            if (!this.newComment.trim()) return

            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/comments`,
                    method: 'POST',
                    data: { comment: this.newComment }
                })
                this.newComment = ''
                this.showCommentForm = false // Hide form after successful comment
                await this.fetchComments()
            } catch (error) {
                console.error('Failed to add comment:', error)
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
        async deleteComment(commentId) {
            if (!confirm('Удалить комментарий?')) return
            
            try {
                await mpr({
                    url: `/wbadv/${this.$route.params.id}/comments`,
                    method: 'DELETE',
                    data: { comment_id: commentId }
                })
                await this.fetchComments()
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
    },
    async mounted() {
        // Fetch data in parallel
        await Promise.all([
            this.fetchAdData(),
            this.fetchStats(),
            this.fetchComments()
        ])
    }
}
</script> 