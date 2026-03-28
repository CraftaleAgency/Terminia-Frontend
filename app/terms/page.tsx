'use client'

import { FileText, Shield, AlertTriangle, UserCheck, XCircle, Scale } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-20 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card text-sm text-primary">
              <FileText className="size-4" />
              Termini di Servizio
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Termini di <span className="text-gradient">Servizio</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ultimo aggiornamento: Marzo 2026
            </p>
          </div>

          {/* Intro */}
          <div className="glass-card rounded-2xl p-8 border border-border/20 mb-8">
            <p className="text-muted-foreground leading-relaxed">
              Benvenuto in Terminia. Questi Termini di Servizio (&quot;Termini&quot;) regolano l&apos;utilizzo della piattaforma
              Terminia (&quot;Servizio&quot;) fornita da Terminia S.r.l. (&quot;Terminia&quot;, &quot;noi&quot;, &quot;ci&quot;).
              Accedendo o utilizzando il Servizio, accetti questi Termini.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Se non accetti questi Termini, non utilizzare il Servizio. Terminia si riserva il diritto di modificare
              questi Termini in qualsiasi momento, notificando gli utenti registrati via email.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* 1. Accettazione */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <UserCheck className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">1. Accettazione dei Termini</h2>
                  <p className="text-muted-foreground">
                    Creando un account o utilizzando Terminia, dichiari di:
                  </p>
                </div>
              </div>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-16">
                <li>Avere almeno 18 anni o l&apos;età legale per contrarre nella tua giurisdizione</li>
                <li>Avere la capacità legale di accettare questi Termini</li>
                <li>Essere autorizzato a rappresentare un&apos;azienda o entità (per gli utenti business)</li>
                <li>Accettare di essere vincolato da questi Termini e dalla{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </li>
              </ul>
            </section>

            {/* 2. Descrizione del Servizio */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <FileText className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">2. Descrizione del Servizio</h2>
                  <p className="text-muted-foreground">
                    Terminia è una piattaforma SaaS B2B che fornisce:
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 ml-16">
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-2">Gestione Contrattuale</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Analisi AI di contratti (PDF, DOCX)</li>
                    <li>• Estrazione automatica di clausole e scadenze</li>
                    <li>• Alert preventivi su rinnovi e scadenze</li>
                    <li>• Risk scoring di contratti e controparti</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-2">BandoRadar</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ricerca automatica bandi pubblici</li>
                    <li>• Matching AI con profilo aziendale</li>
                    <li>• Gap analysis e checklist documenti</li>
                    <li>• Alert su opportunità compatibili</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl ml-16">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <strong className="font-semibold">Importante:</strong> Terminia fornisce strumenti di supporto decisionale
                  e NON costituisce consulenza legale professionale. Per questioni legali complesse, consulta un avvocato.
                </p>
              </div>
            </section>

            {/* 3. Obblighi dell'Utente */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Obblighi e Responsabilità dell&apos;Utente</h2>
              <p className="text-muted-foreground mb-4">Utilizzando Terminia, ti impegni a:</p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Fornire informazioni accurate:</strong> mantenere i dati del profilo e
                    dell&apos;azienda aggiornati e veritieri
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Proteggere le credenziali:</strong> non condividere mai la password e
                    notificarci immediatamente di accessi non autorizzati
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Utilizzare il servizio correttamente:</strong> non caricare documenti
                    illegali, dannosi o che violino diritti altrui
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Rispettare la proprietà intellettuale:</strong> non copiare, modificare
                    o distribuire il codice o il design di Terminia
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Non abusare del servizio:</strong> non utilizzare bot, scraper o
                    automatizzazioni non autorizzate
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Divieti */}
            <section className="glass-card rounded-2xl p-8 border border-red-500/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                  <XCircle className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">4. Divieti Espliciti</h2>
                  <p className="text-muted-foreground">È severamente vietato:</p>
                </div>
              </div>

              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-16">
                <li>Utilizzare Terminia per attività illegali o fraudolente</li>
                <li>Caricare malware, virus o codice dannoso</li>
                <li>Tentare di accedere ad account altrui o violare misure di sicurezza</li>
                <li>Interrompere o danneggiare i server o la rete connessa al Servizio</li>
                <li>Decompilare, reverse engineer o tentare di estrarre il codice sorgente</li>
                <li>Utilizzare il Servizio per violare sanzioni, embarghi o leggi internazionali</li>
                <li>Rimuovere o alterare avvisi di proprietà intellettuale o marchi</li>
              </ul>
            </section>

            {/* 5. Proprietà Intellettuale */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Shield className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">5. Proprietà Intellettuale</h2>
                  <p className="text-muted-foreground">Diritti sui contenuti e tecnologia:</p>
                </div>
              </div>

              <div className="space-y-4 ml-16">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Diritti di Terminia</h3>
                  <p className="text-sm text-muted-foreground">
                    Terminia e il design, il codice, la tecnologia, i marchi e il materiale visivo sono di proprietà esclusiva
                    di Terminia S.r.l. e sono protetti da leggi sulla proprietà intellettuale italiane e internazionali.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Diritti dell&apos;Utente sui Documenti</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu mantieni la piena proprietà di tutti i documenti e dati che carichi su Terminia. Terminia non acquisisce
                    alcun diritto sui tuoi contenuti, salvo la licenza limitata di elaborarli per erogare il Servizio.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Licenza d&apos;Uso</h3>
                  <p className="text-sm text-muted-foreground">
                    Terminia concede una licenza non esclusiva, non trasferibile e limitata di utilizzare il Servizio
                    secondo questi Termini. Non viene concessa alcuna licenza sul codice sorgente o sulla tecnologia sottostante.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Limitazione di Responsabilità */}
            <section className="glass-card rounded-2xl p-8 border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-500 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">6. Limitazione di Responsabilità</h2>
                  <p className="text-muted-foreground">Nella misura massima consentita dalla legge:</p>
                </div>
              </div>

              <div className="space-y-4 ml-16">
                <div className="p-4 bg-background rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Servizio &quot;Così Com&apos;è&quot;</h3>
                  <p className="text-sm text-muted-foreground">
                    Il Servizio è fornito &quot;così com&apos;è&quot; e &quot;come disponibile&quot;, senza garanzie di alcun tipo,
                    esplicite o implicite. Non garantiamo che il Servizio sarà ininterrotto, sicuro o privo di errori.
                  </p>
                </div>

                <div className="p-4 bg-background rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Nessuna Consulenza Legale</h3>
                  <p className="text-sm text-muted-foreground">
                    Terminia NON fornisce consulenza legale. Le analisi AI, gli alert e le informazioni fornite sono solo a
                    titolo informativo e di supporto decisionale. Non dovresti basarti esclusivamente su Terminia per decisioni
                    legali o aziendali critiche.
                  </p>
                </div>

                <div className="p-4 bg-background rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Limitazione dei Danni</h3>
                  <p className="text-sm text-muted-foreground">
                    Terminia non è responsabile per danni indiretti, incidentali, consequenziali o punitivi, inclusi ma non
                    limitati a perdita di profitti, dati, opportunità commerciali o reputazione. La responsabilità totale è
                    limitata all&apos;importo pagato negli ultimi 12 mesi.
                  </p>
                </div>

                <div className="p-4 bg-background rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Errori AI</h3>
                  <p className="text-sm text-muted-foreground">
                    L&apos;AI può commettere errori nell&apos;analisi dei documenti. È responsabilità dell&apos;utente verificare le
                    informazioni critiche. Terminia non è responsabile per decisioni prese basate su analisi inaccurate.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Sospensione e Risoluzione */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Sospensione e Risoluzione</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Sospensione da Parte di Terminia</h3>
                  <p className="text-sm text-muted-foreground">
                    Ci riserviamo il diritto di sospendere o terminare immediatamente il tuo accesso se:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Violi questi Termini</li>
                    <li>Utilizzi il Servizio per attività illegali</li>
                    <li>Compri atti fraudolenti o di abuso</li>
                    <li>Non paghi le fees applicabili</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Risoluzione da Parte dell&apos;Utente</h3>
                  <p className="text-sm text-muted-foreground">
                    Puoi chiudere il tuo account in qualsiasi momento contattando il supporto o cancellando il tuo account
                    dalle impostazioni. Non avrai diritto a rimborso per periodi già pagati.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Effetti della Risoluzione</h3>
                  <p className="text-sm text-muted-foreground">
                    Alla risoluzione: (a) il diritto di utilizzare il Servizio cesserà immediatamente, (b) cancelleremo
                    o renderemo anonimi i tuoi dati entro 30 giorni salvo obblighi di legge, (c) rimarrai responsabile
                    per tutte le attività svolte durante l&apos;utilizzo del Servizio.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Privacy e Dati */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Privacy e Protezione Dati</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                L&apos;utilizzo del Servizio è regolato anche dalla nostra{" "}
                <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>, che spiega
                come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.
              </p>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Punti chiave:</strong> I tuoi documenti sono ospitati in Italia, non vengono
                  condivisi con terze parti per l&apos;AI, e non vengono utilizzati per allenare modelli. Consulta la Privacy
                  Policy per dettagli completi.
                </p>
              </div>
            </section>

            {/* 9. Pagamenti e Rimborsi */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Pagamenti e Rimborsi</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Abbonamenti a Pagamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Per i piani a pagamento, addebitiamo la carta di credito all&apos;inizio di ogni ciclo di fatturazione
                    (mensile o annuale). I prezzi sono in Euro e IVA inclusa dove applicabile.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Periodo di Prova</h3>
                  <p className="text-sm text-muted-foreground">
                    I periodi di prova gratuita (es. 14 giorni) non richiedono carta di credito e si convertono automaticamente
                    in abbonamento a pagamento se non cancellati prima della scadenza.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Rimborsi</h3>
                  <p className="text-sm text-muted-foreground">
                    Non offriamo rimborsi per periodi già fatturati. Puoi cancellare in qualsiasi momento e il servizio
                    rimarrà attivo fino alla fine del periodo corrente. Per problemi tecnici significativi, contatta il
                    supporto per valutare un rimborso parziale.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Modifica Prezzi</h3>
                  <p className="text-sm text-muted-foreground">
                    Ci riserviamo il diritto di modificare i prezzi in qualsiasi momento con 30 giorni di preavviso per gli
                    utenti esistenti. Il prezzo modificato si applicherà al prossimo ciclo di fatturazione.
                  </p>
                </div>
              </div>
            </section>

            {/* 10. Legge Applicabile e Foro Competente */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Scale className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">10. Legge Applicabile e Foro Competente</h2>
                  <p className="text-muted-foreground">
                    Questi Termini sono regolati dalla legge italiana. Qualsiasi controversia sarà sottoposta alla giurisdizione
                    esclusiva dei tribunali italiani.
                  </p>
                </div>
              </div>
            </section>

            {/* 11. Disposizioni Generali */}
            <section className="glass-card rounded-2xl p-8 border border-border/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Disposizioni Generali</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Interezza dell&apos;Accordo:</strong> Questi Termini costituiscono l&apos;intero accordo
                tra te e Terminia, sostituendo tutte le precedenti comunicazioni</li>
                <li><strong className="text-foreground">Rinuncia:</strong> La mancata applicazione da parte nostra di qualsiasi
                disposizione non costituisce rinuncia al diritto di applicarla in futuro</li>
                <li><strong className="text-foreground">Separabilità:</strong> Se una disposizione è ritenuta inapplicabile,
                le rimanenti rimangono in pieno vigore</li>
                <li><strong className="text-foreground">Cessione:</strong> Non puoi cedere questi Termini senza il nostro
                consenso scritto; Terminia può cederli liberamente</li>
                <li><strong className="text-foreground">Modifiche:</strong> Le modifiche saranno effettive 30 giorni dopo
                la notifica email o la pubblicazione sul sito</li>
              </ul>
            </section>

            {/* 12. Contatti */}
            <section className="glass-card rounded-2xl p-8 border border-primary/20 bg-primary/5">
              <div className="text-center">
                <FileText className="size-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">Domande sui Termini?</h2>
                <p className="text-muted-foreground mb-6">
                  Per chiarimenti o controversi, contatta il nostro team legale.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="mailto:legal@terminia.it"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    legal@terminia.it
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    Torna alla Home
                  </Link>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground py-8 space-y-2">
              <p>
                Questi Termini di Servizio costituiscono un contratto legalmente vincolante tra l&apos;utente e Terminia S.r.l.
              </p>
              <p>
                Terminia S.r.l. — Via/Esempio, 00100 Roma (RM) — Italia
                <br />
                Partita IVA: ITXXXXXXXXXXX — REA: XX-XXXXXX — <Link href="mailto:legal@terminia.it" className="text-primary hover:underline">legal@terminia.it</Link>
              </p>
              <p className="text-xs mt-4">
                <strong>DISCLAIMER:</strong> Questa pagina è un esempio di Termini di Servizio per un SaaS B2B.
                Non costituisce consulenza legale. Per la redazione definitiva, consultare un avvocato specializzato
                in diritto tecnologico e digitale.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
