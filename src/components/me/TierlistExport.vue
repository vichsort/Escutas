<script setup>
import TierlistRow from '@/components/me/TierlistRow.vue'

const TIERS = ['S', 'A', 'B', 'C', 'D', 'E']

defineProps({
    grouped: { type: Object, required: true } // { S: [...], A: [...], ... }
})
</script>

<template>
    <div class="flex flex-col overflow-hidden rounded-xl border border-gray-800">
        <TierlistRow
            v-for="tier in TIERS"
            :key="tier"
            :tier="tier"
            :reviews="grouped[tier] || []"
        />
    </div>
</template>