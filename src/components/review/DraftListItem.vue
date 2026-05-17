<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDraftsStore } from '@/stores/drafts_store'
import { timeAgo } from '@/utils/formatters'
import { Trash2, PenLine } from 'lucide-vue-next'

const props = defineProps({
    draft: {
        type: Object,
        required: true
    },

    viewMode: {
        type: String,
        default: 'grid',
        validator: (value) => ['grid', 'list'].includes(value)
    }
})

const router = useRouter()
const draftsStore = useDraftsStore()

// Atalhos reativos para o template
const album = computed(() => props.draft.album)
const average = computed(() => draftsStore.getDraftAverage(album.value.id))
const lastEdited = computed(() => timeAgo(props.draft.updatedAt))

// Ações Independentes
const handleContinue = () => {
    router.push({ name: 'create-review', params: { id: album.value.id } })
}

const handleDelete = (e) => {
    e.stopPropagation()
    draftsStore.deleteDraft(album.value.id)
}
</script>

<template>
    <div @click="handleContinue"
        class="group relative cursor-pointer transition-all duration-300 bg-surfaceLight dark:bg-surfaceDark hover:bg-gray-50 dark:hover:bg-gray-800"
        :class="[
            viewMode === 'grid'
                ? 'flex flex-col p-4 rounded-xl border-2 border-dashed border-primary/40 hover:border-primary shadow-sm hover:shadow-md'
                : 'flex flex-row items-center p-3 rounded-lg border border-dashed border-primary/30 hover:border-primary/60 gap-4'
        ]">
        <button @click="handleDelete"
            class="absolute z-20 flex items-center justify-center bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-red-600"
            :class="[
                viewMode === 'grid' ? 'top-2 right-2 w-8 h-8' : 'right-4 w-8 h-8'
            ]" title="Descartar rascunho">
            <Trash2 :size="16" />
        </button>

        <div class="relative overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0" :class="[
            viewMode === 'grid' ? 'w-full aspect-square rounded-lg mb-4' : 'w-14 h-14 rounded-md'
        ]">
            <img v-if="album?.cover_url" :src="album.cover_url" :alt="album.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

            <div v-if="viewMode === 'grid'"
                class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div
                    class="bg-primary text-black p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <PenLine :size="24" />
                </div>
            </div>
        </div>

        <div class="flex flex-col min-w-0" :class="{ 'flex-1 justify-center': viewMode === 'list' }">
            <h3 class="font-bold text-gray-900 dark:text-white truncate"
                :class="[viewMode === 'grid' ? 'text-base mb-1' : 'text-sm mb-0.5']">
                {{ album?.name }}
            </h3>

            <div class="flex items-center text-gray-500 dark:text-gray-400 font-medium text-sm">
                <span v-if="viewMode === 'list'" class="truncate mr-2 max-w-[120px]">{{ album?.artist }} •</span>

                <span class="flex items-center gap-1.5">
                    <span class="text-primary font-bold" title="Média Atual">{{ average }}</span>
                    <span class="text-xs opacity-40">•</span>
                    <span class="text-xs" title="Última edição">{{ lastEdited }}</span>
                </span>
            </div>
        </div>

        <div v-if="viewMode === 'list'" class="pr-12 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
            <PenLine :size="20" />
        </div>
    </div>
</template>