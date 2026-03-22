# Configurazione Supabase per Terminia

## 1. Creare un progetto Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Crea un nuovo progetto (chiamalo "Terminia" o simile)
3. Attendi che il progetto sia pronto

## 2. Ottenere le credenziali API

1. Nel dashboard Supabase, vai su **Settings** > **API**
2. Copia i seguenti valori:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: la chiave pubblica

## 3. Configurare le variabili d'ambiente

Apri il file `.env.local` nella root del progetto e inserisci i valori:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-chiave-anon
```

## 4. Configurare l'autenticazione in Supabase

1. Vai su **Authentication** > **Providers** nel dashboard Supabase
2. Abilita **Email** provider
3. (Opzionale) Configura le email di conferma

## 5. Creare un utente di test (opzionale)

Per testare velocemente senza ricevere email:

1. Vai su **Authentication** > **Users** nel dashboard
2. Clicca su **Add user** > **Create new user**
3. Inserisci email e password
4. L'utente sarà confermato automaticamente

Oppure usa la pagina di registrazione che crea utenti non confermati (per test).

## 6. Avviare il progetto

```bash
npm run dev
```

## Struttura dell'autenticazione

- **Client**: `lib/supabase/client.ts` - Per componenti client-side
- **Server**: `lib/supabase/server.ts` - Per server components e API routes
- **Actions**: `app/auth/actions.ts` - Server actions per login, signup, logout
- **Middleware**: `middleware.ts` - Protezione delle route

## Funzionalità implementate

✅ Registrazione con validazione (2 step)
✅ Login con email/password
✅ Logout
✅ Protezione automatica della dashboard
✅ Redirect automatici (login → dashboard se già loggato)
