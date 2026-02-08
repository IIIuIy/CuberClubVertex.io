// auth.js - Система аутентификации

// Получение всех пользователей из localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Сохранение пользователей в localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Получение текущего пользователя
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Сохранение текущего пользователя
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Получение бронирований пользователя
function getUserBookings() {
    const bookings = localStorage.getItem('userBookings');
    return bookings ? JSON.parse(bookings) : [];
}

// Сохранение бронирований
function saveBookings(bookings) {
    localStorage.setItem('userBookings', JSON.stringify(bookings));
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация логина (3-12 символов, только буквы и цифры)
function isValidLogin(login) {
    if (login.length < 3 || login.length > 12) return false;
    const loginRegex = /^[a-zA-Z0-9_]+$/;
    return loginRegex.test(login);
}

// Валидация имени (3-12 символов)
function isValidName(name) {
    return name.length >= 3 && name.length <= 12;
}

// Валидация пароля (минимум 8 символов)
function isValidPassword(password) {
    return password.length >= 8;
}

// Показ ошибки
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

// Показ успеха
function showSuccess(elementId, message) {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.textContent = message;
        successEl.style.display = 'block';
    }
}

// Регистрация
function register() {
    const name = document.getElementById('registerName').value.trim();
    const login = document.getElementById('registerLogin').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const rulesAccepted = document.getElementById('rules').checked;

    // Очистка предыдущих ошибок
    const errorEl = document.getElementById('registerError');
    const successEl = document.getElementById('registerSuccess');
    if (errorEl) errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';

    // Валидация
    if (!name) {
        showError('registerError', 'Введите имя');
        return;
    }

    if (!isValidName(name)) {
        showError('registerError', 'Имя должно содержать от 3 до 12 символов');
        return;
    }

    if (!login) {
        showError('registerError', 'Введите логин');
        return;
    }

    if (!isValidLogin(login)) {
        showError('registerError', 'Логин: 3-12 символов, только латиница, цифры и _');
        return;
    }

    if (!email) {
        showError('registerError', 'Введите email');
        return;
    }

    if (!isValidEmail(email)) {
        showError('registerError', 'Введите корректный email адрес');
        return;
    }

    if (!password) {
        showError('registerError', 'Введите пароль');
        return;
    }

    if (!isValidPassword(password)) {
        showError('registerError', 'Пароль должен содержать минимум 8 символов');
        return;
    }

    if (password !== passwordConfirm) {
        showError('registerError', 'Пароли не совпадают');
        return;
    }

    if (!rulesAccepted) {
        showError('registerError', 'Необходимо согласиться с правилами');
        return;
    }

    // Проверка существования пользователя
    const users = getUsers();
    const existingUser = users.find(u => u.login === login || u.email === email);

    if (existingUser) {
        if (existingUser.login === login) {
            showError('registerError', 'Пользователь с таким логином уже существует');
        } else {
            showError('registerError', 'Пользователь с таким email уже существует');
        }
        return;
    }

    // Создание нового пользователя
    const newUser = {
        id: Date.now().toString(),
        name: name,
        login: login,
        email: email,
        password: password,
        registeredAt: new Date().toISOString(),
        balance: 0
    };

    users.push(newUser);
    saveUsers(users);

    showSuccess('registerSuccess', 'Регистрация успешна! Теперь вы можете войти.');

    // Очистка формы через 2 секунды и переключение на логин
    setTimeout(() => {
        switchForm();
        clearInputs();
    }, 2000);
}

// Вход
function login() {
    const login = document.getElementById('loginUsername') ? document.getElementById('loginUsername').value.trim() : '';
    const password = document.getElementById('loginPassword') ? document.getElementById('loginPassword').value : '';

    // Очистка ошибок
    const errorEl = document.getElementById('loginError');
    if (errorEl) errorEl.style.display = 'none';

    // Валидация
    if (!login) {
        showError('loginError', 'Введите логин');
        return;
    }

    if (!password) {
        showError('loginError', 'Введите пароль');
        return;
    }

    // Поиск пользователя
    const users = getUsers();
    const user = users.find(u => u.login === login && u.password === password);

    if (!user) {
        showError('loginError', 'Неверный логин или пароль');
        return;
    }

    // Успешный вход
    setCurrentUser(user);
    if (typeof closeModal === 'function') closeModal();
    updateAuthUI();
    
    // Показываем уведомление
    alert(`Добро пожаловать, ${user.name}!`);
}

// Выход
function logout() {
    if (confirm('Вы действительно хотите выйти?')) {
        localStorage.removeItem('currentUser');
        updateAuthUI();
        // Если на странице профиля - редирект
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Обновление UI в зависимости от статуса авторизации
function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;
    
    const currentUser = getCurrentUser();

    if (currentUser) {
        authSection.innerHTML = `
            <button class="btn-login" onclick="window.location.href='profile.html'">Личный кабинет</button>
        `;
    } else {
        authSection.innerHTML = `
            <button class="btn-login" onclick="openModal()">Войти</button>
        `;
    }
}

// Проверка авторизации (для защищённых страниц)
function requireAuth() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Для доступа к этой странице необходимо войти в систему');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Создание бронирования
function createBooking(bookingData) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Необходимо войти в систему');
        return false;
    }

    const bookings = getUserBookings();
    const newBooking = {
        id: Date.now().toString(),
        userId: currentUser.id,
        ...bookingData,
        createdAt: new Date().toISOString(),
        status: 'active'
    };

    bookings.push(newBooking);
    saveBookings(bookings);
    return true;
}

// Получение бронирований конкретного пользователя
function getCurrentUserBookings() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const allBookings = getUserBookings();
    return allBookings.filter(b => b.userId === currentUser.id);
}

// Отмена бронирования
function cancelBooking(bookingId) {
    const bookings = getUserBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index !== -1) {
        bookings[index].status = 'cancelled';
        saveBookings(bookings);
        return true;
    }
    return false;
}

// Проверка, является ли пользователь администратором
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.login === 'qwerty';
}

// Админ-пароль
const ADMIN_PASSWORD = 'vertex2026admin';

// Проверка админ-пароля
function checkAdminPassword(password) {
    return password === ADMIN_PASSWORD;
}

// Получение всех пользователей (только для админа)
function getAllUsersAdmin() {
    if (!isAdmin()) return [];
    return getUsers();
}

// Получение всех бронирований (только для админа)
function getAllBookingsAdmin() {
    if (!isAdmin()) return [];
    return getUserBookings();
}
