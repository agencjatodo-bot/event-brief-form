# Quick Start Guide - Event Brief Form

## 🚀 Szybkie uruchomienie w 10 krokach

### 1️⃣ Przygotuj logo i politykę prywatności
- Logo: Zamień `assets/logo.png` na swoje logo (200x80px zalecane)
- Polityka: Dodaj `assets/polityka_prywatnosci.pdf` (szablon w `POLITYKA_PRYWATNOSCI_PRZYKLAD.txt`)

### 2️⃣ Utwórz Google Sheet
1. Otwórz [Google Sheets](https://sheets.google.com)
2. Kliknij **"+ Pusty"**
3. Nazwij: "Event Brief - Zgłoszenia"

### 3️⃣ Dodaj Google Apps Script
1. W Google Sheets: **Rozszerzenia** → **Apps Script**
2. Usuń domyślny kod
3. Wklej kod z pliku `google-apps-script.gs`
4. Zapisz (Ctrl+S)
5. Nazwij projekt: "Event Brief API"

### 4️⃣ Przetestuj skrypt (opcjonalnie)
1. Wybierz funkcję: `testSetup`
2. Kliknij **Uruchom** ▶️
3. Autoryzuj aplikację przy pierwszym uruchomieniu
4. Sprawdź logi: **Widok** → **Logi**

### 5️⃣ Wdróż jako Web App
1. Kliknij **Deploy** → **New deployment**
2. Wybierz typ: **Web app**
3. Ustaw:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Kliknij **Deploy**
5. **SKOPIUJ URL WEB APP** ✅

### 6️⃣ Zaktualizuj URL w JavaScript
Wklej skopiowany URL w dwóch miejscach:

**W pliku `js/form.js`:**
```javascript
const GOOGLE_SCRIPT_URL = 'WKLEJ_TUTAJ_URL';
```

**W pliku `js/admin.js`:**
```javascript
const GOOGLE_SCRIPT_URL = 'WKLEJ_TUTAJ_URL';
```

### 7️⃣ Utwórz repozytorium GitHub
1. Zaloguj się na [GitHub](https://github.com)
2. Kliknij **"+"** → **"New repository"**
3. Nazwa: `event-brief-form`
4. Public
5. Kliknij **"Create repository"**

### 8️⃣ Push kodu
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TWOJE-KONTO/event-brief-form.git
git branch -M main
git push -u origin main
```

### 9️⃣ Aktywuj GitHub Pages
1. W repo: **Settings** → **Pages**
2. Source: **main** branch, **/ (root)** folder
3. Kliknij **Save**
4. Poczekaj 1-2 minuty

### 🔟 Testuj!
1. Formularz: `https://TWOJE-KONTO.github.io/event-brief-form/`
2. Admin: `https://TWOJE-KONTO.github.io/event-brief-form/admin-login.html`
   - Login: `todoevents`
   - Hasło: `ToDoEvents2000#!`

---

## ✅ Checklist wdrożenia

```
[ ] Logo dodane do /assets/logo.png
[ ] Polityka prywatności w /assets/polityka_prywatnosci.pdf
[ ] Google Sheet utworzony
[ ] Google Apps Script dodany i przetestowany
[ ] Web App wdrożony
[ ] URL skopiowany
[ ] js/form.js zaktualizowany
[ ] js/admin.js zaktualizowany
[ ] Repozytorium GitHub utworzone
[ ] Kod push'nięty
[ ] GitHub Pages aktywowane
[ ] Formularz przetestowany
[ ] Panel admin przetestowany
```

---

## 🆘 Szybka pomoc

**Formularz nie wysyła danych?**
- Sprawdź URL w `js/form.js`
- Sprawdź czy Web App ma dostęp "Anyone"
- Sprawdź konsolę (F12) czy są błędy

**Nie mogę się zalogować?**
- Login: `todoevents` (małe litery)
- Hasło: `ToDoEvents2000#!` (dokładnie tak)
- Wyczyść localStorage: Konsola → `localStorage.clear()`

**Panel nie pokazuje danych?**
- Sprawdź URL w `js/admin.js`
- Sprawdź czy są dane w Google Sheets
- Sprawdź czy nazwa arkusza to "Zgłoszenia"

**Logo się nie wyświetla?**
- Sprawdź czy plik jest w `/assets/logo.png`
- Sprawdź czy to obraz (nie SVG text)
- Odśwież stronę (Ctrl+F5)

---

## 📚 Więcej informacji

- Pełna instrukcja: `README.md`
- Rozszerzanie funkcji: `DEVELOPER_GUIDE.md`
- Zmiana hasła: `password-hash-generator.js`

---

**Potrzebujesz pomocy?** Zobacz FAQ w README.md lub utwórz Issue na GitHub.

Powodzenia! 🎉
