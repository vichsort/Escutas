<script setup>
import { Flame } from 'lucide-vue-next'

defineProps({
    streak: { type: Number, required: true }
})
</script>

<template>
    <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
        <Flame :size="14" fill="currentColor" stroke="none" class="text-orange-500" />
        <span class="text-xs font-bold text-orange-500">{{ streak }}</span>
    </div>
</template>