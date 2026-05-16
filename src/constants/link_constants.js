import { Home, Search, Library, BookOpen } from 'lucide-vue-next'

export const SIDEBAR_LINKS = [
    { 
        name: 'Início', 
        to: '/', 
        icon: Home, 
        requiresAuth: false 
    },
    { 
        name: 'Explorar', 
        to: '/search', 
        icon: Search, 
        requiresAuth: false 
    },
    { 
        name: 'Sua Biblioteca', 
        to: '/library', 
        icon: Library, 
        requiresAuth: true 
    },
    { 
        name: 'Blog', 
        to: '/blog', 
        icon: BookOpen, 
        requiresAuth: false 
    }
]

export const MENTION_ROUTES = {
    REVIEW: (mention) => ({ name: 'review-details', params: { id: mention.target_id } }),
    ARTIST: (mention) => ({ name: 'artist', params: { id: mention.target_id } }),
    ALBUM: (mention) => ({ name: 'create-review', params: { id: mention.target_id } }),
    TRACK: (mention) => ({ name: 'create-review', params: { id: mention.spotify_album_id } })
}