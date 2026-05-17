<script setup>
import { computed } from 'vue'
import { TIER_CONFIG } from '@/constants/review_constants'

const props = defineProps({
    overview: { type: Object, required: true },
    tierDistribution: { type: Object, default: () => ({}) },
    topArtists: { type: Array, default: () => [] }
})

const TIERS = ['S', 'A', 'B', 'C', 'D', 'E']

const maxTierCount = computed(() =>
    Math.max(...TIERS.map(t => props.tierDistribution[t] || 0), 1)
)
</script>

<template>
    <div class="space-y-6">

        <!-- Totais -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
                class="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 p-4 space-y-1">
                <p class="text-2xl font-black text-gray-900 dark:text-white">{{ overview.total_reviews }}</p>
                <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Reviews</p>
            </div>
            <div
                class="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 p-4 space-y-1">
                <p class="text-2xl font-black text-gray-900 dark:text-white">{{ overview.total_platinums }}</p>
                <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Platinas</p>
            </div>
            <div
                class="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 p-4 space-y-1">
                <p class="text-2xl font-black text-gray-900 dark:text-white">{{ overview.total_artists_reviewed }}</p>
                <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Artistas</p>
            </div>
            <div
                class="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 p-4 space-y-1">
                <p class="text-2xl font-black text-gray-900 dark:text-white">{{ overview.average_score?.toFixed(1) }}
                </p>
                <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Média</p>
            </div>
        </div>

        <!-- Tier distribution -->
        <div class="space-y-2">
            <p class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Distribuição por
                Tier</p>
            <div class="space-y-1.5">
                <div v-for="tier in TIERS" :key="tier" class="flex items-center gap-3">
                    <span
                        class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                        :style="{ backgroundColor: TIER_CONFIG[tier]?.bg, color: TIER_CONFIG[tier]?.text }">
                        {{ tier }}
                    </span>
                    <div class="flex-1 h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-700" :style="{
                            backgroundColor: TIER_CONFIG[tier]?.bg,
                            width: `${((tierDistribution[tier] || 0) / maxTierCount) * 100}%`
                        }" />
                    </div>
                    <span class="text-xs text-gray-400 w-6 text-right">{{ tierDistribution[tier] || 0 }}</span>
                </div>
            </div>
        </div>

        <!-- Top artists -->
        <div v-if="topArtists.length" class="space-y-2">
            <p class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Artistas Mais
                Ouvidos</p>
            <div class="space-y-1.5">
                <div v-for="(artist, i) in topArtists" :key="artist.name" class="flex items-center gap-3">
                    <span class="text-xs font-bold text-gray-400 w-4">{{ i + 1 }}</span>
                    <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{{ artist.name }}</span>
                    <span class="text-xs text-gray-400">{{ artist.count }}</span>
                </div>
            </div>
        </div>

    </div>
</template>