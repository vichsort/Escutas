<script setup>
defineProps({
    album: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="group relative flex flex-col gap-3 w-full cursor-pointer">

        <div
            class="relative aspect-square overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300">
            <img :src="album.cover_url || 'https://placehold.co/300x300?text=Sem+Capa'" :alt="album.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
        </div>

        <div class="flex flex-col">
            <h3 class="font-bold text-gray-900 dark:text-white truncate" :title="album.name">
                {{ album.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ album.artist }}
            </p>
        </div>

    </div>
</template>