/**
 * Soma a duração de um array de faixas e retorna no formato do Spotify (ex: "37min 54s" ou "1 h 15 min")
 */
export function formatAlbumDuration(tracks = []) {
    if (!tracks || tracks.length === 0) return '0 s'

    const totalMs = tracks.reduce((acc, track) => acc + (Number(track.duration_ms) || 0), 0)
    const totalSeconds = Math.floor(totalMs / 1000)
    
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours}h ${minutes}min`
    }
    
    return `${minutes}min ${seconds}s`
}

/**
 * Pega uma data no formato "YYYY-MM-DD" e retorna apenas o ano
 */
export function getReleaseYear(dateString) {
    if (!dateString) return ''
    return dateString.split('-')[0]
}

/**
 * Retorna o tempo decorrido de forma curta e agnóstica (ex: 15m, 2h, 1d)
 */
export function timeAgo(dateString) {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    
    // Converter para minutos
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) {
        return diffMins <= 0 ? 'agora' : `${diffMins}m`
    }

    // Converter para horas
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) {
        return `${diffHours}h`
    }

    // Converter para dias
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d`
}

/**
 * Formata uma data para exibição em português (ex: "12 de jan. de 2025")
 */
export function formatDate(dateString) {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}