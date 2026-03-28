'use client'

import { Shield, Eye, Cookie, Mail, User } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-20 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card text-sm text-primary">
              <Shield className="size-4" />
              Privacy Policy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Informativa sulla <span className="text-gradient">Privacy</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ultimo aggiornamento: Marzo 2026
            </p>
          </div>

          {/* Intro */}
          <div className="glass-card rounded-2xl p-8 border border-border/20 mb-8">
            <p className="text-muted-foreground leading-relaxed">
              Terminia S.r.l. (&quot;Terminia&quot;, &quot;noi&quot;, &quot;nostro&quot;) si impegna a proteggere la privacy
              e la sicurezza dei dati personali degli utenti. Questa Informativa sulla Privacy spiega come raccogliamo,
              utilizziamo e proteggiamo i tuoi dati quando utilizzi la nostra piattaforma.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong className="text-foreground">Titolare del Trattamento:</strong> Terminia S.r.l., con sede in Italia.
              Per qualsiasi domanda relativa alla privacy, contattaci a{" "}
              <Link href="mailto:privacy@terminia.it" className="text-primary hover:underline">
                privacy@terminia.it
              </Link>.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* 1. Dati raccolti */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Eye className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">1. Dati Personali Raccolti</h2>
                  <p className="text-muted-foreground">Raccogliamo i seguenti tipi di dati personali:</p>
                </div>
              </div>

              <div className="space-y-4 ml-16">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Dati Account</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Nome, cognome e indirizzo email</li>
                    <li>Informazioni aziendali (ragione sociale, Partita IVA)</li>
                    <li>Credenziali di accesso (hashate e cifrate)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Dati dei Contratti</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Documenti caricati (PDF, DOCX) e relativi metadati</li>
                    <li>Contenuto estratto dai contratti tramite AI</li>
                    <li>Informazioni su controparti, scadenze, clausole</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Dati di Utilizzo</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Log di accesso e attività sulla piattaforma</li>
                    <li>Preferenze di notifica (email, Telegram)</li>
                    <li>Interazioni con le funzionalità del servizio</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. Finalità del trattamento */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <User className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">2. Finalità del Trattamento</h2>
                  <p className="text-muted-foreground">Utilizziamo i tuoi dati per le seguenti finalità:</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 ml-16">
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-2">Erogazione del Servizio</h3>
                  <p className="text-sm text-muted-foreground">
                    Analizzare i contratti, estrarre clausole, generare alert, fornire funzionalità BandoRadar.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-2">Miglioramento della Piattaforma</h3>
                  <p className="text-sm text-muted-foreground">
                    Analizzare le tendenze di utilizzo per migliorare le funzionalità e l&apos;esperienza utente.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-2">Comunicazioni Operative</h3>
                  <p className="text-sm text-muted-foreground">
                    Inviare notifiche su scadenze, alert e aggiornamenti importanti via email e Telegram.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-2">Compliance Legale</h3>
                  <p className="text-sm text-muted-foreground">
                    Adempire agli obblighi di legge, mantenere registri per contabilità e fiscalità.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Base giuridica */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Base Giuridica del Trattamento</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Il trattamento dei tuoi dati si basa sulle seguenti basi giuridiche ai sensi dell&apos;art. 6 del GDPR:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Esecuzione del contratto:</strong> fornitura dei servizi richiesti dall&apos;utente</li>
                <li><strong className="text-foreground">Consenso:</strong> per trattamenti specifici come cookie e marketing</li>
                <li><strong className="text-foreground">Interesse legittimo:</strong> miglioramento del servizio e prevenzione frodi</li>
                <li><strong className="text-foreground">Obbligo legale:</strong> adempimento di normative fiscali e contabili</li>
              </ul>
            </section>

            {/* 4. AI Proprietaria e Privacy */}
            <section className="glass-card rounded-2xl p-8 border border-primary/30 bg-primary/5">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  <Shield className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    4. AI Proprietaria e Protezione Dati
                  </h2>
                  <p className="text-muted-foreground">Il nostro approccio alla privacy:</p>
                </div>
              </div>

              <div className="space-y-4 ml-16">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Hosting in Italia</h3>
                    <p className="text-sm text-muted-foreground">
                      Tutti i dati sono ospitati su server situati nell&apos;Unione Europea e non vengono mai trasferiti fuori dall&apos;UE.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">AI Proprietaria</h3>
                    <p className="text-sm text-muted-foreground">
                      Utilizziamo un modello AI proprietario con hosting interno. I tuoi documenti NON vengono mai condivisi
                      con servizi di terze parti come OpenAI, Google o altri.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Nessun Training su Dati Clienti</h3>
                    <p className="text-sm text-muted-foreground">
                      I tuoi documenti non vengono utilizzati per allenare i modelli AI. Ogni cliente ha un&apos;istanza isolata
                      dei propri dati.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Crittografia e Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Tutti i dati sono cifrati in transito (TLS 1.3) e a riposo (AES-256). Implementiamo autenticazione a
                      più fattori e controlli di accesso granulari.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Condivisione dati */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Condivisione dei Dati</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Non vendiamo i tuoi dati a terze parti.</strong> Condividiamo i dati solo
                nei seguenti casi limitati:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Fornitori di servizi:</strong> hosting, infrastruttura cloud, email (solo per erogare il servizio)</li>
                <li><strong className="text-foreground">Partner per integrazioni:</strong> VIESAC, ANAC, TED Europa per verifiche e dati pubblici</li>
                <li><strong className="text-foreground">Ordini giudiziari:</strong> per adempiere a obblighi di legge</li>
              </ul>
            </section>

            {/* 6. Cookie */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Cookie className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">6. Cookie e Tracking</h2>
                  <p className="text-muted-foreground">Utilizziamo i seguenti tipi di cookie:</p>
                </div>
              </div>

              <div className="space-y-3 ml-16">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Tecnici</span>
                  <p className="text-sm text-muted-foreground">Essenziali per il funzionamento della piattaforma (autenticazione, preferenze)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Analytics</span>
                  <p className="text-sm text-muted-foreground">Per analizzare l&apos;utilizzo del servizio e migliorare le prestazioni</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Preferenze</span>
                  <p className="text-sm text-muted-foreground">Per salvare le tue scelte (tema, lingua, notifiche)</p>
                </div>
              </div>
            </section>

            {/* 7. Diritti utente */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. I Tuoi Diritti (GDPR)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Hai il diritto di esercitare in qualsiasi momento i seguenti diritti ai sensi del GDPR:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">Diritto di Accesso</h3>
                  <p className="text-sm text-muted-foreground">Richiedere una copia dei tuoi dati personali</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">Diritto di Rettifica</h3>
                  <p className="text-sm text-muted-foreground">Correggere dati inesatti o incompleti</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">Diritto alla Cancellazione</h3>
                  <p className="text-sm text-muted-foreground">Richiedere la cancellazione dei tuoi dati (&quot;diritto all&apos;oblio&quot;)</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">Diritto di Portabilità</h3>
                  <p className="text-sm text-muted-foreground">Ricevere i dati in formato strutturato</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">Diritto di Opposizione</h3>
                  <p className="text-sm text-muted-foreground">Opporsi al trattamento per motivi legittimi</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-1">Diritto di Reclamo</h3>
                  <p className="text-sm text-muted-foreground">Proporre reclamo al Garante Privacy</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Per esercitare questi diritti, scrivi a{" "}
                <Link href="mailto:privacy@terminia.it" className="text-primary hover:underline">
                  privacy@terminia.it
                </Link>.
              </p>
            </section>

            {/* 8. Retention */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Conservazione dei Dati</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I tuoi dati vengono conservati per il tempo strettamente necessario per:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Durata del rapporto contrattuale</strong> + 10 anni (obblighi fiscali)</li>
                <li><strong className="text-foreground">Documenti contrattuali:</strong> conservati secondo i termini di legge</li>
                <li><strong className="text-foreground">Dati account:</strong> cancellati su richiesta entro 30 giorni</li>
              </ul>
            </section>

            {/* 9. Minori */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Protezione dei Minori</h2>
              <p className="text-muted-foreground leading-relaxed">
                Terminia è riservato a professionisti e aziende. Non raccogliamo consapevolmente dati di minori di 18 anni.
                Se veniamo a conoscenza che sono stati raccolti dati di un minore, provvederemo a eliminarli immediatamente.
              </p>
            </section>

            {/* 10. Modifiche */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Modifiche alla Informativa</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ci riserviamo il diritto di modificare questa Informativa sulla Privacy in qualsiasi momento. Le modifiche
                saranno pubblicate su questa pagina con la data di aggiornamento. Per cambiamenti sostanziali, invieremo una
                notifica email agli utenti registrati.
              </p>
            </section>

            {/* Contact CTA */}
            <section className="glass-card rounded-2xl p-8 border border-primary/20 bg-primary/5">
              <div className="text-center">
                <Mail className="size-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">Domande sulla Privacy?</h2>
                <p className="text-muted-foreground mb-6">
                  Il nostro team è a disposizione per qualsiasi chiarimento.
                </p>
                <Link
                  href="mailto:privacy@terminia.it"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Contattaci
                  <Mail className="size-4" />
                </Link>
              </div>
            </section>

            {/* Disclaimer */}
            <div className="text-center text-sm text-muted-foreground py-8">
              <p>
                Questa pagina è stata redatta ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003.
                <br />
                Terminia S.r.l. — Partita IVA: ITXXXXXXXXXXX — REA: XX-XXXXXX
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
