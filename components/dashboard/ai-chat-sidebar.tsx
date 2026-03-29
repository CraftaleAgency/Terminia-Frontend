"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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
  Paperclip,
  Plus,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  MessageSquare,
  BrainCircuit,
  type LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAIChat } from "@/contexts/ai-chat-context"
import {
  sendChatMessageAction,
  getChatStreamConfig,
  listConversationsAction,
  createConversationAction,
  getConversationMessagesAction,
  renameConversationAction,
  deleteConversationAction,
  type ChatMessage
} from "@/lib/actions/chat"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  thinking?: string[]
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  updated_at: string
}

interface Attachment {
  file: File
  base64: string
  content_type: string
  filename: string
}

interface SuggestedQuestion {
  icon: LucideIcon
  question: string
  category: string
}

const companyQuestions: SuggestedQuestion[] = [
  { icon: Bell, question: "Quali contratti sono in scadenza e quali alert ho attivi?", category: "Scadenze" },
  { icon: BarChart3, question: "Dammi un riepilogo generale della mia situazione contrattuale", category: "Overview" },
  { icon: Search, question: "Quali controparti non sono ancora verificate con OSINT?", category: "Controparti" },
  { icon: Wallet, question: "Ci sono bandi di gara compatibili con la mia azienda?", category: "BandoRadar" },
  { icon: FileText, question: "Ho fatture scadute o pagamenti in sospeso?", category: "Fatture" },
  { icon: Building2, question: "Cosa devo controllare prima di firmare un NDA con un nuovo fornitore?", category: "Consulenza" },
]

const personalQuestions: SuggestedQuestion[] = [
  { icon: Bell, question: "Ho contratti in scadenza o alert attivi?", category: "Scadenze" },
  { icon: BarChart3, question: "Dammi un riepilogo dei miei contratti attivi", category: "Overview" },
  { icon: FileText, question: "Ci sono obblighi contrattuali con scadenza imminente?", category: "Obblighi" },
  { icon: Search, question: "Quali clausole nei miei contratti potrebbero essere rischiose?", category: "Analisi" },
  { icon: Wallet, question: "Ho pagamenti in sospeso o fatture da gestire?", category: "Pagamenti" },
  { icon: Building2, question: "Cosa devo verificare prima di firmare un nuovo contratto?", category: "Consulenza" },
]

const ACCEPTED_FILE_TYPES = ".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.gif"

// ── Thinking block component ────────────────────────────────────────────────

function ThinkingBlock({ steps, isStreaming }: { steps: string[]; isStreaming: boolean }) {
  const [open, setOpen] = useState(isStreaming) // open while streaming, close-able after

  // Auto-collapse when the response starts arriving
  useEffect(() => {
    if (!isStreaming) setOpen(false)
  }, [isStreaming])

  return (
    <div className="rounded-xl border border-border/30 bg-muted/20 text-xs overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <BrainCircuit className={cn("size-3.5 flex-shrink-0", isStreaming && "animate-pulse text-primary")} />
        <span className="flex-1 text-left font-medium">
          {isStreaming ? "Elaborazione in corso..." : "Ragionamento"}
        </span>
        {open ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1 border-t border-border/30">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-muted-foreground py-0.5">
                  <span className="mt-0.5 size-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "adesso"
  if (minutes < 60) return `${minutes} min fa`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? "ora" : "ore"} fa`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? "giorno" : "giorni"} fa`
  const months = Math.floor(days / 30)
  return `${months} ${months === 1 ? "mese" : "mesi"} fa`
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1] ?? result
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

interface AIChatSidebarProps {
  // Props removed - now uses context
}

export function AIChatSidebar({}: AIChatSidebarProps) {
  const { isChatOpen, closeChat, chatWidth, setChatWidth } = useAIChat()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [accountType, setAccountType] = useState<string>("company")

  // Conversation persistence state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  // File attachment state
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const suggestedQuestions = accountType === "personal" ? personalQuestions : companyQuestions

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load conversation list and user account type on sidebar open
  const loadConversations = useCallback(async () => {
    try {
      const result = await listConversationsAction()
      if (result.success && result.conversations.length > 0) {
        setConversations(result.conversations)
        // Auto-restore most recent conversation if no active conversation yet
        setActiveConversationId(prev => {
          if (prev) return prev // keep current if already selected
          return result.conversations[0].id
        })
        // Load messages for the most recent conversation
        const recent = result.conversations[0]
        const msgs = await getConversationMessagesAction(recent.id)
        if (msgs.success) {
          setActiveConversationId(recent.id)
          setMessages(msgs.messages.map(m => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at),
          })))
        }
      }
    } catch {
      // silently fail — list stays empty
    }
  }, [])

  const initialLoadDone = useRef(false)

  useEffect(() => {
    if (isChatOpen && !initialLoadDone.current) {
      initialLoadDone.current = true
      loadConversations()
      // Load user account type to show relevant suggested questions
      getChatStreamConfig().then(config => {
        if (!('error' in config)) {
          setAccountType(config.accountType)
        }
      })
    } else if (isChatOpen) {
      // Refresh conversation list without resetting messages
      listConversationsAction().then(result => {
        if (result.success) setConversations(result.conversations)
      })
    }
  }, [isChatOpen, loadConversations])

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = window.innerWidth - e.clientX
      const minWidth = 320
      const maxWidth = window.innerWidth * 0.6

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

  // --- Conversation management ---

  const handleNewConversation = () => {
    setActiveConversationId(null)
    setMessages([])
    setAttachment(null)
    setHistoryOpen(false)
  }

  const handleSelectConversation = async (conv: Conversation) => {
    setActiveConversationId(conv.id)
    setHistoryOpen(false)
    setAttachment(null)
    try {
      const result = await getConversationMessagesAction(conv.id)
      if (result.success) {
        setMessages(
          result.messages.map(m => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at),
          }))
        )
      }
    } catch {
      // keep current messages on failure
    }
  }

  const handleRenameConversation = async (id: string) => {
    const trimmed = renameValue.trim()
    if (!trimmed) {
      setRenamingId(null)
      return
    }
    try {
      await renameConversationAction(id, trimmed)
      setConversations(prev =>
        prev.map(c => (c.id === id ? { ...c, title: trimmed } : c))
      )
    } catch {
      // silently fail
    }
    setRenamingId(null)
  }

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversationAction(id)
      setConversations(prev => prev.filter(c => c.id !== id))
      if (activeConversationId === id) {
        handleNewConversation()
      }
    } catch {
      // silently fail
    }
  }

  // --- File attachment ---

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const base64 = await fileToBase64(file)
      setAttachment({
        file,
        base64,
        content_type: file.type || "application/octet-stream",
        filename: file.name,
      })
    } catch {
      // ignore read errors
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const clearAttachment = () => setAttachment(null)

  // --- Send message ---

  const handleSendMessage = async (content: string) => {
    if (!content.trim() && !attachment) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Capture attachment before clearing
    const currentAttachment = attachment
      ? { base64: attachment.base64, content_type: attachment.content_type, filename: attachment.filename }
      : undefined
    setAttachment(null)

    // Create conversation on first message
    let conversationId = activeConversationId
    if (!conversationId) {
      try {
        const title = content.trim().slice(0, 50) || "Nuova conversazione"
        const created = await createConversationAction(title)
        if (created && typeof created === "object" && "id" in created) {
          conversationId = (created as { id: string }).id
          setActiveConversationId(conversationId)
          setConversations(prev => [
            { id: conversationId!, title, updated_at: new Date().toISOString() },
            ...prev,
          ])
        }
      } catch {
        // continue without persistence
      }
    }

    const chatHistory: ChatMessage[] = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: content.trim() }
    ]

    let streamCommitted = false
    try {
      const config = await getChatStreamConfig()
      if ("error" in config) throw new Error(config.error)

      const fetchBody: Record<string, unknown> = {
        messages: chatHistory.slice(-20),
        company_id: config.companyId,
        stream: true,
      }
      if (conversationId) fetchBody.conversation_id = conversationId
      if (currentAttachment) fetchBody.attachment = currentAttachment

      const response = await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.token}`,
        },
        body: JSON.stringify(fetchBody),
      })

      if (!response.ok || !response.body) {
        throw new Error(`Stream failed (${response.status})`)
      }

      streamCommitted = true
      const assistantMessageId = (Date.now() + 1).toString()
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: "assistant" as const,
        content: "",
        timestamp: new Date()
      }])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith(":")) continue
            if (trimmed === "data: [DONE]") return

            if (trimmed.startsWith("data: ")) {
              try {
                const chunk = JSON.parse(trimmed.slice(6)) as { content?: string; type?: string }
                if (chunk.type === "thinking" && chunk.content) {
                  // Accumulate thinking steps in the assistant message
                  setMessages(prev => prev.map(m =>
                    m.id === assistantMessageId
                      ? { ...m, thinking: [...(m.thinking ?? []), chunk.content!] }
                      : m
                  ))
                } else if (chunk.content) {
                  setMessages(prev => prev.map(m =>
                    m.id === assistantMessageId
                      ? { ...m, content: m.content + chunk.content }
                      : m
                  ))
                }
              } catch {
                // skip malformed SSE chunk
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      setMessages(prev => prev.map(m =>
        m.id === assistantMessageId && !m.content.trim()
          ? { ...m, content: "Mi dispiace, non riesco a rispondere in questo momento. Riprova tra qualche istante." }
          : m
      ))
    } catch {
      if (streamCommitted) return

      try {
        const result = await sendChatMessageAction(chatHistory)
        setIsTyping(false)

        if (result.success && result.response) {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: "assistant" as const,
            content: result.response ?? '',
            timestamp: new Date()
          }])
        } else {
          throw new Error(result.error)
        }
      } catch {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: "Mi dispiace, non riesco a rispondere in questo momento. Riprova tra qualche istante.",
          timestamp: new Date()
        }])
      }
    }
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

          {/* Conversation history dropdown */}
          <div className="flex-shrink-0 border-b border-border/30">
            <button
              onClick={() => setHistoryOpen(prev => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="size-3.5" />
                <span className="truncate">
                  {activeConversationId
                    ? conversations.find(c => c.id === activeConversationId)?.title ?? "Conversazione"
                    : "Nuova conversazione"}
                </span>
              </span>
              {historyOpen ? <ChevronUp className="size-3.5 flex-shrink-0" /> : <ChevronDown className="size-3.5 flex-shrink-0" />}
            </button>

            <AnimatePresence>
              {historyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-1 max-h-64 overflow-y-auto">
                    {/* New conversation button */}
                    <button
                      onClick={handleNewConversation}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Plus className="size-3.5" />
                      Nuova conversazione
                    </button>

                    {conversations.map(conv => (
                      <div
                        key={conv.id}
                        className={cn(
                          "group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                          conv.id === activeConversationId
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted/30"
                        )}
                      >
                        {renamingId === conv.id ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onBlur={() => handleRenameConversation(conv.id)}
                            onKeyDown={e => {
                              if (e.key === "Enter") handleRenameConversation(conv.id)
                              if (e.key === "Escape") setRenamingId(null)
                            }}
                            className="flex-1 min-w-0 bg-transparent border-b border-primary/50 text-sm text-foreground outline-none"
                          />
                        ) : (
                          <div
                            className="flex-1 min-w-0"
                            onClick={() => handleSelectConversation(conv)}
                          >
                            <p className="truncate text-sm">{conv.title}</p>
                            <p className="text-[10px] text-muted-foreground">{relativeTime(conv.updated_at)}</p>
                          </div>
                        )}

                        {renamingId !== conv.id && (
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                setRenamingId(conv.id)
                                setRenameValue(conv.title)
                              }}
                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            >
                              <Pencil className="size-3" />
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                handleDeleteConversation(conv.id)
                              }}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {conversations.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-2">Nessuna conversazione salvata</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                      Sono l&#39;assistente AI di Terminia. Posso aiutarti con la gestione dei contratti, scadenze e molto altro.
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
                      <div className="flex-1 flex flex-col gap-1.5 max-w-[85%]">
                        {/* Thinking block — collapsible, shown for assistant messages */}
                        {message.role === "assistant" && message.thinking && message.thinking.length > 0 && (
                          <ThinkingBlock steps={message.thinking} isStreaming={!message.content.trim()} />
                        )}
                        {/* Message bubble */}
                        <div className={cn(
                          "rounded-2xl p-4",
                          message.role === "user"
                            ? "bg-primary text-white"
                            : "bg-muted/30 border border-border/30"
                        )}>
                          {message.role === "assistant" ? (
                            <div className="text-sm text-foreground
                              [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0
                              [&>ul]:my-1 [&>ul]:pl-4 [&>ul>li]:my-0.5 [&>ul>li]:list-disc
                              [&>ol]:my-1 [&>ol]:pl-4 [&>ol>li]:my-0.5 [&>ol>li]:list-decimal
                              [&>h1]:text-base [&>h1]:font-semibold [&>h1]:my-2
                              [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:my-1.5
                              [&>h3]:text-sm [&>h3]:font-medium [&>h3]:my-1
                              [&>strong]:font-semibold
                              [&>a]:text-primary [&>a]:no-underline [&>a:hover]:underline
                              [&>code]:bg-muted/50 [&>code]:rounded [&>code]:px-1 [&>code]:text-xs [&>code]:font-mono
                              [&>pre]:bg-muted/50 [&>pre]:rounded-lg [&>pre]:p-3 [&>pre]:text-xs [&>pre]:overflow-auto
                              [&>blockquote]:border-l-2 [&>blockquote]:border-primary/40 [&>blockquote]:pl-3 [&>blockquote]:text-muted-foreground [&>blockquote]:italic
                              [&_table]:w-full [&_table]:text-xs [&_td]:border [&_td]:border-border/30 [&_td]:px-2 [&_td]:py-1
                              [&_th]:border [&_th]:border-border/30 [&_th]:px-2 [&_th]:py-1 [&_th]:bg-muted/30 [&_th]:font-medium
                              [&_hr]:border-border/30 [&_hr]:my-2">
                              {message.content ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.content}
                                </ReactMarkdown>
                              ) : (
                                <span className="text-muted-foreground italic text-xs">Elaborazione in corso...</span>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          )}
                          <p className={cn(
                            "text-[10px] mt-2",
                            message.role === "user" ? "text-white/70" : "text-muted-foreground"
                          )}>
                            {message.timestamp.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
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

            {/* Attachment chip */}
            {attachment && (
              <div className="px-4 pt-2 flex-shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary">
                  <Paperclip className="size-3" />
                  <span className="truncate max-w-[180px]">{attachment.filename}</span>
                  <button
                    onClick={clearAttachment}
                    className="p-0.5 rounded hover:bg-primary/20 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }}
                className="flex items-center gap-2"
              >
                {/* File upload button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTyping}
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  title="Allega file"
                >
                  <Paperclip className="size-4" />
                </button>

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
                  disabled={(!inputValue.trim() && !attachment) || isTyping}
                  className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
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
