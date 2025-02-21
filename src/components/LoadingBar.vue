<template>
  <div 
    v-if="loading" 
    class="fixed bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50"
  >
    <div 
      class="h-1 bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingBar',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    }
  }
}
</script> 