import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth_store'

const HomeView = () => import('@/views/HomeView.vue')
const SearchView = () => import('@/views/SearchView.vue')
const BlogList = () => import('@/views/blog/BlogList.vue')
const Callback = () => import('@/views/auth/Callback.vue')
const LibraryView = () => import('@/views/LibraryView.vue')
const ReviewDetailsView = () => import('@/views/reviews/ReviewDetailsView.vue')
const CreateReviewView = () => import('@/views/CreateReviewView.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView
        },
        {
            path: '/blog',
            name: 'blog',
            component: BlogList
        },
        {
            path: '/auth/callback',
            name: 'auth-callback',
            component: Callback
        },
        {
            path: '/library',
            name: 'library',
            component: LibraryView,
            meta: { requiresAuth: true }
        },
        {
            path: '/reviews/:id',
            name: 'review-details',
            component: ReviewDetailsView,
            meta: { requiresAuth: true }
        },
        {
            path: '/albums/:id/review',
            name: 'create-review',
            component: CreateReviewView,
            meta: { requiresAuth: true }
        },
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // Se a rota exige autenticação e o usuário NÃO está logado...
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // ...redireciona para a home
        next({ name: 'home' })
    } else {
        // ...caso contrário, segue o fluxo normal
        next()
    }
})

export default router