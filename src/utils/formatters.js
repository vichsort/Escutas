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