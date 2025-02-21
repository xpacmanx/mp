<template>
  <div class="min-h-full bg-gray-50 dark:bg-gray-900">
    <Header />

    <div class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">Бот автоминусации</h2>
        
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    ID
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    Код МС
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    Название
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    Тип товара
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    CPM
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    CTR для минусации
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    Просмотры для минусации
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="ad in adv" 
                    :key="ad.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ ad.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ ad.code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <router-link 
                      :to="'/adv/' + ad.id" 
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline"
                    >
                      {{ ad.name }}
                    </router-link>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ ad.product_type }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ ad.current_cpm }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getCtrClass(ad.min_ctr)">
                    {{ formatCtr(ad.min_ctr) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ (ad.views_to_minus || 0).toLocaleString() }}
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
import Header from '@/components/navigation/Header.vue'
import Notifications from '@/components/Notifications.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import mpr from './../tools/mpr'
import moment from 'moment'

export default {
  name: 'AdvView',
  components: {
    Header, 
    Notifications, 
    ArrowPathIcon
  },
  data() {
    return {
      adv: [],
    }
  },
  methods: {
    addNotification(type, text) {
      this.$store.dispatch('add', {type: type, text: text});
    },
    formatCtr(ctr) {
      return (ctr * 100).toFixed(2) + '%'
    },
    getCtrClass(ctr) {
      if (ctr >= 0.1) return 'text-green-600 dark:text-green-400 font-medium'
      if (ctr >= 0.05) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-red-600 dark:text-red-400'
    },
    getAdv() {
      mpr({
        url: '/wbadv/all'
      }).then(res => {
        this.adv = res.data.result;
      })
    },
  },
  mounted() {
    this.getAdv();
  }
}
</script>

<style lang="postcss" scoped>
.overflow-x-auto {
  max-height: calc(100vh - 250px);
}
</style>