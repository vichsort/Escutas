import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth_store'
import { useBlogStore } from '@/stores/blog_store'
import { MENTION_ROUTES } from '@/constants/link_constants'
import { useToast } from '@/composables/useToast'

export function useBlogPost() {
    const { toastError, toastSuccess } = useToast()
    const router = useRouter()
    const authStore = useAuthStore()
    const blogStore = useBlogStore()

    const post = computed(() => blogStore.currentPost)
    const isLoading = computed(() => blogStore.isLoading.post)
    const isActing = computed(() => blogStore.isLoading.action)
    const error = computed(() => blogStore.error)

    const isOwner = computed(() =>
        authStore.user && post.value && authStore.user.id === post.value.author?.id
    )

    const fetchPost = async (slug) => {
        try {
            await blogStore.fetchPostBySlug(slug)
        } catch {
            router.push('/blog')
        }
    }

    const handleDelete = async () => {
        if (!post.value) return
        try {
            await blogStore.deletePost(post.value.id)
            toastSuccess('Post deletado.')
            router.push('/blog')
        } catch (e) {
            toastError(e.response?.data?.message || 'Erro ao deletar post.')
        }
    }

    const handleTogglePublish = async () => {
        if (!post.value) return
        const newStatus = post.value.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
        try {
            await blogStore.updatePost(post.value.id, { status: newStatus })
        } catch (e) {
            toastError(e.response?.data?.message || 'Erro ao salvar.')
        }
    }

    const handleEdit = () => {
        if (!post.value) return
        router.push({ name: 'blog-edit', params: { id: post.value.id } })
    }

    const resolveMentionRoute = (mention) => MENTION_ROUTES[mention.target_type]?.(mention) ?? null

    return {
        post,
        isLoading,
        isActing,
        error,
        isOwner,
        fetchPost,
        handleDelete,
        handleTogglePublish,
        handleEdit,
        resolveMentionRoute
    }
}