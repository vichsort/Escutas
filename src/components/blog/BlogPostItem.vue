<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { BookOpen } from 'lucide-vue-next'
import { formatDate } from '@/utils/formatters'

const props = defineProps({
    post: { type: Object, required: true },
    viewMode: { type: String, default: 'grid', validator: (v) => ['grid', 'list'].includes(v) }
})

const router = useRouter()

const handleClick = () => {
    router.push({ name: 'blog-post', params: { slug: props.post.slug } })
}

const excerpt = computed(() => {
    if (props.post.summary) return props.post.summary
    return ''
})

const formattedDate = computed(() => formatDate(props.post.published_at || props.post.created_at))

const isDraft = computed(() => !props.post.published_at)
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
            :class="viewMode === 'grid' ? 'w-full aspect-square rounded-lg mb-3' : 'w-14 h-14 rounded-md'"
        >
            <img
                v-if="post.cover_image_url"
                :src="post.cover_image_url"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
                <BookOpen class="text-gray-400 dark:text-gray-600" :size="32" />
            </div>

            <!-- Draft badge (grid) -->
            <div
                v-if="isDraft && viewMode === 'grid'"
                class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            >
                Rascunho
            </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col min-w-0" :class="{ 'flex-1 justify-center': viewMode === 'list' }">
            <h3
                class="font-bold text-gray-900 dark:text-white truncate"
                :class="viewMode === 'grid' ? 'text-base mb-0.5' : 'text-sm mb-0.5'"
            >
                {{ post.title }}
            </h3>

            <p v-if="excerpt && viewMode === 'grid'" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                {{ excerpt }}
            </p>

            <span class="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                {{ formattedDate }}
            </span>
        </div>

        <!-- Draft badge + data (list) -->
        <div v-if="viewMode === 'list'" class="ml-auto flex items-center gap-3 pr-2 flex-shrink-0">
            <span
                v-if="isDraft"
                class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            >
                Rascunho
            </span>
        </div>

    </div>
</template>