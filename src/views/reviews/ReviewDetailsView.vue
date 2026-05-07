<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth_store'
import { useReviewStore } from '@/stores/reviews_store'
import { Download, Save, Edit3, Trash2 } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import BaseButton from '@/components/ui/BaseButton.vue'
import ReviewExportCard from '@/components/reviews/ReviewExportCard.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const reviewStore = useReviewStore()

const isSaving = ref(false)
const isExporting = ref(false)
const isDeleting = ref(false)
const editMode = ref(false)
const detailsText = ref('')
const exportCardRef = ref(null)

const review = computed(() => reviewStore.currentReview)
const isLoading = computed(() => reviewStore.isLoading)

const isOwner = computed(() => {
    return authStore.user && review.value && authStore.user.id === review.value.user_id
})

const fetchReviewData = async (id) => {
    if (!id) return
    try {
        const data = await reviewStore.fetchReview(id)
        detailsText.value = data.review_text || ''
    } catch (error) {
        console.error("Erro ao carregar review:", error)
        // router.push('/404')
    }
}

onMounted(() => {
    fetchReviewData(route.params.id)
})

watch(
    () => route.params.id,
    (newId) => {
        fetchReviewData(newId)
    }
)

const saveDetails = async () => {
    try {
        isSaving.value = true
        await reviewStore.updateReview(review.value.id, { review_text: detailsText.value })
        editMode.value = false
    } catch (error) {
        alert('Erro ao salvar detalhes.')
    } finally {
        isSaving.value = false
    }
}

const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta review? Esta ação é irreversível.')) return
    
    try {
        isDeleting.value = true
        await reviewStore.deleteReview(review.value.id)
        router.push('/library')
    } catch (error) {
        alert('Erro ao deletar review.')
    } finally {
        isDeleting.value = false
    }
}

const handleExport = async () => {
    const elementToCapture = exportCardRef.value?.$el
    if (!elementToCapture) return

    try {
        isExporting.value = true
        await new Promise(r => setTimeout(r, 100))

        const canvas = await html2canvas(elementToCapture, {
            backgroundColor: '#121212',
            scale: 2,
            useCORS: true,
            logging: false
        })

        const link = document.createElement('a')
        link.download = `review-${review.value.album_name.substring(0, 30)}.png`
        link.href = canvas.toDataURL()
        link.click()
    } catch (err) {
        console.error('Erro ao exportar:', err)
        alert('Erro ao gerar imagem. Tente novamente.')
    } finally {
        isExporting.value = false
    }
}
</script>

<template>
    <div class="p-8 pb-24 max-w-5xl mx-auto space-y-8">

        <div v-if="isLoading || !review" class="flex flex-col items-center justify-center py-20">
            <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else class="space-y-8">

            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 class="text-2xl font-bold text-gray-500">Detalhes da Review</h1>

                <div class="flex gap-3 flex-wrap">
                    <BaseButton variant="outline" @click="handleExport" :disabled="isExporting">
                        <Download v-if="!isExporting" :size="18" class="mr-2" />
                        <span v-else class="animate-spin mr-2">⏳</span>
                        {{ isExporting ? 'Gerando...' : 'Exportar Card' }}
                    </BaseButton>

                    <template v-if="isOwner && !editMode">
                        <BaseButton variant="primary" @click="editMode = true">
                            <Edit3 :size="18" class="mr-2" /> Editar Guia
                        </BaseButton>
                        
                        <BaseButton variant="danger" @click="handleDelete" :disabled="isDeleting" class="text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
                            <Trash2 v-if="!isDeleting" :size="18" class="mr-2" />
                            <span v-else class="animate-spin mr-2">⏳</span>
                            {{ isDeleting ? 'Deletando...' : 'Deletar' }}
                        </BaseButton>
                    </template>
                </div>
            </div>

            <ReviewExportCard ref="exportCardRef" :review="review" />

            <section class="mt-12 max-w-3xl mx-auto">
                <div class="flex items-center gap-3 mb-4">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                        Considerações & Guia
                    </h3>
                    <span v-if="!review.review_text && !editMode" class="text-sm text-gray-500 italic">
                        Sem detalhes adicionais.
                    </span>
                </div>

                <div v-if="editMode" class="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <textarea v-model="detailsText" rows="10"
                        class="w-full p-6 rounded-2xl bg-white dark:bg-[#181818] border border-gray-200 dark:border-[#282828] focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed text-lg"
                        placeholder="Escreva sua análise detalhada, curiosidades ou guia sobre este álbum..."></textarea>

                    <div class="flex justify-end gap-3">
                        <BaseButton variant="ghost" @click="editMode = false">Cancelar</BaseButton>
                        <BaseButton variant="primary" @click="saveDetails" :disabled="isSaving">
                            <Save v-if="!isSaving" :size="18" class="mr-2" />
                            {{ isSaving ? 'Salvando...' : 'Salvar Guia' }}
                        </BaseButton>
                    </div>
                </div>

                <div v-else-if="review.review_text" class="prose dark:prose-invert max-w-none">
                    <p
                        class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap bg-white dark:bg-[#181818] p-8 rounded-2xl border border-gray-100 dark:border-[#282828]">
                        {{ review.review_text }}
                    </p>
                </div>
            </section>

        </div>
    </div>
</template>