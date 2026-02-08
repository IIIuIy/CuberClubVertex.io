// modal.js - Управление модальными окнами

// Открытие модального окна
function openModal() {
    const modal = document.getElementById('modal');
    const loginForm = document.getElementById('loginForm');
    const registerFormEl = document.getElementById('registerForm');
    
    if (modal) {
        modal.classList.add('active');
        if (loginForm) loginForm.style.display = 'block';
        if (registerFormEl) registerFormEl.style.display = 'none';
        clearErrors();
    }
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
        clearErrors();
        clearInputs();
    }
}

// Переключение между формами
function switchForm() {
    const loginForm = document.getElementById('loginForm');
    const registerFormEl = document.getElementById('registerForm');
    
    if (loginForm && registerFormEl) {
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'block';
            registerFormEl.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerFormEl.style.display = 'block';
        }
        clearErrors();
    }
}

// Очистка ошибок
function clearErrors() {
    const errors = ['loginError', 'registerError', 'registerSuccess'];
    errors.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

// Очистка полей ввода
function clearInputs() {
    const inputs = [
        'loginUsername', 'loginPassword',
        'registerName', 'registerLogin', 'registerEmail',
        'registerPassword', 'registerPasswordConfirm'
    ];
    
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    const rulesCheckbox = document.getElementById('rules');
    if (rulesCheckbox) rulesCheckbox.checked = false;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем UI авторизации
    updateAuthUI();
    
    // Добавляем обработчик клика вне модального окна
    const modal = document.getElementById('modal');
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }
});
