/**
 * Event Brief Form - Admin Panel
 * Pobieranie i wyświetlanie zgłoszeń z Google Sheets
 */

// ============================================
// KONFIGURACJA
// ============================================

/**
 * WAŻNE: Przed wdrożeniem ustaw poniższy URL do swojego Google Apps Script Web App
 * Ten sam URL co w form.js, ale z parametrem action=read
 */
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// Przechowywanie danych zgłoszeń
let allSubmissions = [];
let filteredSubmissions = [];

// ============================================
// INICJALIZACJA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Sprawdzenie uwierzytelnienia
    if (!window.authModule.requireAuthentication()) {
        return;
    }
    
    // Inicjalizacja obsługi zdarzeń
    initializeEventHandlers();
    
    // Pobranie danych
    loadSubmissions();
});

// ============================================
// OBSŁUGA ZDARZEŃ
// ============================================

function initializeEventHandlers() {
    // Przycisk odświeżania
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadSubmissions);
    }
    
    // Przycisk wylogowania
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', window.authModule.handleLogout);
    }
    
    // Wyszukiwanie
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterSubmissions);
    }
    
    // Filtrowanie po typie eventu
    const filterType = document.getElementById('filterType');
    if (filterType) {
        filterType.addEventListener('change', filterSubmissions);
    }
    
    // Zamykanie modala
    const modal = document.getElementById('detailsModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    });
    
    // Zamykanie modala kliknięciem poza nim
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// ============================================
// POBIERANIE DANYCH Z GOOGLE SHEETS
// ============================================

async function loadSubmissions() {
    const loadingDiv = document.getElementById('loadingMessage');
    const errorDiv = document.getElementById('errorMessage');
    const tableContainer = document.getElementById('tableContainer');
    
    // Pokazanie loadera
    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    tableContainer.style.display = 'none';
    
    try {
        // Sprawdzenie konfiguracji URL
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            throw new Error('Google Apps Script URL nie został skonfigurowany. Zobacz README.md.');
        }
        
        // Pobranie danych z Google Sheets
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=read`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result === 'success') {
            allSubmissions = data.data || [];
            filteredSubmissions = [...allSubmissions];
            
            // Wyświetlenie danych
            displaySubmissions();
            updateStats();
            
            // Pokazanie tabeli
            loadingDiv.style.display = 'none';
            tableContainer.style.display = 'block';
            
        } else {
            throw new Error(data.error || 'Nieznany błąd podczas pobierania danych');
        }
        
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        loadingDiv.style.display = 'none';
        errorDiv.textContent = `Błąd: ${error.message}`;
        errorDiv.style.display = 'block';
    }
}

// ============================================
// WYŚWIETLANIE ZGŁOSZEŃ W TABELI
// ============================================

function displaySubmissions() {
    const tbody = document.getElementById('submissionsBody');
    tbody.innerHTML = '';
    
    if (filteredSubmissions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                    Brak zgłoszeń do wyświetlenia
                </td>
            </tr>
        `;
        return;
    }
    
    // Sortowanie od najnowszych
    const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    sortedSubmissions.forEach((submission, index) => {
        const row = createSubmissionRow(submission, index);
        tbody.appendChild(row);
    });
}

function createSubmissionRow(submission, index) {
    const tr = document.createElement('tr');
    
    // Formatowanie daty zgłoszenia
    const submissionDate = new Date(submission.timestamp);
    const formattedDate = submissionDate.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Formatowanie typu eventu
    const eventTypeLabels = {
        'konferencja': 'Konferencja',
        'konferencja_prasowa': 'Konferencja prasowa',
        'szkolenie': 'Szkolenie',
        'integracja': 'Event integracyjny',
        'gala': 'Gala',
        'targi': 'Targi',
        'event_hybrydowy': 'Event hybrydowy',
        'piknik': 'Piknik firmowy',
        'jubileusz': 'Jubileusz firmowy',
        'inne': 'Inne'
    };
    
    tr.innerHTML = `
        <td>${formattedDate}</td>
        <td><strong>${escapeHtml(submission.company)}</strong></td>
        <td>
            ${escapeHtml(submission.firstName)} ${escapeHtml(submission.lastName)}<br>
            <small style="color: var(--color-text-secondary);">${escapeHtml(submission.email)}</small>
        </td>
        <td>${eventTypeLabels[submission.eventType] || submission.eventType}</td>
        <td>${escapeHtml(submission.eventDate)}</td>
        <td>${escapeHtml(submission.participants)}</td>
        <td>${escapeHtml(submission.budget)}</td>
        <td>
            <button class="btn-details" onclick="showDetails(${index})">
                Szczegóły
            </button>
        </td>
    `;
    
    return tr;
}

// ============================================
// WYŚWIETLANIE SZCZEGÓŁÓW ZGŁOSZENIA
// ============================================

function showDetails(index) {
    const submission = filteredSubmissions[index];
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');
    
    // Formatowanie celu biznesowego
    const businessGoalLabels = {
        'networking': 'Networking',
        'szkolenie': 'Szkolenie',
        'integracja': 'Integracja zespołu',
        'promocja': 'Promocja produktu/usługi',
        'wizerunek': 'Budowanie wizerunku',
        'inne': 'Inny cel'
    };
    
    // Formatowanie opcji lokalizacji
    const locationLabels = {
        'mam_miejsce': 'Mam już wybrane miejsce',
        'prosze_o_propozycje': 'Proszę o propozycje'
    };
    
    // Formatowanie opcji cateringu
    const cateringLabels = {
        'nie_potrzebny': 'Nie potrzebny',
        'kawa_herbata': 'Kawa/herbata/przekąski',
        'lunch': 'Lunch',
        'kolacja': 'Kolacja',
        'full_day': 'Catering całodzienny',
        'bankiet': 'Bankiet'
    };
    
    modalBody.innerHTML = `
        <div class="detail-group">
            <div class="detail-label">Data zgłoszenia</div>
            <div class="detail-value">${new Date(submission.timestamp).toLocaleString('pl-PL')}</div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Dane kontaktowe</div>
            <div class="detail-value">
                <strong>${escapeHtml(submission.firstName)} ${escapeHtml(submission.lastName)}</strong><br>
                Firma: ${escapeHtml(submission.company)}<br>
                Email: <a href="mailto:${escapeHtml(submission.email)}" style="color: var(--color-primary);">${escapeHtml(submission.email)}</a><br>
                Telefon: <a href="tel:${escapeHtml(submission.phone)}" style="color: var(--color-primary);">${escapeHtml(submission.phone)}</a>
            </div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Typ eventu</div>
            <div class="detail-value">${escapeHtml(submission.eventType)}</div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Planowana data</div>
            <div class="detail-value">${escapeHtml(submission.eventDate)}</div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Liczba uczestników</div>
            <div class="detail-value">${escapeHtml(submission.participants)}</div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Lokalizacja</div>
            <div class="detail-value">
                ${locationLabels[submission.location] || submission.location}
                ${submission.locationDetails ? `<br><em>${escapeHtml(submission.locationDetails)}</em>` : ''}
            </div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Budżet</div>
            <div class="detail-value">${escapeHtml(submission.budget)}</div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Cel biznesowy</div>
            <div class="detail-value">${businessGoalLabels[submission.businessGoal] || submission.businessGoal}</div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Wymagania techniczne</div>
            <div class="detail-value">${escapeHtml(submission.technicalRequirements || 'Brak')}</div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Catering</div>
            <div class="detail-value">
                ${cateringLabels[submission.catering] || submission.catering}
                ${submission.cateringDetails ? `<br><em>${escapeHtml(submission.cateringDetails)}</em>` : ''}
            </div>
        </div>
        
        <div class="detail-group">
            <div class="detail-label">Dodatkowe wymagania</div>
            <div class="detail-value">${escapeHtml(submission.extraRequirements || 'Brak')}</div>
        </div>
        
        ${submission.additionalComments ? `
            <div class="detail-group">
                <div class="detail-label">Dodatkowe uwagi</div>
                <div class="detail-value">${escapeHtml(submission.additionalComments)}</div>
            </div>
        ` : ''}
        
        <div class="detail-group">
            <div class="detail-label">Zgoda RODO</div>
            <div class="detail-value">${submission.gdprConsent === 'Tak' ? '✓ Wyrażona' : '✗ Nie wyrażona'}</div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Udostępnienie funkcji globalnie dla onclick
window.showDetails = showDetails;

// ============================================
// FILTROWANIE I WYSZUKIWANIE
// ============================================

function filterSubmissions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    
    filteredSubmissions = allSubmissions.filter(submission => {
        // Filtrowanie po wyszukiwanej frazie
        const matchesSearch = 
            submission.company.toLowerCase().includes(searchTerm) ||
            submission.lastName.toLowerCase().includes(searchTerm) ||
            submission.firstName.toLowerCase().includes(searchTerm) ||
            submission.email.toLowerCase().includes(searchTerm);
        
        // Filtrowanie po typie eventu
        const matchesType = !filterType || submission.eventType === filterType;
        
        return matchesSearch && matchesType;
    });
    
    displaySubmissions();
    updateStats();
}

// ============================================
// AKTUALIZACJA STATYSTYK
// ============================================

function updateStats() {
    const totalElement = document.getElementById('totalSubmissions');
    const lastUpdateElement = document.getElementById('lastUpdate');
    
    if (totalElement) {
        totalElement.textContent = filteredSubmissions.length;
    }
    
    if (lastUpdateElement) {
        const now = new Date();
        lastUpdateElement.textContent = now.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// ============================================
// FUNKCJE POMOCNICZE
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// AUTOMATYCZNE ODŚWIEŻANIE (opcjonalne)
// ============================================

// Odświeżanie co 5 minut
// Odkomentuj poniższą linię aby włączyć automatyczne odświeżanie
// setInterval(loadSubmissions, 5 * 60 * 1000);
