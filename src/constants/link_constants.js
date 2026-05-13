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