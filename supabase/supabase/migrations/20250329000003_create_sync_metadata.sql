-- sync_metadata: tracks last sync time and stats for bandi data sources
CREATE TABLE IF NOT EXISTS public.sync_metadata (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL UNIQUE,
  last_synced_at timestamptz NOT NULL DEFAULT now(),
  records_synced integer DEFAULT 0,
  records_skipped integer DEFAULT 0,
  records_errored integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.sync_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on sync_metadata"
  ON public.sync_metadata
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.sync_metadata IS 'Tracks bandi sync pipeline execution metadata per source (anac, ted)';
