<template>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="i in count" :key="i" class="aspect-square bg-gray-200 dark:bg-surfaceDark rounded-2xl animate-pulse"></div>
    </div>
</template>

<script setup>
defineProps({ count: { type: Number, default: 5 } })
</script>