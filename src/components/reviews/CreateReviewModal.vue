<script setup>
import { ref, computed, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import SpotifyService from '@/services/spotify_service'
import ReviewService from '@/services/review_service'

const props = defineProps({
    isOpen: Boolean,
    album: Object
})

const emit = defineEmits(['close', 'success'])
const tracks = ref([])
const reviewText = ref('')
const isLoadingTracks = ref(false)
const isSubmitting = ref(false)
const error = ref(null)
const isLegacyMode = ref(false)

const LEGACY_OPTIONS = [
    { label: '👑👑👑', value: 10.0, risk: false },
    { label: '👑👑', value: 9.9, risk: false },
    { label: '👑', value: 9.5, risk: false },
    { label: '#', value: 9.0, risk: false },
    { label: '##', value: 8.5, risk: false },
    { label: '###', value: 7.5, risk: false },
    { label: 'good', value: 6.5, risk: false },
    { label: 'mid', value: 6.0, risk: false },
    { label: 'bad', value: 4.5, risk: false },
    { label: '~~bad~~', value: 3.0, risk: true },
    { label: '~~bad~~ 💀', value: 0.0, risk: true },
];

watch(() => props.isOpen, async (isOpen) => {
    if (isOpen && props.album?.id) {
        await fetchTracks()
    } else {
        tracks.value = []
        reviewText.value = ''
        error.value = null
        isLegacyMode.value = false
    }
})

const fetchTracks = async () => {
    try {
        isLoadingTracks.value = true
        const data = await SpotifyService.getAlbumDetails(props.album.id)
        const trackList = data.tracks?.items || data.tracks || []

        tracks.value = trackList.map(t => ({
            id: t.id,
            name: t.name,
            track_number: t.track_number,
            userScore: 5.0
        }))
    } catch (e) {
        console.error(e)
        error.value = "Não foi possível carregar as faixas deste álbum."
    } finally {
        isLoadingTracks.value = false
    }
}

const isTrackRisky = (score) => {
    if (!isLegacyMode.value) return false;
    const option = LEGACY_OPTIONS.find(opt => Math.abs(opt.value - score) < 0.001);
    return option ? option.risk : false;
}

const currentAverage = computed(() => {
    if (tracks.value.length === 0) return "0.0"
    const total = tracks.value.reduce((acc, t) => acc + (Number(t.userScore) || 0), 0)
    return (total / tracks.value.length).toFixed(1)
})

const handleSubmit = async () => {
    try {
        isSubmitting.value = true
        error.value = null

        const payload = {
            album: {
                id: props.album.id,
                name: props.album.name,
                artist: props.album.artist,
                cover: props.album.cover_url
            },
            tracks: tracks.value.map(t => ({
                id: t.id,
                name: t.name,
                track_number: t.track_number,
                userScore: Number(t.userScore)
            })),
            review_text: reviewText.value
        }

        await ReviewService.createReview(payload)
        emit('success')
        closeModal()
    } catch (e) {
        error.value = e.response?.data?.message || "Erro ao salvar review."
    } finally {
        isSubmitting.value = false
    }
}

const closeModal = () => emit('close')
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">

            <div class="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200
                  bg-white text-gray-900 border border-gray-200
                  dark:bg-[#121212] dark:text-white dark:border-[#282828]">

                <div class="flex flex-col gap-4 p-6 border-b 
                    bg-gray-50 border-gray-100
                    dark:bg-[#181818] dark:border-[#282828]">

                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-4">
                            <img :src="album?.cover_url" class="w-16 h-16 rounded shadow-lg object-cover" />
                            <div>
                                <h2 class="text-xl font-bold leading-tight truncate">{{ album?.name }}</h2>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ album?.artist }}</p>
                            </div>
                        </div>
                        <button @click="closeModal" class="p-2 rounded-full transition-colors 
                                                 text-gray-400 hover:bg-gray-200 hover:text-gray-900
                                                 dark:hover:bg-white/10 dark:hover:text-white">
                            <X :size="24" />
                        </button>
                    </div>

                    <div class="flex justify-center mt-2">
                        <div class="flex p-1 rounded-lg w-full max-w-sm
                            bg-gray-200 
                            dark:bg-[#0a0a0a]">

                            <button @click="isLegacyMode = false"
                                class="flex-1 py-1.5 text-sm font-bold rounded-md transition-all duration-200" :class="!isLegacyMode
                                    ? 'bg-white text-gray-900 shadow-sm dark:bg-[#282828] dark:text-white'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'">
                                Numérico
                            </button>

                            <button @click="isLegacyMode = true"
                                class="flex-1 py-1.5 text-sm font-bold rounded-md transition-all duration-200" :class="isLegacyMode
                                    ? 'bg-white text-gray-900 shadow-sm dark:bg-[#282828] dark:text-white'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'">
                                Legado
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                    <div v-if="isLoadingTracks"
                        class="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
                        <Loader2 class="animate-spin" :size="32" />
                        <p>Carregando faixas...</p>
                    </div>

                    <div v-else class="space-y-1">
                        <div v-for="track in tracks" :key="track.id" class="flex items-center gap-4 py-2 px-2 rounded transition-colors group
                        hover:bg-gray-50 dark:hover:bg-white/5">

                            <span class="w-6 text-sm text-center font-mono text-gray-400">{{ track.track_number
                            }}</span>

                            <div class="flex-1 min-w-0">
                                <p class="text-base font-medium truncate transition-all" :class="[
                                    isTrackRisky(track.userScore) ? 'line-through text-gray-400 opacity-60' : 'text-gray-900 dark:text-gray-100'
                                ]" :title="track.name">
                                    {{ track.name }}
                                </p>
                            </div>

                            <div class="w-32 md:w-40 flex justify-end">

                                <select v-if="isLegacyMode" v-model.number="track.userScore" class="w-full text-sm rounded py-2 px-3 border outline-none appearance-none cursor-pointer text-right font-medium transition-colors
                           bg-gray-100 border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary
                           dark:bg-[#2a2a2a] dark:border-transparent dark:text-white" style="text-align-last: right;">
                                    <option v-for="opt in LEGACY_OPTIONS" :key="opt.value" :value="opt.value">
                                        {{ opt.label }}
                                    </option>
                                </select>

                                <input v-else type="number" v-model.number="track.userScore" min="0" max="10" step="0.5"
                                    class="w-20 text-right font-bold rounded py-2 px-3 border outline-none transition-colors
                           bg-gray-100 border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary
                           dark:bg-[#2a2a2a] dark:border-transparent dark:text-white" />
                            </div>
                        </div>

                        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-[#282828]">
                            <textarea v-model="reviewText" rows="4" placeholder="O que você achou do álbum?" class="w-full p-4 rounded-xl outline-none resize-none transition-all
                       bg-gray-50 border border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400
                       dark:bg-[#2a2a2a] dark:border-transparent dark:text-white dark:placeholder-gray-500"></textarea>
                        </div>
                    </div>

                    <div v-if="error" class="p-3 rounded-lg text-sm border text-center
                                   bg-red-50 text-red-600 border-red-100
                                   dark:bg-red-900/50 dark:text-red-200 dark:border-red-800">
                        {{ error }}
                    </div>

                </div>

                <div class="p-4 border-t flex justify-end items-center gap-4
                    bg-gray-50 border-gray-100
                    dark:bg-[#181818] dark:border-[#282828]">

                    <div class="mr-auto flex items-center gap-2">
                        <span class="text-sm uppercase font-bold text-gray-400">Média:</span>
                        <span class="text-2xl font-black text-gray-900 dark:text-white">{{ currentAverage }}</span>
                    </div>

                    <button @click="closeModal" class="px-6 py-3 rounded-full font-bold text-sm transition-all
                                             text-gray-500 hover:text-gray-900 hover:bg-gray-200
                                             dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10">
                        Cancelar
                    </button>

                    <button @click="handleSubmit" :disabled="isSubmitting || isLoadingTracks"
                        class="bg-primary text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-105 hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center shadow-lg shadow-primary/20">
                        <Loader2 v-if="isSubmitting" class="animate-spin mr-2" :size="18" />
                        {{ isSubmitting ? 'Publicando...' : 'Publicar Review' }}
                    </button>
                </div>

            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #555;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #bbb;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #888;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>