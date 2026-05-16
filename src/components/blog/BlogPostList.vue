<script setup>
import BlogPostItem from '@/components/blog/BlogPostItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonGrid from '@/components/ui/SkeletonGrid.vue'

defineProps({
    posts: { type: Array, default: () => [] },
    viewMode: { type: String, default: 'grid' },
    isLoading: { type: Boolean, default: false },
    emptyMessage: { type: String, default: 'Nenhum post encontrado.' }
})
</script>

<template>
    <div>
        <SkeletonGrid v-if="isLoading" :count="6" />

        <div
            v-else-if="posts.length"
            :class="viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                : 'space-y-2'"
        >
            <BlogPostItem
                v-for="post in posts"
                :key="post.id"
                :post="post"
                :view-mode="viewMode"
            />
        </div>

        <EmptyState v-else>{{ emptyMessage }}</EmptyState>
    </div>
</template>