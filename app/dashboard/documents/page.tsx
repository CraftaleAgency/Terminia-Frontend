"use client"

import { useState, useCallback } from "react"
import { Files, FileText, PenLine, CircleHelp, Loader2, Copy, Check, X, Download, Bot, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { sendChatMessageAction } from "@/lib/actions/chat"

// Mock contracts to select from (replace with real data when available)
const mockContracts = [
  { id: "c1", title: "Manutenzione impianti elettrici", counterpart: "Facility Service Srl", expiresAt: "2025-09-30" },
  { id: "c2", title: "Fornitura licenze software", counterpart: "TechVendor SpA", expiresAt: "2025-12-15" },
  { id: "c3", title: "Servizio pulizia uffici", counterpart: "CleanPro Italia", expiresAt: "2025-06-30" },
  { id: "c4", title: "Consulenza fiscale annuale", counterpart: "Studio Rossi & Associati", expiresAt: "2026-01-31" },
]

type DocumentType = "disdetta" | "riepilogo" | null

const documentActions = [
  {
    key: "disdetta" as const,
    title: "Lettera di disdetta",
    description: "Genera una bozza pronta da inviare per evitare rinnovi automatici.",
    icon: PenLine,
  },
  {
    key: null as DocumentType,
    title: "Richiesta chiarimenti",
    description: "Prepara una richiesta formale su clausole poco chiare o sfavorevoli.",
    icon: CircleHelp,
  },
  {
    key: "riepilogo" as const,
    title: "Riepilogo contratto",
    description: "Documento sintetico con scadenze, obblighi e azioni consigliate.",
    icon: FileText,
  },
]

export default function DocumentsPage() {
  const [selectingFor, setSelectingFor] = useState<DocumentType>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [generatedTitle, setGeneratedTitle] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleActionClick = (docType: DocumentType) => {
    if (!docType) return // "Richiesta chiarimenti" not yet wired
    setSelectingFor(docType)
    setError(null)
  }

  const handleContractSelect = async (contract: typeof mockContracts[0]) => {
    setSelectingFor(null)
    setGenerating(true)
    setError(null)
    setGeneratedContent(null)

    const docType = selectingFor
    let prompt: string
    let title: string

    if (docType === "disdetta") {
      title = `Lettera di disdetta — ${contract.title}`
      prompt = `Genera una lettera formale di disdetta per il contratto "${contract.title}" con ${contract.counterpart}. La scadenza del contratto è ${contract.expiresAt}. Includi riferimenti al contratto, motivazione generica, e termini di preavviso. La lettera deve essere in italiano, formale, pronta da firmare e inviare.`
    } else {
      title = `Riepilogo — ${contract.title}`
      prompt = `Genera un riepilogo sintetico del contratto "${contract.title}" con ${contract.counterpart}. La scadenza è ${contract.expiresAt}. Includi: oggetto del contratto, parti coinvolte, scadenze chiave, obblighi principali, clausole importanti, e azioni consigliate. Scrivi in italiano in modo chiaro e strutturato.`
    }

    setGeneratedTitle(title)
    const result = await sendChatMessageAction([{ role: "user", content: prompt }])

    if (result.success && result.response) {
      setGeneratedContent(result.response)
    } else {
      setError(result.error ?? "Errore nella generazione del documento")
    }
    setGenerating(false)
  }

  const handleCopy = useCallback(async () => {
    if (!generatedContent) return
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generatedContent])

  const handleDownload = useCallback(() => {
    if (!generatedContent) return
    const blob = new Blob([generatedContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${generatedTitle.replace(/[^a-zA-Z0-9àèéìòùÀÈÉÌÒÙ\s-]/g, "").replace(/\s+/g, "_")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [generatedContent, generatedTitle])

  const handleClose = () => {
    setGeneratedContent(null)
    setGeneratedTitle("")
    setError(null)
  }

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-2xl p-5 border border-border/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Files className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Documenti</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Crea documenti utili per la gestione dei tuoi contratti personali.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documentActions.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="border-border/30 bg-card/50">
              <CardHeader className="pb-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="size-4 text-primary" />
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {item.key ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleActionClick(item.key)}
                    disabled={generating}
                  >
                    <Bot className="size-4 mr-2" />
                    Genera con AI
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/contracts">Usa su un contratto</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Contract Selection Dialog */}
      {selectingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border/30 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Seleziona contratto
              </h2>
              <button
                onClick={() => setSelectingFor(null)}
                className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {selectingFor === "disdetta"
                ? "Per quale contratto vuoi generare la lettera di disdetta?"
                : "Per quale contratto vuoi generare il riepilogo?"}
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockContracts.map((contract) => (
                <button
                  key={contract.id}
                  onClick={() => handleContractSelect(contract)}
                  className="w-full text-left p-3 rounded-xl bg-muted/20 border border-border/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="text-sm font-medium text-foreground">{contract.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {contract.counterpart} · Scadenza: {contract.expiresAt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generating Indicator */}
      {generating && (
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <Loader2 className="size-4 text-primary animate-spin" />
          <span className="text-sm text-primary">Generazione documento in corso con NemoClaw AI...</span>
        </div>
      )}

      {/* Error Display */}
      {error && !generating && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="size-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={handleClose}
              className="mt-2 text-xs text-red-400 underline hover:no-underline"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* Generated Document Modal */}
      {generatedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border/30 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{generatedTitle}</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4 bg-muted/20 border border-border/20 rounded-xl p-4">
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {generatedContent}
              </p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />}
                {copied ? "Copiato!" : "Copia testo"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="size-4 mr-1" />
                Scarica
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Chiudi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
