import { defineStore } from 'pinia'
import mpr from '@/tools/mpr'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: null,
  }),
  actions: {
    async load() {
        const cached = localStorage.getItem('products')
        const cacheTime = localStorage.getItem('products_cache_time')
        const now = Date.now()
      
        if (cached && cacheTime && now - cacheTime < 5 * 60 * 1000) { // 5 min cache
          this.products = JSON.parse(cached)
        } else {
          const res = await mpr({ url: '/products/all' })
          this.products = res.data.result
          localStorage.setItem('products', JSON.stringify(this.products))
          localStorage.setItem('products_cache_time', now)
        }
    },
    clearCache() {
      localStorage.removeItem('products')
      localStorage.removeItem('products_cache_time')
      this.products = null
    }
  },
}) 