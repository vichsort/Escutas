import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const ReviewsList = () => import('@/views/reviews/ReviewsList.vue')
const BlogList = () => import('@/views/blog/BlogList.vue')
const Callback = () => import('@/views/auth/Callback.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/reviews',
            name: 'reviews',
            component: ReviewsList
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
        }
    ]
})

export default router