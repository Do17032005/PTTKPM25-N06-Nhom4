// main.js - Main Application Logic

// Tab Navigation
function showTab(tabName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'dashboard') loadDashboard();
    if (tabName === 'books') loadBooks();
    if (tabName === 'users') loadUsers();
    if (tabName === 'borrows') loadBorrows();
}

// Modal Management
function openAddBookModal() {
    document.getElementById('addBookModal').classList.add('active');
}

function openAddUserModal() {
    document.getElementById('addUserModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// ============== DASHBOARD ==============
async function loadDashboard() {
    try {
        const [books, users, borrows] = await Promise.all([
            ApiService.books.getAll(),
            ApiService.users.getAll(),
            ApiService.borrows.getAll()
        ]);

        document.getElementById('totalBooks').textContent = books.length;
        document.getElementById('availableBooks').textContent = 
            books.filter(b => b.availableCopies > 0).length;
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('activeBorrows').textContent = 
            borrows.filter(b => b.status === 'BORROWED').length;

        const overdue = await ApiService.borrows.getOverdue();
        displayOverdue(overdue);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayOverdue(records) {
    const container = document.getElementById('overdueList');
    if (records.length === 0) {
        container.innerHTML = '<p style="color: #48bb78; padding: 20px; text-align: center;">✅ Không có sách quá hạn</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Sách</th>
                    <th>Người mượn</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${records.map(r => `
                    <tr>
                        <td>${r.book.title}</td>
                        <td>${r.user.fullName}</td>
                        <td>${r.borrowDate}</td>
                        <td>${r.dueDate}</td>
                        <td>
                            <button class="btn btn-warning" onclick="returnBook(${r.id})">Trả sách</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ============== BOOKS ==============
async function loadBooks() {
    try {
        const books = await ApiService.books.getAll();
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('booksList').innerHTML = 
            '<p class="loading">❌ Không thể tải danh sách sách</p>';
    }
}

function displayBooks(books) {
    const container = document.getElementById('booksList');
    if (books.length === 0) {
        container.innerHTML = '<p class="loading">Không có sách nào</p>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="card">
            <h3>${book.title}</h3>
            <p><strong>Tác giả:</strong> ${book.author}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Thể loại:</strong> ${book.category}</p>
            <p><strong>Số lượng:</strong> ${book.availableCopies}/${book.totalCopies} 
                ${book.availableCopies > 0 ? 
                    '<span class="badge badge-success">Có sẵn</span>' : 
                    '<span class="badge badge-danger">Hết sách</span>'}
            </p>
            ${book.description ? `<p>${book.description}</p>` : ''}
            <div class="card-actions">
                <button class="btn btn-danger" onclick="deleteBook(${book.id})">Xóa</button>
            </div>
        </div>
    `).join('');
}

async function searchBooks() {
    const title = document.getElementById('searchBookTitle').value;
    const author = document.getElementById('searchBookAuthor').value;

    try {
        let books;
        if (title) {
            books = await ApiService.books.searchByTitle(title);
        } else if (author) {
            books = await ApiService.books.searchByAuthor(author);
        } else {
            books = await ApiService.books.getAll();
        }
        displayBooks(books);
    } catch (error) {
        console.error('Error searching books:', error);
        alert(MESSAGES.error.noConnection);
    }
}

async function addBook(event) {
    event.preventDefault();

    const book = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookIsbn').value,
        publisher: document.getElementById('bookPublisher').value,
        publishDate: document.getElementById('bookPublishDate').value || null,
        category: document.getElementById('bookCategory').value,
        totalCopies: parseInt(document.getElementById('bookCopies').value),
        description: document.getElementById('bookDescription').value
    };

    try {
        await ApiService.books.create(book);
        alert(MESSAGES.success.bookAdded);
        closeModal('addBookModal');
        loadBooks();
        event.target.reset();
    } catch (error) {
        console.error('Error adding book:', error);
        alert(MESSAGES.error.genericError);
    }
}

async function deleteBook(id) {
    if (!confirm(MESSAGES.confirm.deleteBook)) return;

    try {
        await ApiService.books.delete(id);
        alert(MESSAGES.success.bookDeleted);
        loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
        alert(MESSAGES.error.genericError);
    }
}

// ============== EDIT BOOK ==============
async function openEditBookModal(bookId) {
    try {
        const book = await ApiService.books.getById(bookId);
        document.getElementById('editBookId').value = book.id;
        document.getElementById('editBookTitle').value = book.title || '';
        document.getElementById('editBookAuthor').value = book.author || '';
        document.getElementById('editBookIsbn').value = book.isbn || '';
        document.getElementById('editBookPublisher').value = book.publisher || '';
        document.getElementById('editBookPublishDate').value = book.publishDate || '';
        document.getElementById('editBookCategory').value = book.category || '';
        document.getElementById('editBookCopies').value = book.totalCopies || 0;
        document.getElementById('editBookDescription').value = book.description || '';
        const modal = new bootstrap.Modal(document.getElementById('editBookModal'));
        modal.show();
    } catch (error) {
        console.error('Error opening edit book modal:', error);
        alert(MESSAGES.error.genericError);
    }
}

async function updateBook(event) {
    event.preventDefault();
    const id = document.getElementById('editBookId').value;
    const book = {
        title: document.getElementById('editBookTitle').value,
        author: document.getElementById('editBookAuthor').value,
        isbn: document.getElementById('editBookIsbn').value,
        publisher: document.getElementById('editBookPublisher').value,
        publishDate: document.getElementById('editBookPublishDate').value || null,
        category: document.getElementById('editBookCategory').value,
        totalCopies: parseInt(document.getElementById('editBookCopies').value) || 0,
        description: document.getElementById('editBookDescription').value
    };

    try {
        await ApiService.books.update(id, book);
        alert(MESSAGES.success.bookUpdated || 'Cập nhật thành công');
        const modalEl = document.getElementById('editBookModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        loadBooks();
    } catch (error) {
        console.error('Error updating book:', error);
        alert(MESSAGES.error.genericError);
    }
}

// ============== EDIT USER ==============
async function openEditUserModal(userId) {
    try {
        const user = await ApiService.users.getById(userId);
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserFullName').value = user.fullName || '';
        document.getElementById('editUserEmail').value = user.email || '';
        document.getElementById('editUserPhone').value = user.phone || '';
        document.getElementById('editUserAddress').value = user.address || '';
        document.getElementById('editUserRole').value = user.role || 'MEMBER';
        document.getElementById('editUserPassword').value = '';
        const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
        modal.show();
    } catch (error) {
        console.error('Error opening edit user modal:', error);
        alert(MESSAGES.error.genericError);
    }
}

async function updateUser(event) {
    event.preventDefault();
    const id = document.getElementById('editUserId').value;
    const user = {
        fullName: document.getElementById('editUserFullName').value,
        email: document.getElementById('editUserEmail').value,
        phone: document.getElementById('editUserPhone').value,
        address: document.getElementById('editUserAddress').value,
        role: document.getElementById('editUserRole').value
    };
    const password = document.getElementById('editUserPassword').value;
    if (password) user.password = password;

    try {
        await ApiService.users.update(id, user);
        alert(MESSAGES.success.userUpdated || 'Cập nhật người dùng thành công');
        const modalEl = document.getElementById('editUserModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        loadUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        alert(MESSAGES.error.genericError);
    }
}

// ============== USERS ==============
async function loadUsers() {
    try {
        const users = await ApiService.users.getAll();
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersList');
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${user.phone || 'N/A'}</td>
                        <td><span class="badge badge-info">${user.role}</span></td>
                        <td>${user.active ? 
                            '<span class="badge badge-success">Hoạt động</span>' : 
                            '<span class="badge badge-danger">Vô hiệu hóa</span>'}
                        </td>
                        <td>
                            <button class="btn btn-secondary me-2" onclick="openEditUserModal(${user.id})">Sửa</button>
                            <button class="btn btn-danger" onclick="deleteUser(${user.id})">Xóa</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function addUser(event) {
    event.preventDefault();

    const user = {
        fullName: document.getElementById('userFullName').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        phone: document.getElementById('userPhone').value,
        address: document.getElementById('userAddress').value,
        role: document.getElementById('userRole').value
    };

    try {
        await ApiService.users.create(user);
        alert(MESSAGES.success.userAdded);
        closeModal('addUserModal');
        loadUsers();
        event.target.reset();
    } catch (error) {
        console.error('Error adding user:', error);
        alert(MESSAGES.error.emailExists);
    }
}

async function deleteUser(id) {
    if (!confirm(MESSAGES.confirm.deleteUser)) return;

    try {
        await ApiService.users.delete(id);
        alert(MESSAGES.success.userDeleted);
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert(MESSAGES.error.genericError);
    }
}

// ============== BORROWS ==============
async function loadBorrows() {
    try {
        const borrows = await ApiService.borrows.getAll();
        displayBorrows(borrows);
    } catch (error) {
        console.error('Error loading borrows:', error);
    }
}

function displayBorrows(borrows) {
    const container = document.getElementById('borrowsList');
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Sách</th>
                    <th>Người mượn</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                    <th>Ngày trả</th>
                    <th>Trạng thái</th>
                    <th>Phí phạt</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${borrows.map(borrow => `
                    <tr>
                        <td>${borrow.id}</td>
                        <td>${borrow.book.title}</td>
                        <td>${borrow.user.fullName}</td>
                        <td>${borrow.borrowDate}</td>
                        <td>${borrow.dueDate}</td>
                        <td>${borrow.returnDate || 'Chưa trả'}</td>
                        <td>
                            ${borrow.status === 'BORROWED' ? 
                                '<span class="badge badge-warning">Đang mượn</span>' : 
                                '<span class="badge badge-success">Đã trả</span>'}
                        </td>
                        <td>${borrow.fineAmount > 0 ? borrow.fineAmount.toLocaleString('vi-VN') + ' đ' : '0 đ'}</td>
                        <td>
                            ${borrow.status === 'BORROWED' ? 
                                `<button class="btn btn-warning" onclick="returnBook(${borrow.id})">Trả sách</button>` :
                                '<span class="badge badge-success">Đã hoàn tất</span>'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function borrowBook() {
    const userId = document.getElementById('borrowUserId').value;
    const bookId = document.getElementById('borrowBookId').value;

    if (!userId || !bookId) {
        alert('Vui lòng nhập ID người dùng và ID sách!');
        return;
    }

    try {
        await ApiService.borrows.create(parseInt(userId), parseInt(bookId));
        alert(MESSAGES.success.bookBorrowed);
        document.getElementById('borrowUserId').value = '';
        document.getElementById('borrowBookId').value = '';
        loadBorrows();
        loadBooks();
    } catch (error) {
        console.error('Error borrowing book:', error);
        alert(MESSAGES.error.noCopiesAvailable);
    }
}

async function returnBook(recordId) {
    if (!confirm(MESSAGES.confirm.returnBook)) return;

    try {
        await ApiService.borrows.return(recordId);
        alert(MESSAGES.success.bookReturned);
        loadBorrows();
        loadBooks();
    } catch (error) {
        console.error('Error returning book:', error);
        alert(MESSAGES.error.genericError);
    }
}

// Initialize on page load
window.addEventListener('load', function() {
    loadDashboard();
});