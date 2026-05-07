import api from '@/services/api_service'

class BlogService {
    async listPosts(page = 1, perPage = 10) {
        const response = await api.get('/blog', { 
            params: { page, per_page: perPage } 
        })
        return response.data.data
    }

    async getPostBySlug(slug) {
        const response = await api.get(`/blog/${slug}`)
        return response.data.data
    }

    async createPost(payload) {
        // payload esperado: { title, content, mentions: [...] }
        const response = await api.post('/blog', payload)
        return response.data.data
    }

    async updatePost(postId, payload) {
        const response = await api.put(`/blog/${postId}`, payload)
        return response.data.data
    }

    async deletePost(postId) {
        const response = await api.delete(`/blog/${postId}`)
        return response.data
    }
}

export default new BlogService()