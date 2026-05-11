<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { TIER_CONFIG } from '@/constants/review_constants'
import { Disc } from 'lucide-vue-next'

const props = defineProps({
  review: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid',
    validator: (v) => ['grid', 'list'].includes(v)
  }
})

const router = useRouter()

const tierStyle = computed(() => TIER_CONFIG[props.review.tier] ?? null)

const handleClick = () => {
  router.push({ name: 'review-details', params: { id: props.review.id } })
}
</script>

<template>
  <div
    @click="handleClick"
    class="group relative cursor-pointer transition-all duration-300 bg-surfaceLight dark:bg-surfaceDark hover:bg-gray-50 dark:hover:bg-gray-800"
    :class="[
      viewMode === 'grid'
        ? 'flex flex-col p-4 rounded-xl border border-transparent hover:border-white/10 shadow-sm hover:shadow-md'
        : 'flex flex-row items-center p-3 rounded-lg border border-transparent hover:border-white/10 gap-4'
    ]"
  >
    <!-- Capa -->
    <div
      class="relative overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0"
      :class="[
        viewMode === 'grid' ? 'w-full aspect-square rounded-lg mb-3' : 'w-14 h-14 rounded-md'
      ]"
    >
      <img
        v-if="review.cover_url"
        :src="review.cover_url"
        :alt="review.album_name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Disc class="text-gray-400 dark:text-gray-600" :size="32" />
      </div>

      <!-- Tier badge sobre a capa (grid) -->
      <div
        v-if="tierStyle && viewMode === 'grid'"
        class="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg"
        :style="{ backgroundColor: tierStyle.bg, color: tierStyle.text }"
      >
        {{ review.tier }}
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col min-w-0" :class="{ 'flex-1 justify-center': viewMode === 'list' }">
      <h3
        class="font-bold text-gray-900 dark:text-white truncate"
        :class="[viewMode === 'grid' ? 'text-base mb-0.5' : 'text-sm mb-0.5']"
      >
        {{ review.album_name }}
      </h3>

      <span class="text-sm text-gray-500 dark:text-gray-400 truncate">
        {{ review.artist_name }}
      </span>
    </div>

    <!-- Tier + score (list) -->
    <div v-if="viewMode === 'list'" class="ml-auto flex items-center gap-3 pr-2 flex-shrink-0">
      <span
        v-if="tierStyle"
        class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
        :style="{ backgroundColor: tierStyle.bg, color: tierStyle.text }"
      >
        {{ review.tier }}
      </span>
      <span class="text-sm font-bold text-primary tabular-nums">
        {{ review.score?.toFixed(1) }}
      </span>
    </div>
  </div>
</template>