@echo off
echo ========================================
echo   TERMINIA - Installazione Pagina Alerts
echo ========================================
echo.

echo [1/2] Creazione cartella alerts...
if not exist "app\dashboard\alerts" (
    mkdir "app\dashboard\alerts"
    echo OK - Cartella creata: app\dashboard\alerts
) else (
    echo OK - Cartella gia esistente
)

echo.
echo [2/2] Copia file page.tsx...
if exist "ALERTS_PAGE.tsx" (
    copy /Y "ALERTS_PAGE.tsx" "app\dashboard\alerts\page.tsx" >nul
    echo OK - File copiato: app\dashboard\alerts\page.tsx
    echo.
    echo ========================================
    echo   INSTALLAZIONE COMPLETATA!
    echo ========================================
    echo.
    echo La pagina alerts e ora disponibile su:
    echo   http://localhost:3000/dashboard/alerts
    echo.
    echo Per pulire i file temporanei, esegui:
    echo   del ALERTS_PAGE.tsx ALERTS_PAGE_SETUP.md install-alerts.js install-alerts.bat
    echo.
) else (
    echo ERRORE - File ALERTS_PAGE.tsx non trovato
    exit /b 1
)

pause
