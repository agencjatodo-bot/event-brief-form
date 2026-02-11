/**
 * Password Hash Generator
 * 
 * INSTRUKCJE UŻYCIA:
 * 
 * Metoda 1 - Konsola przeglądarki:
 * 1. Otwórz dowolną stronę w przeglądarce
 * 2. Naciśnij F12 aby otworzyć DevTools
 * 3. Przejdź do zakładki "Console"
 * 4. Wklej poniższy kod i naciśnij Enter
 * 5. Wywołaj funkcję: hashPassword('TwojeNoweHaslo')
 * 6. Skopiuj wynik i wklej do js/auth.js jako PASSWORD_HASH
 * 
 * Metoda 2 - Node.js:
 * 1. Zapisz ten plik jako password-hash.js
 * 2. Uruchom: node password-hash.js
 * 3. Wprowadź hasło gdy zostaniesz poproszony
 * 4. Skopiuj hash do js/auth.js
 */

// ============================================
// DLA PRZEGLĄDARKI (DevTools Console)
// ============================================

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log('=====================================');
    console.log('Hasło:', password);
    console.log('SHA-256 Hash:', hashHex);
    console.log('=====================================');
    console.log('Skopiuj powyższy hash do js/auth.js:');
    console.log('const PASSWORD_HASH = \'' + hashHex + '\';');
    console.log('=====================================');
    
    return hashHex;
}

// Przykładowe użycie:
// hashPassword('ToDoEvents2000#!')

// ============================================
// DLA NODE.JS
// ============================================

// Odkomentuj poniższy kod jeśli używasz Node.js

/*
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Wprowadź nowe hasło: ', (password) => {
    const hash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');
    
    console.log('\n=====================================');
    console.log('Hasło:', password);
    console.log('SHA-256 Hash:', hash);
    console.log('=====================================');
    console.log('Skopiuj powyższy hash do js/auth.js:');
    console.log('const PASSWORD_HASH = \'' + hash + '\';');
    console.log('=====================================\n');
    
    rl.close();
});
*/

// ============================================
// AKTUALNE DANE LOGOWANIA
// ============================================

/*
 * DOMYŚLNE DANE LOGOWANIA:
 * Login: todoevents
 * Hasło: ToDoEvents2000#!
 * Hash: 66417eb700a30dc7d88b10f235b38105dd18f82e2041e372a748ce45311cf8e3
 * 
 * WAŻNE: Zmień te dane po wdrożeniu!
 */
