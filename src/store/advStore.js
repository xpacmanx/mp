// store/advStore.js
import { defineStore } from 'pinia'
import mpr from '@/tools/mpr'

export const useAdvStore = defineStore('adv', {
  state: () => ({
    adv: null,
  }),
  actions: {
    async load() {
        const cached = localStorage.getItem('adv')
        const cacheTime = localStorage.getItem('adv_cache_time')
        const now = Date.now()
      
        if (cached && cacheTime && now - cacheTime < 5 * 60 * 1000) { // 5 мин
          this.adv = JSON.parse(cached)
        } else {
          const res = await mpr({ url: '/wbadv/all' })
          this.adv = res.data.result
          localStorage.setItem('adv', JSON.stringify(this.adv))
          localStorage.setItem('adv_cache_time', now)
        }
    },
    clearCache() {
      localStorage.removeItem('adv')
      this.adv = null
    }
  },
})