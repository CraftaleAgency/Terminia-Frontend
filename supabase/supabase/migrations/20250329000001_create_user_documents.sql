-- ============================================================
-- TERMINIA — 004 USER DOCUMENTS (knowledge base)
-- Stores documents uploaded by users (registration, contracts, manual)
-- Linked to Supabase Storage bucket "documents"
-- ============================================================

CREATE TABLE public.user_documents (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id    UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  storage_path  TEXT NOT NULL,
  filename      TEXT NOT NULL,
  content_type  TEXT DEFAULT 'application/octet-stream',
  size_bytes    INTEGER,
  source        TEXT DEFAULT 'upload' CHECK (source IN ('registration', 'contract', 'manual', 'upload')),
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX idx_user_documents_company_id ON public.user_documents(company_id);

-- RLS
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- Users can see their own documents
CREATE POLICY "users_own_documents" ON public.user_documents
  FOR SELECT USING (user_id = auth.uid());

-- Service role can insert (used by NemoClaw API)
CREATE POLICY "service_insert_documents" ON public.user_documents
  FOR INSERT WITH CHECK (true);

-- Storage bucket RLS: users can read their own files
-- (Bucket created via API, these policies apply to storage.objects)
CREATE POLICY "users_read_own_documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "service_upload_documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
  );
