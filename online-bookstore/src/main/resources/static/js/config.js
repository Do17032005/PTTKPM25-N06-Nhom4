// config.js - Configuration file

// API Base URL
const API_URL = 'http://localhost:8080/api';

// API Endpoints
const API_ENDPOINTS = {
    books: {
        getAll: `${API_URL}/books`,
        getById: (id) => `${API_URL}/books/${id}`,
        create: `${API_URL}/books`,
        update: (id) => `${API_URL}/books/${id}`,
        delete: (id) => `${API_URL}/books/${id}`,
        searchByTitle: (title) => `${API_URL}/books/search/title?title=${encodeURIComponent(title)}`,
        searchByAuthor: (author) => `${API_URL}/books/search/author?author=${encodeURIComponent(author)}`,
        getAvailable: `${API_URL}/books/available`
    },
    users: {
        getAll: `${API_URL}/users`,
        getById: (id) => `${API_URL}/users/${id}`,
        getByEmail: (email) => `${API_URL}/users/email/${email}`,
        create: `${API_URL}/users`,
        update: (id) => `${API_URL}/users/${id}`,
        delete: (id) => `${API_URL}/users/${id}`
    },
    borrows: {
        getAll: `${API_URL}/borrows`,
        create: (userId, bookId) => `${API_URL}/borrows?userId=${userId}&bookId=${bookId}`,
        return: (id) => `${API_URL}/borrows/${id}/return`,
        getUserHistory: (userId) => `${API_URL}/borrows/user/${userId}`,
        getActiveBorrows: (userId) => `${API_URL}/borrows/user/${userId}/active`,
        getOverdue: `${API_URL}/borrows/overdue`
    }
};

// Application Settings
const APP_CONFIG = {
    borrowPeriodDays: 14,
    finePerDay: 5000,
    maxBooksPerUser: 5,
    dateFormat: 'dd/MM/yyyy'
};

// User Roles
const USER_ROLES = {
    ADMIN: 'ADMIN',
    LIBRARIAN: 'LIBRARIAN',
    MEMBER: 'MEMBER'
};

// Borrow Status
const BORROW_STATUS = {
    BORROWED: 'BORROWED',
    RETURNED: 'RETURNED',
    OVERDUE: 'OVERDUE'
};

// Messages
const MESSAGES = {
    success: {
        bookAdded: '✅ Thêm sách thành công!',
        bookUpdated: '✅ Cập nhật sách thành công!',
        bookDeleted: '✅ Xóa sách thành công!',
        userAdded: '✅ Thêm người dùng thành công!',
        userUpdated: '✅ Cập nhật người dùng thành công!',
        userDeleted: '✅ Xóa người dùng thành công!',
        bookBorrowed: '✅ Mượn sách thành công!',
        bookReturned: '✅ Trả sách thành công!'
    },
    error: {
        bookNotFound: '❌ Không tìm thấy sách!',
        userNotFound: '❌ Không tìm thấy người dùng!',
        emailExists: '❌ Email đã tồn tại!',
        noConnection: '❌ Không thể kết nối đến server!',
        noCopiesAvailable: '❌ Không còn sách để mượn!',
        genericError: '❌ Có lỗi xảy ra!'
    },
    confirm: {
        deleteBook: 'Bạn có chắc muốn xóa sách này?',
        deleteUser: 'Bạn có chắc muốn xóa người dùng này?',
        returnBook: 'Xác nhận trả sách?'
    }
};