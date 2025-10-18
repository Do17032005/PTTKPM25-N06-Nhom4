// api.js - API Service for handling HTTP requests

const ApiService = {
    // Generic GET request
    async get(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('GET request error:', error);
            throw error;
        }
    },

    // Generic POST request
    async post(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('POST request error:', error);
            throw error;
        }
    },

    // Generic PUT request
    async put(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('PUT request error:', error);
            throw error;
        }
    },

    // Generic DELETE request
    async delete(url) {
        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error('DELETE request error:', error);
            throw error;
        }
    },

    // Books API
    books: {
        async getAll() {
            return await ApiService.get(API_ENDPOINTS.books.getAll);
        },

        async getById(id) {
            return await ApiService.get(API_ENDPOINTS.books.getById(id));
        },

        async create(bookData) {
            return await ApiService.post(API_ENDPOINTS.books.create, bookData);
        },

        async update(id, bookData) {
            return await ApiService.put(API_ENDPOINTS.books.update(id), bookData);
        },

        async delete(id) {
            return await ApiService.delete(API_ENDPOINTS.books.delete(id));
        },

        async searchByTitle(title) {
            return await ApiService.get(API_ENDPOINTS.books.searchByTitle(title));
        },

        async searchByAuthor(author) {
            return await ApiService.get(API_ENDPOINTS.books.searchByAuthor(author));
        },

        async getAvailable() {
            return await ApiService.get(API_ENDPOINTS.books.getAvailable);
        }
    },

    // Users API
    users: {
        async getAll() {
            return await ApiService.get(API_ENDPOINTS.users.getAll);
        },

        async getById(id) {
            return await ApiService.get(API_ENDPOINTS.users.getById(id));
        },

        async getByEmail(email) {
            return await ApiService.get(API_ENDPOINTS.users.getByEmail(email));
        },

        async create(userData) {
            return await ApiService.post(API_ENDPOINTS.users.create, userData);
        },

        async update(id, userData) {
            return await ApiService.put(API_ENDPOINTS.users.update(id), userData);
        },

        async delete(id) {
            return await ApiService.delete(API_ENDPOINTS.users.delete(id));
        }
    },

    // Borrows API
    borrows: {
        async getAll() {
            return await ApiService.get(API_ENDPOINTS.borrows.getAll);
        },

        async create(userId, bookId) {
            return await ApiService.post(API_ENDPOINTS.borrows.create(userId, bookId));
        },

        async return(id) {
            return await ApiService.put(API_ENDPOINTS.borrows.return(id));
        },

        async getUserHistory(userId) {
            return await ApiService.get(API_ENDPOINTS.borrows.getUserHistory(userId));
        },

        async getActiveBorrows(userId) {
            return await ApiService.get(API_ENDPOINTS.borrows.getActiveBorrows(userId));
        },

        async getOverdue() {
            return await ApiService.get(API_ENDPOINTS.borrows.getOverdue);
        }
    }
};