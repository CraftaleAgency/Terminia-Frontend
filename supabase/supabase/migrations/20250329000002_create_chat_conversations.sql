-- ============================================================
-- TERMINIA — 005 CHAT CONVERSATIONS
-- Persistent chat history per user with conversation management
-- ============================================================

CREATE TABLE public.conversations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id    UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title         TEXT DEFAULT 'Nuova conversazione',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.chat_messages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content         TEXT NOT NULL,
  attachment      JSONB DEFAULT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_company_id ON public.conversations(company_id);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_conversations" ON public.conversations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "users_own_messages" ON public.chat_messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE user_id = auth.uid()
    )
  );

-- Service role can insert (for NemoClaw API responses)
CREATE POLICY "service_insert_conversations" ON public.conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "service_insert_messages" ON public.chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "service_select_messages" ON public.chat_messages
  FOR SELECT USING (true);
