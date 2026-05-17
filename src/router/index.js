import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth_store'
import { useLoadingStore } from '@/stores/loading_store'

const HomeView = () => import('@/views/HomeView.vue')
const SearchView = () => import('@/views/SearchView.vue')
const Callback = () => import('@/views/auth/Callback.vue')
const LibraryView = () => import('@/views/LibraryView.vue')
const DraftsView = () => import('@/views/DraftsView.vue')
const ReviewDetailsView = () => import('@/views/review/DetailsView.vue')
const CreateReviewView = () => import('@/views/CreateReviewView.vue')
const ArtistView = () => import('@/views/ArtistView.vue')
const BlogHomeView = () => import('@/views/blog/Index.vue')
const BlogWriteView = () => import('@/views/blog/WriteView.vue')
const BlogPostView = () => import('@/views/blog/PostView.vue')
const MeIndex = () => import('@/views/me/Index.vue')
const MeCalendar = () => import('@/views/me/Calendar.vue')
const MePlatinums = () => import('@/views/me/Platinums.vue')
const MeTierlist = () => import('@/views/me/TierlistView.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/search', name: 'search', component: SearchView },
        { path: '/auth/callback', name: 'auth-callback', component: Callback },
        { path: '/library', name: 'library', component: LibraryView, meta: { requiresAuth: true } },
        { path: '/library/drafts', name: 'drafts', component: DraftsView, meta: { requiresAuth: true } },
        { path: '/reviews/:id', name: 'review-details', component: ReviewDetailsView, meta: { requiresAuth: true } },
        { path: '/albums/:id/review', name: 'create-review', component: CreateReviewView, meta: { requiresAuth: true, layout: 'review' } },
        { path: '/artists/:id', name: 'artist', component: ArtistView, meta: { requiresAuth: true } },
        { path: '/blog', name: 'blog-home', component: BlogHomeView },
        { path: '/blog/write', name: 'blog-write', component: BlogWriteView, meta: { requiresAuth: true } },
        { path: '/blog/write/:id', name: 'blog-edit', component: BlogWriteView, meta: { requiresAuth: true } },
        { path: '/blog/:slug', name: 'blog-post', component: BlogPostView, meta: { requiresAuth: true } },
        { path: '/me', name: 'me', component: MeIndex, meta: { requiresAuth: true } },
        { path: '/me/calendar', name: 'me-calendar', component: MeCalendar, meta: { requiresAuth: true } },
        { path: '/me/platinums', name: 'me-platinums', component: MePlatinums, meta: { requiresAuth: true } },
        { path: '/me/tierlist', name: 'me-tierlist', component: MeTierlist, meta: { requiresAuth: true } },
    ]
})

// Antes da rota mudar
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const loadingStore = useLoadingStore()

    // Usuário tenta acessar rota protegida sem estar logado
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Ligamos a tela cheia com uma mensagem de aviso para quebrar o choque
        loadingStore.start('Você precisa estar logado para acessar a biblioteca.')

        // Redireciona para a home
        next({ name: 'home' })
    } else {
        // Rota de Callback do Spotify: Ligamos o loader aqui. 
        // Ele ficará girando até o Callback.vue terminar de falar com a API e desligá-lo.
        if (to.name === 'auth-callback') {
            loadingStore.start('Sincronizando com o Spotify...')
        }
        next()
    }
})

// Depois que a rota já mudou
router.afterEach((to, from) => {
    const loadingStore = useLoadingStore()

    // Se acabamos de sofrer um "Redirect Humanizado" para a Home, 
    // seguramos o overlay por 1.5s para o usuário ter tempo de ler a mensagem.
    if (to.name === 'home' && from.meta && from.meta.requiresAuth) {
        setTimeout(() => {
            loadingStore.stop()
        }, 1500)
    }
})

export default router