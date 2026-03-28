"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  FileText,
  Bell,
  Search,
  BarChart3,
  Building2,
  Wallet,
  type LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAIChat } from "@/contexts/ai-chat-context"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface SuggestedQuestion {
  icon: LucideIcon
  question: string
  category: string
}

const suggestedQuestions: SuggestedQuestion[] = [
  {
    icon: FileText,
    question: "Come posso caricare un nuovo contratto?",
    category: "Contratti"
  },
  {
    icon: Bell,
    question: "Come funzionano gli alert per le scadenze?",
    category: "Alert"
  },
  {
    icon: Search,
    question: "Come posso cercare una clausola specifica?",
    category: "Ricerca"
  },
  {
    icon: BarChart3,
    question: "Come interpreto il risk score di un contratto?",
    category: "Analytics"
  },
  {
    icon: Building2,
    question: "Come aggiungo una nuova controparte?",
    category: "Controparti"
  },
  {
    icon: Wallet,
    question: "Come tracciare i pagamenti in scadenza?",
    category: "Fatture"
  },
]

interface AIChatSidebarProps {
  // Props removed - now uses context
}

export function AIChatSidebar({}: AIChatSidebarProps) {
  const { isChatOpen, closeChat, chatWidth, setChatWidth } = useAIChat()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = window.innerWidth - e.clientX
      const minWidth = 320
      const maxWidth = window.innerWidth * 0.6 // Max 60% of viewport

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setChatWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, setChatWidth])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("carica") && lowerMessage.includes("contratto")) {
      return "Per caricare un nuovo contratto:\n\n1. Vai nella sezione 'Contratti' dalla sidebar\n2. Clicca sul pulsante 'Nuovo Contratto' in alto a destra\n3. Trascina il file PDF o DOCX nell'area di upload\n4. L'AI analizzerà automaticamente il documento estraendo scadenze, clausole e obblighi\n\nIl processo richiede circa 30-60 secondi. Vuoi che ti guidi attraverso i passaggi?"
    }

    if (lowerMessage.includes("alert") && lowerMessage.includes("scadenza")) {
      return "Gli alert per le scadenze funzionano così:\n\n• Notifiche automatiche: Riceverai email e notifiche in-app a 90, 60 e 30 giorni prima di ogni scadenza critica\n\n• Tipi di alert:\n- Scadenze contratti\n- Pagamenti attesi\n- Rinnovi taciti\n- Bandi pubblici compatibili\n\n• Personalizzazione: Puoi configurare le preferenze nelle Impostazioni > Notifiche\n\nVuoi configurare le tue preferenze di notifica ora?"
    }

    if (lowerMessage.includes("cerca") && lowerMessage.includes("clausola")) {
      return "Per cercare una clausola specifica:\n\n1. Usa la barra di ricerca globale (⌘K) nell'header\n2. Digita parole chiave come 'penale', 'rinnovo', 'riservatezza'\n3. Oppure apri un contratto e usa la chatbot contrattuale per domande specifiche\n\n**Esempio**: 'Quali sono le clausole penali nel contratto con TechSupply?'\n\nL'AI cercherà in tutti i documenti e ti mostrerà i risultati pertinenti. Vuoi provare una ricerca?"
    }

    if (lowerMessage.includes("risk score") || lowerMessage.includes("rischio")) {
      return "Il Risk Score è un indicatore 0-100 che valuta il livello di rischio di ogni contratto:\n\n• 0-30 - Basso: Contratti con clausole standard, nessuna penale significativa\n\n• 31-70 - Medio: Presenza di alcune clausole attention, scadenze ravvicinate\n\n• 71-100 - Alto: Clausole rischiose, penali elevate, scadenze critiche imminenti\n\nL'AI analizza automaticamente:\n- Clausole penali\n- Termini di disdetta\n- Obblighi contrattuali\n- Storico pagamenti\n\nVuoi vedere i contratti ad alto rischio nel tuo portfolio?"
    }

    if (lowerMessage.includes("aggiung") && lowerMessage.includes("controparte")) {
      return "Per aggiungere una nuova controparte:\n\n1. Vai in 'Controparti' dalla sidebar\n2. Clicca 'Nuova Controparte'\n3. Inserisci i dati:\n   - Ragione sociale\n   - Partita IVA (verificata automaticamente via API)\n   - Categoria (Fornitore, Cliente, Partner)\n\nL'API VIES verificherà automaticamente la validità della Partita IVA europea.\n\nVuoi aggiungere una controparte ora?"
    }

    if (lowerMessage.includes("pagament") && lowerMessage.includes("scadenza")) {
      return "Per tracciare i pagamenti in scadenza:\n\n• Dashboard > Fatture mostra:\n- Da incassare: fatture emesse non ancora pagate\n- Da pagare: fatture ricevute con scadenza\n\n• Cashflow Proiettato:\n- Visualizza i pagamenti attesi nei prossimi 6-12 mesi\n- Basato sulle milestone estratte automaticamente dai contratti\n\n• Alert automatici:\n- Notifiche 7 giorni prima della scadenza\n- Promemoria per fatture scadute\n\nVuoi vedere l'elenco dei pagamenti imminenti?"
    }

    // Default response
    return "Grazie per la domanda! Sono qui per aiutarti con la gestione dei contratti.\n\nPosso assisterti con:\n• Caricamento e analisi contratti\n• Configurazione alert e scadenze\n• Ricerca clausole e informazioni\n• Interpretazione risk score\n• Gestione controparti\n• Tracciamento pagamenti\n\nCosa vorresti sapere di più?"
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: generateAIResponse(content),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <AnimatePresence mode="wait">
      {isChatOpen && (
        <motion.div
          ref={sidebarRef}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: chatWidth, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed top-[72px] right-0 bottom-0 z-[40] bg-background/95 backdrop-blur-sm border-l border-border/30 shadow-2xl"
        >

          {/* Content wrapper with independent scroll */}
          <div className="ai-chat-content h-full flex flex-col">
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-border/30 bg-background/95 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="size-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-sm">Assistente AI</h2>
                <p className="text-xs text-muted-foreground">Sempre qui per aiutarti</p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="space-y-6">
                  {/* Welcome message */}
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Bot className="size-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Ciao!</h3>
                    <p className="text-sm text-muted-foreground">
                      Sono l'assistente AI di Terminia. Posso aiutarti con la gestione dei contratti, scadenze e molto altro.
                    </p>
                  </div>

                  {/* Suggested questions */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Domande frequenti
                    </p>
                    <div className="space-y-2">
                      {suggestedQuestions.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={index}
                            onClick={() => handleQuestionClick(item.question)}
                            className="w-full flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/30 hover:border-primary/30 transition-all text-left group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <Icon className="size-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                                {item.question}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "flex-row-reverse"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        message.role === "user"
                          ? "bg-primary/20"
                          : "bg-gradient-to-br from-primary to-primary/60"
                      )}>
                        {message.role === "user" ? (
                          <User className="size-4 text-primary" />
                        ) : (
                          <Bot className="size-4 text-white" />
                        )}
                      </div>
                      <div className={cn(
                        "flex-1 rounded-2xl p-4 max-w-[85%]",
                        message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-muted/30 border border-border/30"
                      )}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={cn(
                          "text-[10px] mt-2",
                          message.role === "user" ? "text-white/70" : "text-muted-foreground"
                        )}>
                          {message.timestamp.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <Bot className="size-4 text-white" />
                      </div>
                      <div className="bg-muted/30 border border-border/30 rounded-2xl p-4">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
              </div>
            </ScrollArea>
          </div>

            {/* Input */}
            <div className="p-4 border-t border-border/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    )
  }
