<template>
<div class="min-h-full bg-gray-50 dark:bg-gray-900">
    <Header />
    <router-view />
</div>
</template>

<script>
import Header from '@/components/navigation/Header.vue'

export default {
    components: {
        Header
    }
}
</script>