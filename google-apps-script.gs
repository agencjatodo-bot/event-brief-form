/**
 * Google Apps Script dla Event Brief Form
 * 
 * INSTRUKCJE INSTALACJI:
 * 1. Utwórz nowy Google Sheet
 * 2. Rozszerzenia > Apps Script
 * 3. Wklej ten kod
 * 4. Kliknij "Deploy" > "New deployment"
 * 5. Wybierz typ: "Web app"
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Skopiuj URL Web App i wklej go w pliku js/form.js i js/admin.js
 */

// ============================================
// KONFIGURACJA
// ============================================

// Nazwa arkusza, w którym będą zapisywane dane
const SHEET_NAME = 'Zgłoszenia';

// Nagłówki kolumn
const HEADERS = [
  'Data zgłoszenia',
  'Typ eventu',
  'Data eventu',
  'Liczba uczestników',
  'Lokalizacja',
  'Szczegóły lokalizacji',
  'Budżet',
  'Cel biznesowy',
  'Wymagania techniczne',
  'Catering',
  'Szczegóły cateringu',
  'Dodatkowe wymagania',
  'Dodatkowe uwagi',
  'Imię',
  'Nazwisko',
  'Firma',
  'Email',
  'Telefon',
  'Zgoda RODO'
];

// ============================================
// GŁÓWNE FUNKCJE
// ============================================

/**
 * Obsługa żądań POST (dodawanie nowego zgłoszenia)
 */
function doPost(e) {
  try {
    // Parse JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Pobranie lub utworzenie arkusza
    const sheet = getOrCreateSheet();
    
    // Dodanie nagłówków jeśli arkusz jest pusty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      formatHeaders(sheet);
    }
    
    // Przygotowanie danych do zapisania
    const rowData = [
      data.timestamp,
      data.eventType,
      data.eventDate,
      data.participants,
      data.location,
      data.locationDetails,
      data.budget,
      data.businessGoal,
      data.technicalRequirements,
      data.catering,
      data.cateringDetails,
      data.extraRequirements,
      data.additionalComments,
      data.firstName,
      data.lastName,
      data.company,
      data.email,
      data.phone,
      data.gdprConsent
    ];
    
    // Dodanie nowego wiersza
    sheet.appendRow(rowData);
    
    // Formatowanie nowego wiersza
    const lastRow = sheet.getLastRow();
    formatDataRow(sheet, lastRow);
    
    // Logowanie sukcesu
    Logger.log('Dodano nowe zgłoszenie od: ' + data.company);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Błąd w doPost: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: 'error', 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Obsługa żądań GET (pobieranie zgłoszeń)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'read') {
      const sheet = getOrCreateSheet();
      
      // Sprawdzenie czy arkusz ma dane
      if (sheet.getLastRow() <= 1) {
        return ContentService
          .createTextOutput(JSON.stringify({ 
            result: 'success', 
            data: [] 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Pobranie wszystkich danych (bez nagłówków)
      const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length);
      const values = dataRange.getValues();
      
      // Konwersja do formatu JSON
      const submissions = values.map(row => ({
        timestamp: row[0],
        eventType: row[1],
        eventDate: row[2],
        participants: row[3],
        location: row[4],
        locationDetails: row[5],
        budget: row[6],
        businessGoal: row[7],
        technicalRequirements: row[8],
        catering: row[9],
        cateringDetails: row[10],
        extraRequirements: row[11],
        additionalComments: row[12],
        firstName: row[13],
        lastName: row[14],
        company: row[15],
        email: row[16],
        phone: row[17],
        gdprConsent: row[18]
      }));
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          result: 'success', 
          data: submissions 
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else {
      throw new Error('Nieznana akcja: ' + action);
    }
    
  } catch (error) {
    Logger.log('Błąd w doGet: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: 'error', 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// FUNKCJE POMOCNICZE
// ============================================

/**
 * Pobiera lub tworzy arkusz
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  return sheet;
}

/**
 * Formatowanie nagłówków
 */
function formatHeaders(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  
  headerRange
    .setBackground('#E31E24')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  
  // Zamrożenie pierwszego wiersza
  sheet.setFrozenRows(1);
  
  // Automatyczne dopasowanie szerokości kolumn
  for (let i = 1; i <= HEADERS.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Formatowanie wiersza z danymi
 */
function formatDataRow(sheet, rowNumber) {
  const rowRange = sheet.getRange(rowNumber, 1, 1, HEADERS.length);
  
  // Naprzemienne kolory wierszy
  if (rowNumber % 2 === 0) {
    rowRange.setBackground('#F5F5F5');
  }
  
  // Wyrównanie
  rowRange.setVerticalAlignment('top');
}

/**
 * Funkcja testowa (opcjonalna)
 * Uruchom ją raz aby sprawdzić czy wszystko działa
 */
function testSetup() {
  const sheet = getOrCreateSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    formatHeaders(sheet);
  }
  
  Logger.log('Setup zakończony pomyślnie!');
  Logger.log('Arkusz: ' + SHEET_NAME);
  Logger.log('Liczba kolumn: ' + HEADERS.length);
}
