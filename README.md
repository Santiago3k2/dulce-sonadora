# 🌸 Dulce Soñadora

E-commerce de pijamas y lencería construido con **Next.js 14**, **TypeScript**, **Tailwind CSS** y **Zustand**.
Deploy en **Vercel** (1 clic).

---

## ✨ Features

- 🎨 Identidad visual rosa palo + Playfair Display + Poppins
- 🧭 Header sticky con dropdowns por grupo de categorías
- 📱 Mobile Bottom Nav (Inicio, Tienda, Deseados, WhatsApp, Mi Cuenta)
- 🖼️ Hero Slider con autoplay (embla-carousel)
- 🛒 Carrito con Zustand + drawer lateral + persistencia
- 💖 Wishlist persistente
- 🏷️ **Precio mayorista automático** al sumar ≥ 6 unidades
- 👁️ Modal Quick View
- 💬 Botón **Pedir por WhatsApp** que genera mensaje con el detalle
- 📦 27 productos reales en 12 categorías
- 📱 Mobile-first responsive

---

## 🚀 Cómo trabajar localmente

```bash
npm install     # instalar dependencias (solo la primera vez)
npm run dev     # abrir http://localhost:3000
npm run build   # build de prueba
```

---

## 📤 Cómo subir a Vercel (despliegue)

### Paso 1 — Subir el código a GitHub
1. Ve a [github.com/new](https://github.com/new)
2. Crea un repositorio llamado `dulce-sonadora` (público o privado, tú decides)
3. **NO marques** la opción "Add a README" (ya tenemos uno)
4. Copia los comandos que GitHub te muestra al final, son del tipo:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/dulce-sonadora.git
   git branch -M main
   git push -u origin main
   ```

### Paso 2 — Conectar en Vercel
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en *Import* al lado de tu repo `dulce-sonadora`
3. Vercel detecta automáticamente que es **Next.js** → no cambies nada
4. Click en **Deploy**

✅ En ~2 minutos tendrás tu sitio en `https://dulce-sonadora.vercel.app`

### Paso 3 — Cada vez que hagas un cambio
Solo `git push` y Vercel re-despliega solo. Mágico.

---

## 🌐 Conectar tu dominio propio (opcional)
1. En el dashboard de Vercel → tu proyecto → *Settings* → *Domains*
2. Escribe tu dominio (ej: `dulcesonadora.com`)
3. Vercel te muestra los DNS records que debes copiar donde compraste el dominio (Hostinger, GoDaddy, Namecheap, etc.)

---

## ✏️ Personalización rápida

### Cambiar el número de WhatsApp
`lib/utils/format.ts`:
```ts
export const WHATSAPP_NUMBER = '573001234567'; // ← tu número con código país
```

### Cambiar dirección, correo, horario
`components/layout/Footer.tsx` y `app/contacto/page.tsx`.

### Cambiar redes sociales
Links en `components/layout/Footer.tsx`.

### Agregar productos
1. Pon las fotos en `public/products/[slug]/photo-1.jpg`, `photo-2.jpg`, etc.
2. Añade el producto al array en `lib/data/products.ts`.

### Cambiar colores de marca
`tailwind.config.ts` → tokens `pink-soft`, `pink-dark`, `pink-deeper`.

---

## 🗂️ Estructura

```
app/                  # páginas (Next.js App Router)
components/
├── layout/           # Header, Footer, MobileBottomNav
├── home/             # HeroSlider, CategoryGrid, FeaturedProducts, BenefitsSection
├── products/         # ProductCard, ProductGrid, QuickView
└── ui/               # PriceDisplay, WishlistButton, CartDrawer, Badge
lib/
├── data/             # categories.ts, products.ts
├── store/            # cartStore, wishlistStore (Zustand)
└── utils/            # format helpers (COP + WhatsApp)
public/products/      # 174 fotos reales de productos
```

---

## 🧱 Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 3 |
| Estado | Zustand + persist |
| Slider | embla-carousel |
| Iconos | lucide-react |
| Hosting | Vercel |
