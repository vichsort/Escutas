<script setup>
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    imageUrl: { type: String, default: null },
    isRound: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<template>
    <div class="group flex flex-col gap-3 w-full cursor-pointer" @click="$emit('click')">

        <div class="relative aspect-square overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300"
            :class="isRound ? 'rounded-full' : 'rounded-2xl'">
            <img v-if="imageUrl" :src="imageUrl" :alt="title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy" />

            <div v-else
                class="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <slot name="fallback"></slot>
            </div>

            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>

        <div class="flex flex-col" :class="isRound ? 'items-center text-center' : 'items-start text-left'">
            <h3 class="font-bold text-gray-900 dark:text-white w-full truncate" :title="title">
                {{ title }}
            </h3>
            <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400 w-full truncate" :title="subtitle">
                {{ subtitle }}
            </p>
        </div>

    </div>
</template>