<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog_store'
import { PenLine, BookOpen } from 'lucide-vue-next'
import BlogPostList from '@/components/blog/BlogPostList.vue'
import ViewModeToggle from '@/components/ui/ViewModeToggle.vue'

const router = useRouter()
const blogStore = useBlogStore()

const viewMode = ref('grid')

const drafts = computed(() => blogStore.myPostsPagination.items.filter(p => !p.published_at))
const published = computed(() => blogStore.myPostsPagination.items.filter(p => !!p.published_at))

const isLoading = computed(() => blogStore.isLoading.list)

onMounted(async () => {
    await blogStore.fetchMyPosts(1, 50, null, true)
})
</script>

<template>
    <div class="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-12 space-y-10">

        <div class="flex flex-col gap-4 pb-8 border-b border-gray-200 dark:border-gray-800/50">
            <span class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Blog
            </span>

            <div class="flex items-end justify-between gap-4">
                <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                    Seus Posts
                </h1>

                <div class="flex items-center gap-3 pb-1">
                    <ViewModeToggle v-model="viewMode" />
                    <button
                        @click="router.push({ name: 'blog-write' })"
                        class="flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                    >
                        <PenLine :size="16" />
                        Novo post
                    </button>
                </div>
            </div>
        </div>

        <section v-if="drafts.length || isLoading" class="space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Rascunhos
            </h2>
            <BlogPostList
                :posts="drafts"
                :view-mode="viewMode"
                :is-loading="isLoading"
                empty-message="Nenhum rascunho."
            />
        </section>

        <section class="space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Publicados
            </h2>
            <BlogPostList
                :posts="published"
                :view-mode="viewMode"
                :is-loading="isLoading"
                empty-message="Você ainda não publicou nenhum post."
            >
                <template #empty-icon>
                    <BookOpen :size="40" class="text-gray-300 dark:text-gray-700" />
                </template>
            </BlogPostList>
        </section>

    </div>
</template>