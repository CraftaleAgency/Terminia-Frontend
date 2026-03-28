import Link from "next/link"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import {
  Server,
  Shield,
  Cpu,
  Network,
  Database,
  Globe,
  FileText,
  Zap,
  ArrowRight,
  Lock,
  Code,
  Layers,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function ArchitetturaPage() {
  return (
    <article className="max-w-none">
      {/* Hero section */}
      <ScrollReveal>
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card text-sm text-primary">
            <Layers className="size-4" />
            Architettura Agenti OpenClaw
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Architettura <span className="text-gradient">TerminIA</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            TerminIA-Nemoclaw implementa una piattaforma di agenti AI sandbox basata su NVIDIA NemoClaw e OpenShell,
            con 10 skill OpenClaw che operano in un ambiente isolato e sicuro.
          </p>
        </div>
      </ScrollReveal>

      {/* Overview */}
      <ScrollReveal delay={0.1}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Server className="size-6 text-primary" />
            Componenti Chiave
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
                <Shield className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">OpenClaw Sandbox</h3>
              <p className="text-sm text-muted-foreground">Ambiente di esecuzione isolato per gli agenti con policy network deny-by-default</p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
                <Network className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">OpenShell Gateway</h3>
              <p className="text-sm text-muted-foreground">Gateway che gestisce il lifecycle dei sandbox (porta 18789:30051)</p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
                <Code className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Skills OpenClaw</h3>
              <p className="text-sm text-muted-foreground">10 skill JavaScript per automazione business intelligence</p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
                <Cpu className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nebula Inference Stack</h3>
              <p className="text-sm text-muted-foreground">4 modelli llama.cpp dietro proxy LiteLLM</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* OpenShell Gateway */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Network className="size-6 text-primary" />
            OpenShell Gateway
          </h2>

          <div className="glass-card rounded-2xl p-8 border border-border/30">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Configurazione Container</h3>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">{`openshell-gateway:
  image: ghcr.io/nvidia/openshell/cluster:0.0.16
  privileged: true
  pid: host
  ports:
    - "18789:30051"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - nemoclaw-data:/root/.nemoclaw
    - openshell-data:/root/.openshell
    - sandbox-data:/sandbox`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">CLI NemoClaw</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { cmd: "nemoclaw terminia connect", desc: "Entra nella shell del sandbox" },
                  { cmd: "nemoclaw terminia status", desc: "Health + status inference" },
                  { cmd: "nemoclaw terminia logs --follow", desc: "Stream log sandbox" },
                  { cmd: "openshell term", desc: "TUI: monitora agenti, approva egress" },
                ].map((item) => (
                  <div key={item.cmd} className="bg-muted/30 rounded-lg p-3">
                    <code className="text-sm text-primary font-mono">{item.cmd}</code>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Sandbox Policy */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Lock className="size-6 text-primary" />
            Policy del Sandbox
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                Network (Deny-by-Default)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Solo gli endpoint nella whitelist sono raggiungibili. Richieste non approvate richiedono approvazione operator.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span className="text-muted-foreground">inference.local:443</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span className="text-muted-foreground">*.supabase.co:443</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span className="text-muted-foreground">ec.europa.eu:443 (VIES)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span className="text-muted-foreground">dati.anticorruzione.it:443</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span className="text-muted-foreground">ted.europa.eu:443</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Database className="size-5 text-primary" />
                Filesystem
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Accesso restricto alle directory per massima sicurezza.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-medium text-emerald-500">Read/Write:</span>
                  <span className="text-muted-foreground ml-2">/sandbox, /tmp, /dev/null</span>
                </div>
                <div>
                  <span className="font-medium text-amber-500">Read Only:</span>
                  <span className="text-muted-foreground ml-2">/usr, /lib, /proc, /app, /etc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Inference Stack */}
      <ScrollReveal delay={0.4}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Cpu className="size-6 text-primary" />
            Inference Stack
          </h2>

          <div className="glass-card rounded-2xl p-8 border border-border/30 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Flusso Richiesta</h3>
            <div className="bg-muted/50 rounded-lg p-6 font-mono text-sm">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="text-foreground">Agent Code (skill)</div>
                <div className="text-primary">↓ POST inference.local /v1/chat/completions</div>
                <div className="text-foreground">OpenShell Gateway (intercept)</div>
                <div className="text-primary">↓ POST litellm-proxy:4000 + injected api_key</div>
                <div className="text-foreground">LiteLLM Proxy (routing by model alias)</div>
                <div className="text-primary">↓ llama-server:8080</div>
                <div className="text-emerald-500 font-medium">Response</div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Modelli Disponibili</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-5 border border-border/30">
              <div className="text-sm font-medium text-primary mb-2">nemotron-orchestrator</div>
              <div className="text-xs text-muted-foreground mb-3">Nemotron-Orchestrator-8B</div>
              <div className="text-xs text-muted-foreground">Task planning, ragionamento complesso</div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-border/30">
              <div className="text-sm font-medium text-primary mb-2">nemotron-nano / fast</div>
              <div className="text-xs text-muted-foreground mb-3">NVIDIA-Nemotron3-Nano-4B</div>
              <div className="text-xs text-muted-foreground">Esecuzione veloce, simple tasks</div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-border/30">
              <div className="text-sm font-medium text-primary mb-2">numarkdown / ocr</div>
              <div className="text-xs text-muted-foreground mb-3">NuMarkdown-8B-Thinking</div>
              <div className="text-xs text-muted-foreground">OCR documenti, scanned PDF</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Skills */}
      <ScrollReveal delay={0.5}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Code className="size-6 text-primary" />
            OpenClaw Skills
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Contract Pipeline (4 skill)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "document-preprocessor", desc: "PDF/DOCX/Image → clean text (OCR se necessario)" },
                  { name: "contract-classify", desc: "Type, parties, language, confidence (13 tipi)" },
                  { name: "contract-extract", desc: "Dates, values, clauses, obligations, milestones" },
                  { name: "contract-risk-score", desc: "Risk score 0-100, alerts automatici" },
                ].map((skill) => (
                  <div key={skill.name} className="glass-card rounded-lg p-4 border border-border/30">
                    <div className="text-sm font-medium text-foreground mb-1">{skill.name}</div>
                    <div className="text-xs text-muted-foreground">{skill.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">OSINT (3 skill)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: "osint-cf", desc: "Validazione Codice Fiscale (algoritmo locale)", color: "cyan" },
                  { name: "osint-vat", desc: "Validazione P.IVA via VIES API (cache 30d)", color: "purple" },
                  { name: "osint-anac-casellario", desc: "Annotations ANAC (scraping, cache 7d)", color: "amber" },
                ].map((skill) => (
                  <div key={skill.name} className="glass-card rounded-lg p-4 border border-border/30">
                    <div className="text-sm font-medium text-foreground mb-1">{skill.name}</div>
                    <div className="text-xs text-muted-foreground">{skill.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">BandoRadar (3 skill)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: "bandi-sync-anac", desc: "Sync bandi ANAC (cron 06:00)" },
                  { name: "bandi-sync-ted", desc: "Sync TED Europa (cron 06:30)" },
                  { name: "bandi-match", desc: "Match scoring via inference (cron 07:00)" },
                ].map((skill) => (
                  <div key={skill.name} className="glass-card rounded-lg p-4 border border-border/30">
                    <div className="text-sm font-medium text-foreground mb-1">{skill.name}</div>
                    <div className="text-xs text-muted-foreground">{skill.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Link to Integrations */}
      <ScrollReveal delay={0.6}>
        <div className="mb-12 glass-card rounded-xl p-6 border border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="size-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Integrazioni Esterne</h3>
                <p className="text-sm text-muted-foreground">ANAC, TED Europa, VIES, ANAC Casellario, Verifica CF</p>
              </div>
            </div>
            <Link
              href="/docs/integrazioni"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Vedi dettaglio
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Security & GDPR */}
      <ScrollReveal delay={0.7}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Shield className="size-6 text-primary" />
            Security & GDPR Compliance
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4">Credential Isolation</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Inference API keys: mai visibili nel sandbox (inject da gateway)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Supabase service role: visibile (richiesto dalle skill)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>VIES API key: sandbox env var</span>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4">GDPR Compliance</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>osint-cf: pure local computation (no dati personali escono)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Dati dipendenti: tabelle dedicate con RLS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Cache TTL per refresh periodico dati stale</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={0.8}>
        <div className="glass-card rounded-2xl p-8 border border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
              <Zap className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">Documentazione Completa</h3>
              <p className="text-muted-foreground mb-4 max-w-2xl">
                Per maggiori dettagli tecnici sull'architettura degli agenti, consulta la documentazione completa
                che include configurazioni dettagliate, CLI commands, health checks e molto altro.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/docs/integrazioni"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Vedi Integrazioni
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors text-foreground font-medium"
                >
                  Torna alla Docs
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </article>
  )
}
