<script setup>
import { TIER_CONFIG } from '@/constants/review_constants'

defineProps({
    tier: { type: String, required: true },
    reviews: { type: Array, default: () => [] }
})
</script>

<template>
    <div class="flex min-h-[80px]">
        <!-- Label do tier -->
        <div
            class="w-16 flex-shrink-0 flex items-center justify-center text-lg font-black"
            :style="{ backgroundColor: TIER_CONFIG[tier]?.bg, color: TIER_CONFIG[tier]?.text }"
        >
            {{ tier }}
        </div>

        <!-- Álbuns -->
        <div class="flex-1 flex flex-wrap gap-2 p-2 bg-gray-900 border-b border-gray-800">
            <img
                v-for="review in reviews"
                :key="review.id"
                :src="review.cover_url"
                :alt="review.album_name"
                class="w-16 h-16 object-cover rounded"
            />
        </div>
    </div>
</template>