import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

export const useDraftsStore = defineStore('drafts', () => {
    const router = useRouter()

    // Estado persistente (aguenta f5)
    const activeDraft = useLocalStorage('review-draft', null)

    // Estado efêmero (pra ui)
    const isConflictModalOpen = ref(false)
    const pendingAction = ref(null) // Guarda o que o usuário tentou fazer para executarmos depois

    // getters
    const hasActiveDraft = computed(() => activeDraft.value !== null)
    
    // Calcula a média em tempo real direto da store (ignorando as faixas riscadas)
    const draftAverage = computed(() => {
        if (!activeDraft.value || !activeDraft.value.tracks) return "0.0"
        
        const validTracks = activeDraft.value.tracks.filter(t => !t.isIgnored)
        if (validTracks.length === 0) return "0.0"

        const total = validTracks.reduce((acc, t) => acc + (Number(t.userScore) || 0), 0)
        return (total / validTracks.length).toFixed(1)
    })

    // actions de rascunho
    const initDraft = (albumData, tracksData) => {
        activeDraft.value = {
            album: {
                id: albumData.id,
                name: albumData.name,
                artist: albumData.artist,
                cover_url: albumData.cover_url
            },
            tracks: tracksData.map(t => ({
                id: t.id,
                name: t.name,
                track_number: t.track_number,
                userScore: 5.0,
                isIgnored: t.suggested_ignore || false
            })),
            reviewText: '',
            isLegacyMode: false
        }
    }

    const clearDraft = () => {
        activeDraft.value = null
    }

    // actions de intercept
    // Função chamada quando o usuário tenta abrir um álbum.
    // Retorna TRUE se ele pode seguir em frente, ou FALSE se foi barrado pelo popup.
    const tryOpenAlbum = (newAlbum) => {
        if (!activeDraft.value) return true // Caminho livre, não tem rascunho
        
        if (activeDraft.value.album.id === newAlbum.id) return true // É o mesmo álbum, pode abrir
        
        // CONFLITO DETECTADO
        // Guarda o álbum que ele tentou abrir e aciona o popup global
        pendingAction.value = newAlbum
        isConflictModalOpen.value = true
        return false 
    }

    // Ação acionada pelo Modal de Conflito: O usuário quer voltar pro rascunho antigo
    const resumeDraft = () => {
        isConflictModalOpen.value = false
        pendingAction.value = null
        
        // Empurra (la ele) direto pra tela de review expandida do rascunho salvo!
        if (activeDraft.value?.album?.id) {
            router.push(`/albums/${activeDraft.value.album.id}/review`)
        }
    }

    // Ação acionada pelo Modal de Conflito: O usuário jogou o rascunho no lixo
    const discardDraft = () => {
        clearDraft()
        isConflictModalOpen.value = false
        
        // Agora nós devolvemos o álbum que ele tinha tentado abrir para a view lidar com ele
        const albumToOpen = pendingAction.value
        pendingAction.value = null
        return albumToOpen 
    }

    return {
        activeDraft,
        isConflictModalOpen,
        pendingAction,
        hasActiveDraft,
        draftAverage,
        initDraft,
        clearDraft,
        tryOpenAlbum,
        resumeDraft,
        discardDraft
    }
})