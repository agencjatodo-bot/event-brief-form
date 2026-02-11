# Developer Guide - Event Brief Form

## 🔧 Rozszerzanie funkcjonalności

### Dodawanie nowych pól do formularza

#### 1. Dodanie pola w HTML (index.html)

```html
<div class="form-group">
    <label for="newField">Nowe pole *</label>
    <input type="text" id="newField" name="newField" required>
</div>
```

#### 2. Aktualizacja JavaScript (js/form.js)

W funkcji `collectFormData()` dodaj:

```javascript
function collectFormData(form) {
    const formData = new FormData(form);
    
    const data = {
        // ... istniejące pola
        newField: formData.get('newField'),  // <- DODAJ TO
    };
    
    return data;
}
```

#### 3. Aktualizacja Google Apps Script (google-apps-script.gs)

Dodaj nową kolumnę do `HEADERS`:

```javascript
const HEADERS = [
  'Data zgłoszenia',
  // ... istniejące kolumny
  'Nowe pole'  // <- DODAJ TO
];
```

Dodaj do `doPost()`:

```javascript
const rowData = [
  data.timestamp,
  // ... istniejące pola
  data.newField  // <- DODAJ TO
];
```

#### 4. Aktualizacja panelu admin (js/admin.js)

W funkcji `doGet()` (Google Apps Script):

```javascript
const submissions = values.map(row => ({
  timestamp: row[0],
  // ... istniejące pola
  newField: row[XX]  // <- DODAJ TO (XX to numer kolumny)
}));
```

W funkcji `showDetails()` (admin.js):

```html
<div class="detail-group">
    <div class="detail-label">Nowe pole</div>
    <div class="detail-value">${escapeHtml(submission.newField)}</div>
</div>
```

---

### Dodawanie walidacji custom

#### W JavaScript (js/form.js)

```javascript
function validateCustomField(value) {
    // Przykład: walidacja numeru NIP
    const nipRegex = /^\d{10}$/;
    return nipRegex.test(value);
}

// W handleFormSubmit przed wysłaniem:
const nip = formData.get('nip');
if (!validateCustomField(nip)) {
    showMessage('Nieprawidłowy numer NIP', 'error');
    return;
}
```

#### W HTML5

```html
<input 
    type="text" 
    pattern="[0-9]{10}" 
    title="NIP musi składać się z 10 cyfr"
    required
>
```

---

### Dodawanie nowych typów eventów

#### 1. Zaktualizuj select w HTML

```html
<select id="eventType" name="eventType" required>
    <option value="">Wybierz typ eventu</option>
    <!-- ... istniejące opcje -->
    <option value="nowy_typ">Nowy typ eventu</option>
</select>
```

#### 2. Dodaj mapowanie w admin.js

```javascript
const eventTypeLabels = {
    // ... istniejące
    'nowy_typ': 'Nowy typ eventu'
};
```

---

### Integracja z innymi systemami

#### Wysyłanie emaili z powiadomieniem

W Google Apps Script dodaj funkcję:

```javascript
function sendEmailNotification(data) {
  const recipient = 'admin@todo.net.pl';
  const subject = 'Nowe zgłoszenie briefu eventowego';
  const body = `
    Nowe zgłoszenie od: ${data.company}
    Kontakt: ${data.email}
    Typ eventu: ${data.eventType}
    Data: ${data.eventDate}
    
    Zobacz szczegóły w arkuszu.
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}

// Wywołaj w doPost() po zapisaniu danych:
sendEmailNotification(data);
```

#### Integracja ze Slack

```javascript
function sendSlackNotification(data) {
  const webhookUrl = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';
  
  const payload = {
    text: `Nowe zgłoszenie briefu`,
    attachments: [{
      color: '#E31E24',
      fields: [
        { title: 'Firma', value: data.company, short: true },
        { title: 'Typ eventu', value: data.eventType, short: true },
        { title: 'Data', value: data.eventDate, short: true },
        { title: 'Kontakt', value: data.email, short: true }
      ]
    }]
  };
  
  UrlFetchApp.fetch(webhookUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
}
```

---

### Eksport danych do innych formatów

#### CSV Export w panelu admin

Dodaj do admin.js:

```javascript
function exportToCSV() {
    const headers = ['Data zgłoszenia', 'Firma', 'Email', 'Typ eventu'];
    const rows = filteredSubmissions.map(sub => [
        new Date(sub.timestamp).toLocaleDateString('pl-PL'),
        sub.company,
        sub.email,
        sub.eventType
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zgłoszenia.csv';
    a.click();
}

// Dodaj przycisk w admin-panel.html:
<button onclick="exportToCSV()" class="btn btn-secondary">
    Eksportuj CSV
</button>
```

---

### Tworzenie dashboardu z statystykami

#### Dodaj sekcję statystyk w admin-panel.html

```html
<div class="stats-dashboard">
    <div class="stat-card">
        <h3>Najpopularniejszy typ eventu</h3>
        <p id="popularEventType">-</p>
    </div>
    <div class="stat-card">
        <h3>Średni budżet</h3>
        <p id="averageBudget">-</p>
    </div>
    <div class="stat-card">
        <h3>Zgłoszenia w tym miesiącu</h3>
        <p id="monthlySubmissions">-</p>
    </div>
</div>
```

#### Dodaj obliczenia w admin.js

```javascript
function calculateStats() {
    // Najpopularniejszy typ eventu
    const typeCounts = {};
    allSubmissions.forEach(sub => {
        typeCounts[sub.eventType] = (typeCounts[sub.eventType] || 0) + 1;
    });
    const mostPopular = Object.keys(typeCounts).reduce((a, b) => 
        typeCounts[a] > typeCounts[b] ? a : b
    );
    
    // Zgłoszenia w tym miesiącu
    const now = new Date();
    const thisMonth = allSubmissions.filter(sub => {
        const subDate = new Date(sub.timestamp);
        return subDate.getMonth() === now.getMonth() && 
               subDate.getFullYear() === now.getFullYear();
    }).length;
    
    // Aktualizacja DOM
    document.getElementById('popularEventType').textContent = mostPopular;
    document.getElementById('monthlySubmissions').textContent = thisMonth;
}
```

---

### Rate limiting i ochrona przed spamem

#### W Google Apps Script

```javascript
function checkRateLimit(email) {
  const cache = CacheService.getScriptCache();
  const key = 'rate_limit_' + email;
  const submissions = cache.get(key);
  
  if (submissions >= 5) {
    throw new Error('Zbyt wiele zgłoszeń. Spróbuj ponownie za godzinę.');
  }
  
  cache.put(key, (parseInt(submissions) || 0) + 1, 3600); // 1 godzina
}

// Wywołaj w doPost() przed zapisaniem:
checkRateLimit(data.email);
```

#### Google reCAPTCHA v3

1. Zarejestruj się na https://www.google.com/recaptcha/admin
2. Dodaj klucze do HTML:

```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
```

3. Przed wysłaniem formularza:

```javascript
grecaptcha.ready(function() {
    grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'})
    .then(function(token) {
        // Dodaj token do formData
        formData.append('recaptcha_token', token);
        // Wyślij formularz
    });
});
```

4. Weryfikuj w Google Apps Script używając UrlFetchApp

---

### Wersjonowanie danych

#### Dodaj wersjonowanie w Google Sheets

```javascript
function createVersionedEntry(data) {
  const sheet = getOrCreateSheet();
  const historySheet = getOrCreateSheet('Historia_Zmian');
  
  // Zapisz główny wpis
  sheet.appendRow([/* ... */]);
  
  // Zapisz w historii
  historySheet.appendRow([
    new Date().toISOString(),
    'CREATE',
    JSON.stringify(data),
    Session.getActiveUser().getEmail()
  ]);
}
```

---

### Backup automatyczny

#### Skrypt Google Apps Script do tworzenia kopii

```javascript
function createBackup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const backupFolder = DriveApp.getFolderById('FOLDER_ID');
  const timestamp = Utilities.formatDate(new Date(), 
    Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
  
  const backup = ss.copy('Backup_' + timestamp);
  DriveApp.getFileById(backup.getId()).moveTo(backupFolder);
}

// Ustaw trigger: Edit > Current project's triggers
// Funkcja: createBackup
// Typ: Time-driven
// Częstotliwość: Codziennie o 2:00
```

---

## 📊 Monitoring i analityka

### Google Analytics

Dodaj do `<head>` we wszystkich plikach HTML:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Śledzenie konwersji

```javascript
// Po wysłaniu formularza w form.js
gtag('event', 'conversion', {
    'send_to': 'GA_MEASUREMENT_ID/CONVERSION_ID',
    'value': 1.0,
    'currency': 'PLN'
});
```

---

## 🧪 Testowanie

### Unit testy (Jest)

```javascript
// form.test.js
const { collectFormData, sanitizeInput } = require('./form.js');

test('sanitizeInput removes HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
});
```

### E2E testy (Playwright)

```javascript
// tests/form.spec.js
const { test, expect } = require('@playwright/test');

test('submit event brief form', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    await page.fill('#firstName', 'Jan');
    await page.fill('#lastName', 'Kowalski');
    await page.fill('#email', 'jan@example.com');
    // ... wypełnij resztę pól
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.form-message.success'))
        .toBeVisible();
});
```

---

## 🚀 Performance optimization

### Lazy loading obrazów

```html
<img src="assets/logo.png" loading="lazy" alt="TODO Logo">
```

### Minifikacja CSS i JS

```bash
# Zainstaluj terser dla JS
npm install -g terser

# Minifikacja
terser js/form.js -o js/form.min.js -c -m

# Użyj .min.js w produkcji
<script src="js/form.min.js"></script>
```

### Caching

Dodaj do `<head>`:

```html
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

---

## 🔐 Security enhancements

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://www.google.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

### Subresource Integrity

```html
<link rel="stylesheet" 
      href="css/styles.css" 
      integrity="sha384-HASH_HERE" 
      crossorigin="anonymous">
```

Generuj hash:

```bash
openssl dgst -sha384 -binary css/styles.css | openssl base64 -A
```

---

## 📱 Progressive Web App (PWA)

### manifest.json

```json
{
  "name": "Event Brief Form - TODO",
  "short_name": "TODO Brief",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#E31E24",
  "icons": [
    {
      "src": "assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

```javascript
// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/styles.css',
        '/js/form.js'
      ]);
    })
  );
});
```

---

Powodzenia w rozwijaniu projektu! 🎉
