import { defineStore } from 'pinia'
import { ref } from 'vue'
import blogService from '@/services/blog_service'

export const useBlogStore = defineStore('blog', () => {
    const postsPagination = ref({
        items: [],
        page: 1,
        per_page: 10,
        total: 0,
        has_next: false
    })
    
    const myPostsPagination = ref({
        items: [],
        page: 1,
        per_page: 10,
        total: 0,
        has_next: false
    })

    const currentPost = ref(null)

    const isLoading = ref({
        list: false,
        post: false,
        action: false
    })
    const error = ref(null)

    async function fetchPosts(page = 1, perPage = 10, reset = false) {
        if (reset) {
            postsPagination.value.items = []
        }
        
        isLoading.value.list = true
        error.value = null
        try {
            const data = await blogService.listPosts(page, perPage)
            
            if (reset) {
                postsPagination.value.items = data.items || data.data || []
            } else {
                postsPagination.value.items = [...postsPagination.value.items, ...(data.items || data.data || [])]
            }
            
            postsPagination.value.page = page
            postsPagination.value.per_page = perPage
            postsPagination.value.total = data.total_items || data.total || postsPagination.value.items.length
            postsPagination.value.has_next = page < (data.total_pages || data.pages || 1)
            
        } catch (err) {
            console.error('Erro ao listar posts:', err)
            error.value = 'Falha ao carregar os artigos do blog.'
        } finally {
            isLoading.value.list = false
        }
    }

    async function fetchMyPosts(page = 1, perPage = 10, status = null, reset = false) {
        if (reset) myPostsPagination.value.items = []

        isLoading.value.list = true
        error.value = null
        try {
            const data = await blogService.listMyPosts(page, perPage, status)

            if (reset) {
                myPostsPagination.value.items = data.items || []
            } else {
                myPostsPagination.value.items = [...myPostsPagination.value.items, ...(data.items || [])]
            }

            myPostsPagination.value.page = page
            myPostsPagination.value.per_page = perPage
            myPostsPagination.value.total = data.total || myPostsPagination.value.items.length
            myPostsPagination.value.has_next = page < (data.pages || 1)

        } catch (err) {
            console.error('Erro ao listar meus posts:', err)
            error.value = 'Falha ao carregar seus posts.'
        } finally {
            isLoading.value.list = false
        }
    }

    async function fetchPostBySlug(slug) {
        isLoading.value.post = true
        error.value = null
        try {
            currentPost.value = await blogService.getPostBySlug(slug)
            return currentPost.value
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar o post.'
            throw err
        } finally {
            isLoading.value.post = false
        }
    }

    async function createPost(payload) {
        isLoading.value.action = true
        error.value = null
        try {
            const newPost = await blogService.createPost(payload)
            return newPost
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao criar o rascunho.'
            throw err
        } finally {
            isLoading.value.action = false
        }
    }

    async function updatePost(postId, payload) {
        isLoading.value.action = true
        error.value = null
        try {
            const updatedPost = await blogService.updatePost(postId, payload)
            // Se o post atualizado for o que está aberto na tela, atualiza localmente
            if (currentPost.value && currentPost.value.id === postId) {
                currentPost.value = updatedPost
            }
            return updatedPost
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao atualizar o post.'
            throw err
        } finally {
            isLoading.value.action = false
        }
    }

    async function deletePost(postId) {
        isLoading.value.action = true
        error.value = null
        try {
            await blogService.deletePost(postId)
            postsPagination.value.items = postsPagination.value.items.filter(p => p.id !== postId)
            if (currentPost.value && currentPost.value.id === postId) {
                currentPost.value = null
            }
            return true
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao deletar o post.'
            throw err
        } finally {
            isLoading.value.action = false
        }
    }

    return {
        postsPagination,
        myPostsPagination,
        currentPost,
        isLoading,
        error,
        fetchPosts,
        fetchMyPosts,
        fetchPostBySlug,
        createPost,
        updatePost,
        deletePost
    }
})