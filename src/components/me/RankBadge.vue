<script setup>
defineProps({
    label: { type: String, required: true }
})
</script>

<template>
    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
        {{ label }}
    </span>
</template>