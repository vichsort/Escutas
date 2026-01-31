<script setup>
defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'ghost', 'danger'].includes(value)
    },
    block: Boolean
})
</script>

<template>
    <button
        class="px-6 py-3 rounded-full font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        :class="{
            'w-full': block,
            'bg-primary text-white hover:brightness-110 shadow-md shadow-primary/20 border border-transparent': variant === 'primary',
            'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 dark:bg-surfaceDark dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800': variant === 'secondary',
            'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger'
        }">
        <slot />
    </button>
</template>