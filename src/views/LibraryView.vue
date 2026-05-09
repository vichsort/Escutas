<script setup>
import { onMounted } from 'vue'
import { Library, Loader2 } from 'lucide-vue-next'
import { useLibrary } from '@/composables/useLibrary'
import LibraryFilters from '@/components/library/LibraryFilters.vue'
import { useDraftsStore } from '@/stores/drafts_store'
import DraftsGoToCard from '@/components/library/DraftsGoToCard.vue'
import ReviewCard from '@/components/media/ReviewCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SkeletonGrid from '@/components/ui/SkeletonGrid.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const {
    reviews,
    isLoading,
    isLoadingMore,
    pagination,
    filters,
    fetchReviews,
    loadMore,
    updateFilters
} = useLibrary()

onMounted(() => {
    fetchReviews(true)
})
</script>

<template>
    <div class="p-8 pb-24 max-w-7xl mx-auto space-y-8">

        <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Library class="text-primary" />
                    Sua Biblioteca
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2">
                    Você já avaliou <span class="font-bold text-gray-900 dark:text-white">{{ pagination.total }}</span>
                    álbuns.
                </p>
            </div>

            <div class="w-full lg:w-auto flex-1 max-w-2xl flex justify-end">
                <LibraryFilters :filters="filters" @update="updateFilters" />
            </div>
        </header>

        <section>

            <SkeletonGrid v-if="isLoading" :count="10" />

            <EmptyState v-else-if="reviews.length === 0">
                <template #icon>
                    <Library :size="64" class="text-gray-300 dark:text-gray-700" />
                </template>

                <span v-if="filters.search || filters.tier || filters.is_private">
                    Nenhum resultado encontrado para os filtros atuais.
                </span>
                <span v-else>
                    Sua biblioteca está vazia. Vá em "Explorar" para começar!
                </span>
            </EmptyState>

            <div v-else
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4">
                <DraftsGoToCard v-if="draftsStore.allDrafts.length > 0" :count="draftsStore.allDrafts.length" />
                <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
            </div>

            <div v-if="pagination.has_next" class="flex justify-center mt-12">
                <BaseButton variant="outline" @click="loadMore" :disabled="isLoadingMore" class="min-w-[200px]">
                    <Loader2 v-if="isLoadingMore" class="animate-spin mr-2" :size="20" />
                    {{ isLoadingMore ? 'Carregando...' : 'Carregar Mais' }}
                </BaseButton>
            </div>

        </section>

    </div>
</template>