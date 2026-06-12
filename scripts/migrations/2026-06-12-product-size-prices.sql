-- Precio por talla (opcional) para prendas que cuestan distinto según la talla
-- (ej. vestidos de baño infantiles: 2-4-6-8 vs 10-12-14-16).
-- Pegar en Supabase Studio → SQL Editor → Run. Idempotente.
--
-- Forma del JSON:  { "2": {"retail": 32300, "wholesale": 22300}, "10": {...}, ... }
-- Si una talla no está en el JSON, se usa price_retail / price_wholesale (base).
-- Mientras la columna no exista, sync-supabase.ts omite el campo y nada se rompe.

alter table public.products
  add column if not exists size_prices jsonb;

comment on column public.products.size_prices is
  'Precio por talla opcional: { "<talla>": {"retail": n, "wholesale": n} }. '
  'Si falta una talla, se usa price_retail/price_wholesale.';
