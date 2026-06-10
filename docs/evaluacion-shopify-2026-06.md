# Evaluación: ¿Mantener o eliminar Shopify?

**Fecha:** 10 de junio de 2026 · **Proyecto:** Dulce Soñadora e-commerce

## Contexto

| Capa | Estado actual |
|---|---|
| Tienda web | Next.js en **Vercel** (dulce-sonadora.vercel.app) — funcional y en producción |
| Base de datos | **Supabase** (productos, categorías, pedidos, admins) — fuente de verdad |
| Panel admin | Propio (`/admin`): productos, categorías, pedidos, alertas de pendientes |
| Checkout | Propio: guarda pedidos en BD, recalcula precios server-side, método de pago con recargo online |
| Pagos | WhatsApp/transferencia (activo) · ePayco (planeado, sin cuenta aún) |
| Shopify | Tienda "VITALSTORE" (r8f85u-re.myshopify.com) con el catálogo copiado una vez (jun 2026), **hoy desactualizado**. Storefront API nunca conectada al front (token pendiente). **Cero ventas por Shopify.** |

## 1. ¿Qué funciones de Shopify estamos usando hoy?

**Ninguna en producción.** Shopify solo tiene una copia del catálogo que ya quedó vieja
(las últimas 2 actualizaciones de catálogo se hicieron solo en Supabase/Vercel). La
integración headless (Storefront API) nunca se completó; ningún cliente ve ni compra
nada a través de Shopify.

## 2. ¿Qué ya reemplaza el sistema propio?

| Función | Shopify | Sistema propio |
|---|---|---|
| Catálogo de productos | copia desactualizada | ✅ Supabase + panel admin |
| Gestión de pedidos | sin uso | ✅ tabla `orders` + panel con seguimiento |
| Checkout | sin conectar | ✅ propio, con precios server-side |
| Precio mayorista (≥6 und) | ❌ **no lo soporta nativo** (requiere Plus o apps) | ✅ automático en carrito |
| Recargo pago online (2.68%+$900+IVA) | ❌ no modelable nativo | ✅ implementado |
| Hosting + imágenes | — | ✅ Vercel + GitHub |
| Notificaciones de pedidos | — | ✅ dashboard admin |
| Registro de pedidos WhatsApp | — | ✅ implementado |

## 3. Ventajas de MANTENER Shopify

- Checkout con certificación PCI y pasarelas preintegradas (sin programar).
- Panel pulido y ecosistema de apps (reseñas, email marketing, POS físico).
- Infraestructura "a prueba de todo" si el negocio escala mucho.
- Canales nativos (Instagram/Facebook Shopping vía Shopify).

## 4. Ventajas de ELIMINAR Shopify

- **Ahorro directo:** plan Basic ≈ USD $25–39/mes ⇒ **~$1.6–2.5 millones COP/año**.
- **Comisión oculta:** en Colombia no existe Shopify Payments; con pasarela externa
  Shopify cobra **~2% extra por transacción** (además de la comisión de la pasarela).
  Con ePayco directo en el sistema propio ese 2% no existe.
- **ePayco ni siquiera es pasarela nativa del checkout de Shopify** — la integración
  sería un workaround más frágil que integrarlo directo en Next.js (webhook → `orders`).
- **Una sola fuente de verdad:** hoy cada cambio de catálogo hay que hacerlo dos veces;
  ya está desincronizado a los 2 días de migrado. Ese doble mantenimiento es un costo
  permanente y fuente de errores (precios/fotos viejas de cara al cliente).
- **El modelo de precios del negocio no cabe en Shopify:** mayorista por cantidad +
  detal + recargo online ya exigieron lógica propia. En Shopify eso es Plus (USD
  $2,300/mes), apps de pago, o simplificar el negocio para que quepa en la herramienta.
- Vercel + Supabase en este volumen de tráfico cuestan **$0** (planes free alcanzan de
  sobra; el upgrade eventual son ~USD $45/mes combinados, y solo cuando haya tracción).

## 5. Recomendación final

> **Eliminar Shopify y completar el sistema propio con ePayco directo.**

**Justificación:**

1. **Financiera:** Shopify hoy es 100% costo y 0% ingreso (nada se vende por ahí).
   Mantenerlo "por si acaso" cuesta ~$2M COP/año + 2% de cada venta futura, en un
   negocio cuyo margen por prenda es de miles de pesos, no de millones.
2. **Técnica:** todo lo que Shopify haría ya existe en el sistema propio, y lo único
   que falta (pago en línea) se integra **mejor** directo con ePayco (SDK/checkout
   web + webhook de confirmación → actualizar `orders`), porque ePayco no es pasarela
   nativa de Shopify.
3. **Operativa:** un solo catálogo que mantener. Las actualizaciones que hoy haces
   (carpetas → web) ya tienen flujo probado; duplicarlas a Shopify es trabajo manual
   permanente sin retorno.
4. **Reversible:** el script `scripts/shopify-migrate.mjs` queda en el repo. Si en el
   futuro hay volumen que justifique Shopify (cientos de pedidos/día, POS físico,
   Instagram Shopping nativo), se reabre una tienda y se re-migra el catálogo en
   minutos. No se pierde nada eliminándolo ahora.

**Acciones concretas:**
- [ ] Cancelar la suscripción/cerrar la tienda VITALSTORE **antes del próximo cobro mensual**.
- [ ] Conservar `shopify.app.toml` y el script de migración en el repo (ya están).
- [ ] Abrir cuenta ePayco e integrarla al checkout propio (botón "Pago en línea" ya
      muestra los precios con recargo — solo falta conectar la pasarela real).
- [ ] Configurar las env vars de Supabase en Vercel si falta alguna (revisar).

**Único escenario para reconsiderar:** crecimiento que desborde el panel propio
(inventario multi-bodega, POS en tienda física, equipo de ventas grande). Ahí Shopify
vale su precio. Hoy, no.
