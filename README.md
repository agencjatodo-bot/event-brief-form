# Event Brief Form - Formularz Briefowy TODO

System formularza briefowego dla klientów zainteresowanych organizacją eventów, zintegrowany z Google Sheets i wyposażony w panel administracyjny.

## 📋 Spis treści

1. [Opis projektu](#opis-projektu)
2. [Funkcjonalności](#funkcjonalności)
3. [Technologie](#technologie)
4. [Struktura projektu](#struktura-projektu)
5. [Instalacja i konfiguracja](#instalacja-i-konfiguracja)
6. [Dostosowanie wizualne](#dostosowanie-wizualne)
7. [Bezpieczeństwo](#bezpieczeństwo)
8. [FAQ](#faq)
9. [Wsparcie](#wsparcie)

---

## 🎯 Opis projektu

Formularz briefowy TODO to profesjonalne narzędzie do zbierania informacji od klientów zainteresowanych organizacją eventów. System został zaprojektowany z myślą o:
- Minimalizacji wymian emailowych potrzebnych do uzyskania pełnego briefu
- Profesjonalnym wizerunku marki zgodnym z identyfikacją wizualną TODO
- Bezpiecznym przechowywaniu danych z poszanowaniem RODO
- Łatwym dostępie do zgłoszeń dla uprawnionych osób

## ✨ Funkcjonalności

### Dla klientów:
- ✅ Intuicyjny formularz z przemyślaną strukturą pytań
- ✅ Responsywny design (działa na telefonach, tabletach i komputerach)
- ✅ Automatyczna walidacja danych
- ✅ Zgodność z RODO (zgoda na przetwarzanie danych)
- ✅ Profesjonalny design w kolorach TODO (czarny, biały, czerwony)

### Dla administratorów:
- ✅ Bezpieczny panel logowania
- ✅ Przeglądanie wszystkich zgłoszeń w tabeli
- ✅ Filtrowanie po typie eventu
- ✅ Wyszukiwanie po firmie, nazwisku lub emailu
- ✅ Szczegółowy widok każdego zgłoszenia
- ✅ Automatyczne przechowywanie w Google Sheets

## 🛠 Technologie

- **Frontend**: HTML5, CSS3 (Flexbox, Grid), JavaScript (ES6+)
- **Stylowanie**: Font Montserrat (Google Fonts), własne CSS zgodne z TODO
- **Backend**: Google Apps Script (darmowe, bez potrzeby serwera)
- **Baza danych**: Google Sheets (darmowe, bez limitu)
- **Hosting**: GitHub Pages (darmowy)
- **Bezpieczeństwo**: SHA-256 hashing, localStorage sessions

## 📁 Struktura projektu

```
event-brief-form/
├── index.html                    # Główny formularz dla klientów
├── admin-login.html             # Strona logowania administratora
├── admin-panel.html             # Panel administracyjny
├── css/
│   └── styles.css               # Style (TODO: czarny, biały, czerwony)
├── js/
│   ├── form.js                  # Logika formularza i wysyłanie
│   ├── auth.js                  # System uwierzytelniania
│   └── admin.js                 # Panel administracyjny
├── assets/
│   ├── logo.png                 # Logo firmy (do podmiany)
│   └── polityka_prywatnosci.pdf # Polityka prywatności (do dodania)
├── google-apps-script.gs        # Kod dla Google Apps Script
├── .gitignore                   # Pliki wykluczane z repo
└── README.md                    # Ten plik
```

---

## 🚀 Instalacja i konfiguracja

### Krok 1: Fork lub klon repozytorium

```bash
# Sklonuj repozytorium
git clone https://github.com/twoje-konto/event-brief-form.git
cd event-brief-form
```

### Krok 2: Dodanie logo i polityki prywatności

#### Logo:
1. Przygotuj logo w formacie PNG (zalecane wymiary: 200x80px lub podobne proporcje)
2. Nazwij plik: `logo.png`
3. Umieść w folderze `/assets/`
4. Zastąp istniejący plik placeholder

**Alternatywnie** możesz użyć SVG lub innego formatu:
- Otwórz plik `index.html`
- Znajdź linię: `<img src="assets/logo.png" alt="TODO Logo" class="logo" id="companyLogo">`
- Zmień ścieżkę na: `assets/twoje-logo.svg` (lub inny format)

#### Polityka prywatności:
1. Przygotuj dokument PDF z polityką prywatności
2. Nazwij plik: `polityka_prywatnosci.pdf`
3. Umieść w folderze `/assets/`

**Zawartość polityki powinna obejmować:**
- Administratora danych (TODO)
- Cel przetwarzania (przygotowanie oferty i obsługa eventu)
- Podstawę prawną (zgoda)
- Okres przechowywania danych
- Prawa osób, których dane dotyczą

### Krok 3: Konfiguracja Google Sheets

#### 3.1. Utworzenie arkusza Google Sheets

1. Przejdź do [Google Sheets](https://sheets.google.com)
2. Kliknij **"+ Pusty"** aby utworzyć nowy arkusz
3. Nazwij arkusz np. "Event Brief - Zgłoszenia"

#### 3.2. Dodanie skryptu Google Apps Script

1. W Google Sheets kliknij: **Rozszerzenia** → **Apps Script**
2. Usuń domyślny kod
3. Skopiuj cały kod z pliku `google-apps-script.gs`
4. Wklej do edytora Apps Script
5. Kliknij ikonę **dyskietki** 💾 aby zapisać
6. Nazwij projekt: "Event Brief API"

#### 3.3. Testowanie skryptu (opcjonalne)

1. W edytorze Apps Script wybierz funkcję: `testSetup`
2. Kliknij **Uruchom** (▶️)
3. Przy pierwszym uruchomieniu zostaniesz poproszony o autoryzację:
   - Kliknij **"Sprawdź uprawnienia"**
   - Wybierz swoje konto Google
   - Kliknij **"Zaawansowane"** → **"Przejdź do ... (niebezpieczne)"**
   - Kliknij **"Zezwól"**
4. Sprawdź logi: **Widok** → **Logi** (powinno być "Setup zakończony pomyślnie!")

#### 3.4. Wdrożenie Web App

1. W edytorze Apps Script kliknij: **Deploy** → **New deployment**
2. Kliknij ikonę **koła zębatego** ⚙️ → Wybierz **"Web app"**
3. Skonfiguruj deployment:
   - **Description**: Event Brief Form API
   - **Execute as**: Me (twoje konto)
   - **Who has access**: Anyone
4. Kliknij **"Deploy"**
5. **SKOPIUJ URL WEB APP** (będzie wyglądał jak: `https://script.google.com/macros/s/AKfyc...`)

⚠️ **WAŻNE**: Ten URL będzie potrzebny w następnym kroku!

### Krok 4: Konfiguracja JavaScript

#### 4.1. Aktualizacja form.js

1. Otwórz plik `js/form.js`
2. Znajdź linię:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Zastąp `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` skopiowanym URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfyc...';
   ```

#### 4.2. Aktualizacja admin.js

1. Otwórz plik `js/admin.js`
2. Znajdź linię:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Wklej ten sam URL co w `form.js`

### Krok 5: Deployment na GitHub Pages

#### 5.1. Utworzenie repozytorium na GitHub

1. Zaloguj się na [GitHub](https://github.com)
2. Kliknij **"+"** → **"New repository"**
3. Nazwij repozytorium: `event-brief-form`
4. Ustaw jako **Public**
5. Kliknij **"Create repository"**

#### 5.2. Push kodu do GitHub

```bash
# Inicjalizacja Git (jeśli jeszcze nie zrobione)
git init

# Dodanie wszystkich plików
git add .

# Commit
git commit -m "Initial commit: Event Brief Form"

# Dodanie remote
git remote add origin https://github.com/twoje-konto/event-brief-form.git

# Push
git branch -M main
git push -u origin main
```

#### 5.3. Aktywacja GitHub Pages

1. W repozytorium na GitHub przejdź do: **Settings** → **Pages**
2. W sekcji **"Source"** wybierz:
   - Branch: `main`
   - Folder: `/ (root)`
3. Kliknij **"Save"**
4. Poczekaj 1-2 minuty
5. Odśwież stronę - pojawi się link do twojej strony:
   ```
   https://twoje-konto.github.io/event-brief-form/
   ```

### Krok 6: Testowanie

#### Test 1: Formularz klienta
1. Otwórz: `https://twoje-konto.github.io/event-brief-form/`
2. Wypełnij formularz testowymi danymi
3. Zaznacz zgodę RODO
4. Kliknij **"Wyślij brief"**
5. Sprawdź czy pojawił się komunikat sukcesu
6. Otwórz Google Sheets - powinien pojawić się nowy wiersz z danymi

#### Test 2: Panel administracyjny
1. Otwórz: `https://twoje-konto.github.io/event-brief-form/admin-login.html`
2. Zaloguj się:
   - **Login**: `todoevents`
   - **Hasło**: `ToDoEvents2000#!`
3. Sprawdź czy widzisz zgłoszenie z testu 1
4. Kliknij **"Szczegóły"** aby zobaczyć pełne informacje

---

## 🎨 Dostosowanie wizualne

### Zmiana koloru czerwonego

Jeśli chcesz dostosować odcień czerwieni do dokładnego dopasowania z todo.net.pl:

1. Otwórz plik `css/styles.css`
2. Znajdź sekcję **ZMIENNE KOLORYSTYCZNE**:
   ```css
   :root {
       --color-primary: #E31E24;        /* <- ZMIEŃ TEN KOLOR */
       --color-primary-dark: #B71C1C;   /* <- I TEN (ciemniejsza wersja) */
   ```
3. Zastąp wartości kolorów swoimi odcieniami
4. Zapisz i przetestuj

**Wskazówka**: Użyj narzędzia color picker na stronie todo.net.pl aby pobrać dokładny odcień czerwieni.

### Zmiana fontu

Domyślnie używany jest font **Montserrat** z Google Fonts. Jeśli chcesz użyć innego:

1. Otwórz `css/styles.css`
2. Zmień:
   ```css
   --font-primary: 'Montserrat', sans-serif;
   ```
3. Jeśli używasz innego Google Font, zaktualizuj link w `<head>` w plikach HTML:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=TwojFont:wght@300;400;600;700&display=swap" rel="stylesheet">
   ```

### Zmiana tekstu placeholder w formularzuach

Możesz dostosować teksty pomocnicze w polach formularza:

1. Otwórz `index.html`
2. Znajdź odpowiednie `<input>` lub `<textarea>`
3. Zmień atrybut `placeholder`:
   ```html
   <input type="text" placeholder="Twój nowy tekst">
   ```

---

## 🔒 Bezpieczeństwo

### Dane logowania administratora

**WAŻNE**: Dane logowania są obecnie:
- **Login**: `todoevents`
- **Hasło**: `ToDoEvents2000#!`

#### Jak zmienić hasło?

1. Wygeneruj hash SHA-256 dla nowego hasła:
   - Otwórz konsolę przeglądarki (F12)
   - Wklej i uruchom:
     ```javascript
     async function hashPassword(password) {
       const encoder = new TextEncoder();
       const data = encoder.encode(password);
       const hash = await crypto.subtle.digest('SHA-256', data);
       const hashArray = Array.from(new Uint8Array(hash));
       return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
     }
     hashPassword('TwojeNoweHaslo').then(console.log);
     ```
2. Skopiuj wygenerowany hash
3. Otwórz `js/auth.js`
4. Zamień wartość `PASSWORD_HASH`:
   ```javascript
   const PASSWORD_HASH = 'twoj-nowy-hash';
   ```

#### Jak zmienić login?

1. Otwórz `js/auth.js`
2. Zmień:
   ```javascript
   const CORRECT_USERNAME = 'twoj-nowy-login';
   ```

### Ochrona przed XSS

System automatycznie zabezpiecza dane przed atakami XSS poprzez:
- Funkcję `escapeHtml()` w panelu administracyjnym
- Funkcję `sanitizeInput()` w formularzu
- Prawidłowe użycie `textContent` zamiast `innerHTML` dla danych użytkownika

### Sesje administratora

- Sesje wygasają po 24 godzinach
- Token sesji jest przechowywany w localStorage
- Po wylogowaniu token jest usuwany

### CORS i Google Apps Script

Google Apps Script wymaga trybu `no-cors` dla żądań POST, co oznacza że:
- Nie można odczytać odpowiedzi serwera w JavaScript
- Błędy są logowane w Google Apps Script (sprawdź: **Executions**)
- Zakładamy sukces jeśli żądanie nie rzuciło wyjątku

---

## 📊 Struktura danych w Google Sheets

Każde zgłoszenie tworzy nowy wiersz z następującymi kolumnami:

| Kolumna | Opis | Przykład |
|---------|------|----------|
| Data zgłoszenia | Timestamp w formacie ISO | 2025-02-11T20:30:45.123Z |
| Typ eventu | Wybrany typ | konferencja |
| Data eventu | Planowana data | 15.06.2025 |
| Liczba uczestników | Zakres lub liczba | 50-100 osób |
| Lokalizacja | Wybrana opcja | prosze_o_propozycje |
| Szczegóły lokalizacji | Dodatkowe info | Warszawa centrum |
| Budżet | Podany budżet | 50 000 - 100 000 zł |
| Cel biznesowy | Wybrany cel | networking |
| Wymagania techniczne | Lista zaznaczonych | Nagłośnienie, Oświetlenie |
| Catering | Wybrany typ | lunch |
| Szczegóły cateringu | Dodatkowe info | dieta wegetariańska |
| Dodatkowe wymagania | Lista zaznaczonych | Transport, Branding |
| Dodatkowe uwagi | Tekst swobodny | Szczegółowy opis |
| Imię | Imię kontaktu | Jan |
| Nazwisko | Nazwisko kontaktu | Kowalski |
| Firma | Nazwa firmy | ACME Corp |
| Email | Adres email | jan@acme.pl |
| Telefon | Numer telefonu | +48 123 456 789 |
| Zgoda RODO | Status zgody | Tak |

---

## ❓ FAQ

### Czy system jest darmowy?

**Tak!** Wszystkie użyte technologie są bezpłatne:
- GitHub Pages - darmowy hosting
- Google Sheets - darmowa baza danych
- Google Apps Script - darmowy backend
- Brak limitów dla małych i średnich projektów

### Ile zgłoszeń może obsłużyć system?

- Google Sheets: do 10 milionów komórek (praktycznie bez limitu dla eventów)
- Google Apps Script: 20 000 wywołań dziennie (wystarczy na tysiące zgłoszeń)
- GitHub Pages: bez limitu odwiedzin (z rozsądnym użyciem)

### Czy dane są bezpieczne?

**Tak**, system stosuje najlepsze praktyki:
- Hashowanie haseł (SHA-256)
- Sesje z timeoutem
- Ochrona przed XSS
- HTTPS na GitHub Pages
- Zgodność z RODO

### Czy mogę dostosować formularz?

**Absolutnie!** Możesz:
- Dodać/usunąć pola
- Zmienić pytania
- Dostosować kolory i fonty
- Dodać nowe funkcje

### Co jeśli zapomniałem hasła administratora?

1. Wygeneruj nowy hash dla nowego hasła (patrz sekcja [Bezpieczeństwo](#bezpieczeństwo))
2. Zaktualizuj `js/auth.js`
3. Commit i push zmian

### Jak mogę przetestować formularz lokalnie?

```bash
# Użyj prostego serwera HTTP
python3 -m http.server 8000

# Lub jeśli masz Node.js
npx http-server
```

Następnie otwórz: `http://localhost:8000`

**UWAGA**: Integracja z Google Sheets może nie działać lokalnie przez CORS. Testuj na GitHub Pages.

### Czy mogę używać własnej domeny?

**Tak!** GitHub Pages wspiera własne domeny:
1. Przejdź do **Settings** → **Pages**
2. W sekcji **Custom domain** wpisz swoją domenę
3. Skonfiguruj rekord DNS u swojego providera:
   ```
   Type: CNAME
   Name: brief (lub subdomena)
   Value: twoje-konto.github.io
   ```

### Jak mogę eksportować dane z Google Sheets?

1. Otwórz arkusz Google Sheets
2. Kliknij **Plik** → **Pobierz**
3. Wybierz format:
   - Microsoft Excel (.xlsx)
   - PDF
   - CSV
   - Inne

---

## 🐛 Rozwiązywanie problemów

### Formularz nie wysyła danych

**Sprawdź:**
1. Czy URL Google Apps Script jest poprawnie skonfigurowany w `js/form.js`
2. Czy Google Apps Script został wdrożony jako Web App
3. Czy Web App ma dostęp: "Anyone"
4. Sprawdź konsolę przeglądarki (F12) czy są błędy

**Rozwiązanie:**
- Otwórz Google Apps Script → **Deploy** → **Manage deployments**
- Sprawdź czy URL się zgadza
- Sprawdź logi: **Executions** w Apps Script

### Nie mogę się zalogować do panelu administracyjnego

**Sprawdź:**
1. Czy używasz poprawnych danych: `todoevents` / `ToDoEvents2000#!`
2. Czy przeglądarka pozwala na localStorage
3. Czy masz włączone JavaScript

**Rozwiązanie:**
- Wyczyść localStorage: Konsola → `localStorage.clear()`
- Sprawdź czy cookies są włączone
- Spróbuj w trybie incognito

### Panel administracyjny nie pokazuje zgłoszeń

**Sprawdź:**
1. Czy URL Google Apps Script w `js/admin.js` jest identyczny jak w `js/form.js`
2. Czy są jakieś dane w Google Sheets
3. Sprawdź konsolę przeglądarki (F12) czy są błędy CORS

**Rozwiązanie:**
- Sprawdź **Executions** w Google Apps Script
- Upewnij się że funkcja `doGet` jest poprawnie skonfigurowana
- Sprawdź czy arkusz nazywa się "Zgłoszenia"

### Logo się nie wyświetla

**Sprawdź:**
1. Czy plik logo.png jest w folderze `/assets/`
2. Czy ścieżka w HTML jest poprawna
3. Czy plik jest obrazem (nie tekstem)

**Rozwiązanie:**
- Sprawdź ścieżkę: `assets/logo.png` (względna)
- Sprawdź nazwę pliku (wielkość liter ma znaczenie)
- Sprawdź format pliku (PNG, JPG, SVG)

---

## 📞 Wsparcie

Jeśli napotkasz problemy:

1. **Sprawdź FAQ** powyżej
2. **Sprawdź Issues** na GitHub
3. **Utwórz nowy Issue** z opisem problemu
4. **Skontaktuj się** z zespołem TODO

---

## 📄 Licencja

Ten projekt jest własnością TODO i przeznaczony do użytku wewnętrznego.

---

## 🙏 Podziękowania

Projekt wykorzystuje:
- [Google Fonts - Montserrat](https://fonts.google.com/specimen/Montserrat)
- [Google Apps Script](https://developers.google.com/apps-script)
- [GitHub Pages](https://pages.github.com/)

---

**Wersja**: 1.0.0  
**Ostatnia aktualizacja**: Luty 2025  
**Kontakt**: hello@todo.net.pl

---

## ✅ Checklist wdrożenia

Użyj tej listy aby upewnić się, że wszystko jest skonfigurowane:

- [ ] Skopiowano logo do `/assets/logo.png`
- [ ] Dodano politykę prywatności do `/assets/polityka_prywatnosci.pdf`
- [ ] Utworzono Google Sheets
- [ ] Dodano Google Apps Script
- [ ] Przetestowano funkcję `testSetup()` w Apps Script
- [ ] Wdrożono Apps Script jako Web App
- [ ] Skopiowano URL Web App
- [ ] Zaktualizowano `GOOGLE_SCRIPT_URL` w `js/form.js`
- [ ] Zaktualizowano `GOOGLE_SCRIPT_URL` w `js/admin.js`
- [ ] Dostosowano kolory (opcjonalnie)
- [ ] Zmieniono hasło administratora (opcjonalnie)
- [ ] Utworzono repozytorium GitHub
- [ ] Push kodu na GitHub
- [ ] Aktywowano GitHub Pages
- [ ] Przetestowano formularz klienta
- [ ] Przetestowano panel administracyjny
- [ ] Sprawdzono responsywność na telefonie
- [ ] Sprawdzono czy dane zapisują się w Google Sheets

**Gotowe! 🎉**
