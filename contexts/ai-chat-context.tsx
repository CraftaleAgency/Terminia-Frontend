"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface AIChatContextType {
  isChatOpen: boolean
  chatWidth: number
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  setChatWidth: (width: number) => void
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined)

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatWidth, setChatWidth] = useState(400)

  const openChat = () => setIsChatOpen(true)
  const closeChat = () => setIsChatOpen(false)
  const toggleChat = () => setIsChatOpen(prev => !prev)

  return (
    <AIChatContext.Provider
      value={{
        isChatOpen,
        chatWidth,
        openChat,
        closeChat,
        toggleChat,
        setChatWidth,
      }}
    >
      {children}
    </AIChatContext.Provider>
  )
}

export function useAIChat() {
  const context = useContext(AIChatContext)
  if (context === undefined) {
    throw new Error("useAIChat must be used within a AIChatProvider")
  }
  return context
}
