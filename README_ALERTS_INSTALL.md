# ⚠️ AZIONE RICHIESTA - Installazione Pagina Alerts

La pagina alerts è pronta ma richiede 1 semplice comando per essere installata.

## 🎯 Installazione Rapida (scegli un metodo)

### OPZIONE 1: Doppio click
Fai doppio click su: **`install-alerts.bat`**

### OPZIONE 2: Da terminale CMD
```cmd
install-alerts.bat
```

### OPZIONE 3: Con Node.js
```cmd
node install-alerts.js
```

### OPZIONE 4: Manualmente
```cmd
mkdir app\dashboard\alerts
copy ALERTS_PAGE.tsx app\dashboard\alerts\page.tsx
```

---

## ✅ Dopo l'installazione

La pagina sarà disponibile su:
**http://localhost:3000/dashboard/alerts**

Puoi eliminare questi file temporanei:
```cmd
del ALERTS_PAGE.tsx ALERTS_PAGE_SETUP.md install-alerts.js install-alerts.bat README_ALERTS_INSTALL.md
```
