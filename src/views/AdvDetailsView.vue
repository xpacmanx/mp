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
                                                    {{ top_keyword.cpm }}
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
import mpr from './../tools/mpr'

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
                this.loading.progress = 30
                await this.fetchAdData()
                
                // Fetch stats
                this.loading.progress = 60
                await this.fetchStats()
                
                // Fetch comments
                this.loading.progress = 90
                await this.fetchComments()
                
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
    },
    async mounted() {
        // Replace individual fetches with the combined loading method
        await this.loadAllData()
    }
}
</script> 