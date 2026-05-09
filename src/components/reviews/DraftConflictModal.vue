<script setup>
import { AlertTriangle } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useDraftsStore } from '@/stores/drafts_store'

const draftsStore = useDraftsStore()

const handleResume = () => {
    // A própria store já faz o router.push para a tela do rascunho
    draftsStore.resumeDraft()
}

const handleDiscard = () => {
    // Limpa o cofre e fecha o modal
    const pendingAlbum = draftsStore.discardDraft()
    
    // Como a ação original foi abortada, damos um feedback rápido para o usuário clicar de novo
    // (Numa arquitetura mais complexa, poderíamos usar um EventBus global para auto-abrir o modal aqui)
    console.log(`Rascunho descartado. O usuário queria abrir:`, pendingAlbum?.name)
}
</script>

<template>
    <BaseModal 
        :is-open="draftsStore.isConflictModalOpen" 
        :show-close-button="false"
        @close="draftsStore.isConflictModalOpen = false"
    >
        
        <template #header>
            <div class="flex items-center gap-3 text-red-500 dark:text-red-400">
                <AlertTriangle :size="24" />
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Rascunho em Andamento</h2>
            </div>
        </template>

        <template #default>
            <div class="space-y-4">
                <p class="text-gray-600 dark:text-gray-300">
                    Você já tem uma avaliação não publicada para o álbum 
                    <strong class="text-gray-900 dark:text-white">"{{ draftsStore.activeDraft?.album?.name }}"</strong>.
                </p>
                <p class="text-gray-600 dark:text-gray-300">
                    O que você deseja fazer? Se iniciar uma nova review, o seu rascunho anterior será perdido permanentemente.
                </p>
            </div>
        </template>

        <template #footer>
            <button 
                @click="handleDiscard" 
                class="px-6 py-2.5 rounded-full font-bold text-sm transition-all text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
                Descartar Rascunho
            </button>

            <button 
                @click="handleResume" 
                class="bg-primary text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
                Retomar Rascunho
            </button>
        </template>

    </BaseModal>
</template>