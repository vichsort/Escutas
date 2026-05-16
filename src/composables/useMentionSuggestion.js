import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import BlogMentionDropdown from '@/components/blog/BlogMentionDropdown.vue'
import api from '@/services/api_service'

export function useMentionSuggestion() {
    return {
        char: '@',
        minLength: 1,

        items: async ({ query }) => {
            if (!query || query.length < 2) return []
            try {
                const response = await api.get('/search/quick', { params: { q: query } })
                return response.data.data ?? []
            } catch {
                return []
            }
        },

        render: () => {
            let component
            let popup

            return {
                onStart: (props) => {
                    component = new VueRenderer(BlogMentionDropdown, {
                        props,
                        editor: props.editor
                    })

                    popup = tippy('body', {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: component.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: 'manual',
                        placement: 'bottom-start',
                    })[0]
                },

                onUpdate: (props) => {
                    component.updateProps(props)
                    popup.setProps({ getReferenceClientRect: props.clientRect })
                },

                onKeyDown: (props) => {
                    if (props.event.key === 'Escape') {
                        popup.hide()
                        return true
                    }
                    return component.ref?.onKeyDown(props) ?? false
                },

                onExit: () => {
                    popup.destroy()
                    component.destroy()
                }
            }
        }
    }
}