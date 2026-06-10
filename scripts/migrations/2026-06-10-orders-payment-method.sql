-- Método de pago del pedido (whatsapp | transferencia | online).
-- Pegar en Supabase Studio → SQL Editor → Run.
-- Mientras esta columna no exista, el código guarda el método dentro de las
-- notas del pedido ("[Pago: …]"), así que nada se rompe si se corre después.

alter table public.orders
  add column if not exists payment_method text not null default 'whatsapp';

comment on column public.orders.payment_method is
  'whatsapp | transferencia | online (online lleva recargo de pasarela en los precios)';
