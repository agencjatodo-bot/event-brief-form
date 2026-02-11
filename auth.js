/**
 * Event Brief Form - Authentication
 * System uwierzytelniania dla panelu administracyjnego
 */

// ============================================
// KONFIGURACJA UWIERZYTELNIANIA
// ============================================

/**
 * WAŻNE BEZPIECZEŃSTWO:
 * Hash hasła został wygenerowany używając SHA-256
 * Hasło: ToDoEvents2000#!
 * Login: todoevents
 * 
 * NIGDY nie przechowuj hasła w plain text w kodzie!
 * Hash został wygenerowany offline i nie można go odwrócić
 */

// Hash SHA-256 dla hasła "ToDoEvents2000#!"
const PASSWORD_HASH = '66417eb700a30dc7d88b10f235b38105dd18f82e2041e372a748ce45311cf8e3';

// Poprawny login
const CORRECT_USERNAME = 'todoevents';

// Klucz sesji w localStorage
const SESSION_KEY = 'admin_session_token';

// ============================================
// OBSŁUGA LOGOWANIA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('loginMessage');
    
    // Dezaktywacja przycisku
    submitButton.disabled = true;
    submitButton.textContent = 'Logowanie...';
    
    try {
        // Weryfikacja loginu
        if (username !== CORRECT_USERNAME) {
            throw new Error('Nieprawidłowy login lub hasło');
        }
        
        // Hashowanie podanego hasła
        const passwordHash = await hashPassword(password);
        
        // Weryfikacja hasła
        if (passwordHash !== PASSWORD_HASH) {
            throw new Error('Nieprawidłowy login lub hasło');
        }
        
        // Utworzenie tokenu sesji
        const sessionToken = generateSessionToken();
        
        // Zapisanie sesji w localStorage
        saveSession(sessionToken);
        
        // Przekierowanie do panelu administracyjnego
        window.location.href = 'admin-panel.html';
        
    } catch (error) {
        console.error('Błąd logowania:', error);
        showLoginMessage(error.message, 'error');
        
        // Wyczyszczenie pola hasła
        document.getElementById('password').value = '';
        
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Zaloguj się';
    }
}

// ============================================
// HASHOWANIE HASŁA (SHA-256)
// ============================================

async function hashPassword(password) {
    // Użycie Web Crypto API do hashowania
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// ============================================
// ZARZĄDZANIE SESJĄ
// ============================================

function generateSessionToken() {
    // Generowanie bezpiecznego losowego tokenu
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function saveSession(token) {
    const sessionData = {
        token: token,
        timestamp: Date.now(),
        expiresIn: 24 * 60 * 60 * 1000 // 24 godziny
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

function getSession() {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;
    
    try {
        const session = JSON.parse(sessionData);
        
        // Sprawdzenie czy sesja nie wygasła
        if (Date.now() - session.timestamp > session.expiresIn) {
            clearSession();
            return null;
        }
        
        return session;
    } catch (error) {
        console.error('Błąd odczytu sesji:', error);
        clearSession();
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function isAuthenticated() {
    return getSession() !== null;
}

// ============================================
// OCHRONA PANELU ADMINISTRACYJNEGO
// ============================================

function requireAuthentication() {
    if (!isAuthenticated()) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

function handleLogout() {
    clearSession();
    window.location.href = 'admin-login.html';
}

// ============================================
// WYŚWIETLANIE KOMUNIKATÓW
// ============================================

function showLoginMessage(message, type) {
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
}

// ============================================
// EKSPORT FUNKCJI
// ============================================

// Udostępnienie funkcji dla innych skryptów
if (typeof window !== 'undefined') {
    window.authModule = {
        isAuthenticated,
        requireAuthentication,
        handleLogout,
        clearSession
    };
}
