import api from '@/services/api_service'

class WrappedService {
    async generateMonthlyWrapped(payload = {}) {
        // payload: { month: 4, year: 2026 } (Opcional, backend assume a data atual se vazio)
        const response = await api.post('/wrapped/generate-monthly', payload)
        return response.data
    }
}

export default new WrappedService()