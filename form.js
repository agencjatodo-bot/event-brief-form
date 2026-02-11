/**
 * Event Brief Form - Main JavaScript
 * Obsługa formularza i wysyłanie danych do Google Sheets
 */

// ============================================
// KONFIGURACJA
// ============================================

/**
 * WAŻNE: Przed wdrożeniem ustaw poniższy URL do swojego Google Apps Script Web App
 * Instrukcje w README.md wyjaśniają jak to zrobić
 */
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// ============================================
// OBSŁUGA DYNAMICZNYCH PÓL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Pokazanie pola szczegółów lokalizacji przy wyborze odpowiedniej opcji
    const locationSelect = document.getElementById('location');
    const locationDetailsGroup = document.getElementById('locationDetailsGroup');
    
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            if (this.value === 'mam_miejsce' || this.value === 'prosze_o_propozycje') {
                locationDetailsGroup.style.display = 'block';
                document.getElementById('locationDetails').required = true;
            } else {
                locationDetailsGroup.style.display = 'none';
                document.getElementById('locationDetails').required = false;
            }
        });
    }

    // Pokazanie pola szczegółów cateringu przy wyborze odpowiedniej opcji
    const cateringSelect = document.getElementById('catering');
    const cateringDetailsGroup = document.getElementById('cateringDetailsGroup');
    
    if (cateringSelect) {
        cateringSelect.addEventListener('change', function() {
            if (this.value && this.value !== 'nie_potrzebny') {
                cateringDetailsGroup.style.display = 'block';
            } else {
                cateringDetailsGroup.style.display = 'none';
            }
        });
    }

    // Obsługa wysyłania formularza
    const form = document.getElementById('eventBriefForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// ============================================
// OBSŁUGA WYSYŁANIA FORMULARZA
// ============================================

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('formMessage');
    
    // Walidacja zgody RODO
    const gdprConsent = document.getElementById('gdprConsent');
    if (!gdprConsent.checked) {
        showMessage('Musisz wyrazić zgodę na przetwarzanie danych osobowych.', 'error');
        return;
    }
    
    // Dezaktywacja przycisku i zmiana tekstu
    submitButton.disabled = true;
    submitButton.textContent = 'Wysyłanie...';
    
    try {
        // Zebranie danych z formularza
        const formData = collectFormData(form);
        
        // Wysłanie danych do Google Sheets
        const response = await submitToGoogleSheets(formData);
        
        if (response.result === 'success') {
            showMessage('Dziękujemy! Twój brief został wysłany. Skontaktujemy się z Tobą wkrótce.', 'success');
            form.reset();
            
            // Ukrycie dynamicznych pól po resecie
            document.getElementById('locationDetailsGroup').style.display = 'none';
            document.getElementById('cateringDetailsGroup').style.display = 'none';
        } else {
            throw new Error(response.error || 'Wystąpił błąd podczas wysyłania formularza');
        }
    } catch (error) {
        console.error('Błąd wysyłania formularza:', error);
        showMessage('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie lub skontaktuj się z nami bezpośrednio.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Wyślij brief';
    }
}

// ============================================
// ZBIERANIE DANYCH Z FORMULARZA
// ============================================

function collectFormData(form) {
    const formData = new FormData(form);
    
    // Zbieranie podstawowych danych
    const data = {
        timestamp: new Date().toISOString(),
        eventType: formData.get('eventType'),
        eventDate: formData.get('eventDate'),
        participants: formData.get('participants'),
        location: formData.get('location'),
        locationDetails: formData.get('locationDetails') || '',
        budget: formData.get('budget'),
        businessGoal: formData.get('businessGoal'),
        catering: formData.get('catering'),
        cateringDetails: formData.get('cateringDetails') || '',
        additionalComments: formData.get('additionalComments') || '',
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        gdprConsent: formData.get('gdprConsent') ? 'Tak' : 'Nie'
    };
    
    // Zbieranie wymagań technicznych (checkboxy)
    const techRequirements = [];
    if (formData.get('tech_multimedia')) techRequirements.push('Oprawa multimedialna');
    if (formData.get('tech_sound')) techRequirements.push('Nagłośnienie');
    if (formData.get('tech_lighting')) techRequirements.push('Oświetlenie');
    if (formData.get('tech_presentation')) techRequirements.push('Sprzęt do prezentacji');
    if (formData.get('tech_other')) techRequirements.push('Inne wymagania techniczne');
    data.technicalRequirements = techRequirements.join(', ') || 'Brak';
    
    // Zbieranie dodatkowych wymagań (checkboxy)
    const extraRequirements = [];
    if (formData.get('extra_translation')) extraRequirements.push('Tłumaczenia');
    if (formData.get('extra_accommodation')) extraRequirements.push('Nocleg dla gości');
    if (formData.get('extra_transport')) extraRequirements.push('Transport');
    if (formData.get('extra_branding')) extraRequirements.push('Branding');
    data.extraRequirements = extraRequirements.join(', ') || 'Brak';
    
    return data;
}

// ============================================
// WYSYŁANIE DO GOOGLE SHEETS
// ============================================

async function submitToGoogleSheets(data) {
    // Sprawdzenie czy URL do Google Apps Script został skonfigurowany
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        console.error('Google Apps Script URL nie został skonfigurowany!');
        throw new Error('Formularz nie został poprawnie skonfigurowany. Skontaktuj się z administratorem.');
    }
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script wymaga no-cors
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    // Z powodu no-cors nie możemy odczytać odpowiedzi, więc zakładamy sukces
    // Google Apps Script powinien być skonfigurowany do logowania błędów
    return { result: 'success' };
}

// ============================================
// WYŚWIETLANIE KOMUNIKATÓW
// ============================================

function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Przewinięcie do komunikatu
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Automatyczne ukrycie komunikatu sukcesu po 10 sekundach
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 10000);
    }
}

// ============================================
// SANITYZACJA DANYCH (XSS Protection)
// ============================================

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Eksport funkcji dla testów (jeśli potrzebne)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        collectFormData,
        sanitizeInput
    };
}
