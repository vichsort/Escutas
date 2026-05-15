import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useDraftsStore = defineStore('drafts', () => {

    // estado persistente
    const drafts = useLocalStorage('review-drafts', {})

    // getters
    const allDrafts = computed(() => {
        return Object.values(drafts.value).sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt)
        })
    })

    const getDraftAverage = (albumId) => {
        const draft = drafts.value[albumId]
        if (!draft || !draft.tracks) return "0.0"
        
        const validTracks = draft.tracks.filter(t => !t.isIgnored)
        if (validTracks.length === 0) return "0.0"

        const total = validTracks.reduce((acc, t) => acc + (Number(t.userScore) || 0), 0)
        return (total / validTracks.length).toFixed(1)
    }

    const initDraft = (albumData, tracksData) => {
        const albumId = albumData.id

        if (!drafts.value[albumId]) {
            drafts.value[albumId] = {
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
                    duration_ms: t.duration_ms || 0,
                    userScore: 5.0,
                    isIgnored: t.suggested_ignore || false
                })),
                reviewText: '',
                isLegacyMode: false,
                updatedAt: new Date().toISOString()
            }
        }
    }

    const deleteDraft = (albumId) => {
        if (drafts.value[albumId]) {
            delete drafts.value[albumId]
        }
    }

    const touchDraft = (albumId) => {
        if (drafts.value[albumId]) {
            drafts.value[albumId].updatedAt = new Date().toISOString()
        }
    }

    return {
        drafts,
        allDrafts,
        getDraftAverage,
        initDraft,
        deleteDraft,
        touchDraft
    }
})