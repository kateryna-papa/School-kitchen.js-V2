/*
class ApiService {
    constructor(baseUrl) {
        this.url = baseUrl
    }

    async createOrder(order) {
        try {
            const request = new Request(this.url + '/order.json', {
                method: 'POST',
                body: JSON.stringify(order)
            })
            const response = await fetch(request)
            return await response.json()
        } catch (error) {
            console.error(error )
        }

    }
}
export const apiService = new ApiService('https://school-kitchen-b274e-default-rtdb.firebaseio.com');*/
