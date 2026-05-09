<script setup>
defineProps({
    album: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <aside class="hidden lg:block w-80 flex-shrink-0 sticky top-8 self-start space-y-6">

        <div class="relative group">
            <img :src="album?.cover_url" :alt="album?.name"
                class="w-full aspect-square object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
        </div>

        <div class="space-y-1">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {{ album?.name }}
            </h2>
            <p
                class="text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                {{ album?.artist }}
            </p>
        </div>

        <div class="p-4 rounded-xl bg-surfaceLight dark:bg-surfaceDark/50 border border-gray-200 dark:border-gray-800">
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Mais informações sobre o artista e outras métricas virão aqui em breve...
            </p>
        </div>

    </aside>
</template>