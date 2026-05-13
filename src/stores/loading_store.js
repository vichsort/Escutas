import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { useIntervalFn } from '@vueuse/core'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const message = ref('')
  const currentMessageIndex = ref(0)

  const loadingMessages = [
    'Eu sempre estou escutando...',
    'O homem é lobo do homem...',
    'ESSA é a melhor do álbum...',
    'Afinando os instrumentos...',
    'Tirando o disco da capa...',
    'Limpando a agulha...',
    'Sincronizando com o Spotify...',
    'Carregando as melhores reviews...',
    'Preparando o palco...',
    'Ajustando o volume...'
  ]

  const { pause, resume } = useIntervalFn(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % loadingMessages.value.length
    message.value = loadingMessages.value[currentMessageIndex.value]
  }, 3000, { immediate: false })

  function start(customMessage = null) {
    if (customMessage) {
      message.value = customMessage
      pause() // Não rotaciona se a mensagem for específica
    } else {
      currentMessageIndex.value = 0
      message.value = loadingMessages[0]
      resume() // Inicia a rotação
    }
    isLoading.value = true
  }

  /**
   * Interrompe o loading e limpa o estado.
   */
  function stop() {
    isLoading.value = false
    pause()
    // Pequeno delay para resetar a mensagem e evitar "flicker" de texto mudando no fade-out
    setTimeout(() => {
      message.value = ''
    }, 300)
  }

  return {
    isLoading: readonly(isLoading),
    message: readonly(message),
    start,
    stop
  }
})