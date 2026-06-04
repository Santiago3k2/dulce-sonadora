'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Upload, X, Star, ArrowLeft } from 'lucide-react';
import { saveProduct } from '@/lib/admin/product-actions';
import type { AdminCategory, AdminProduct } from '@/lib/admin/types';

const ADULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const KIDS_SIZES = ['2', '4', '6', '8', '10', '12', '14', '16', 'XS'];

export default function ProductForm({
  categories,
  product,
}: {
  categories: AdminCategory[];
  product?: AdminProduct;
}) {
  const router = useRouter();
  const [saving, startSave] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(product?.name ?? '');
  const [ref, setRef] = useState(product?.ref ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [priceRetail, setPriceRetail] = useState(String(product?.price_retail ?? ''));
  const [priceWholesale, setPriceWholesale] = useState(String(product?.price_wholesale ?? ''));
  const [minQty, setMinQty] = useState(String(product?.wholesale_min_qty ?? 6));
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [colorsText, setColorsText] = useState((product?.colors ?? []).join(', '));
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isNew, setIsNew] = useState(product?.is_new ?? true);
  const [inStock, setInStock] = useState(product?.in_stock ?? true);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('files', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Error subiendo imagen');
          break;
        }
        setImages((prev) => [...prev, ...(json.urls as string[])]);
      }
    } catch {
      setError('No se pudo subir la imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(i: number) {
    setImages((p) => p.filter((_, idx) => idx !== i));
  }
  function makeCover(i: number) {
    setImages((p) => {
      const c = [...p];
      const [x] = c.splice(i, 1);
      c.unshift(x);
      return c;
    });
  }
  function toggleSize(s: string) {
    setSizes((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const colors = colorsText.split(',').map((s) => s.trim()).filter(Boolean);
    startSave(async () => {
      const res = await saveProduct({
        id: product?.id,
        ref: ref.trim() || null,
        name,
        category_id: categoryId || null,
        description,
        price_retail: Number(priceRetail) || 0,
        price_wholesale: Number(priceWholesale) || 0,
        wholesale_min_qty: Number(minQty) || 6,
        colors,
        sizes,
        images,
        stock: Number(stock) || 0,
        is_featured: isFeatured,
        is_new: isNew,
        in_stock: inStock,
        is_active: isActive,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.push('/admin/productos');
      router.refresh();
    });
  }

  const input =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30 focus:border-pink-deeper';
  const label = 'block text-xs font-medium text-slate-600 mb-1.5';
  const card = 'bg-white rounded-xl border border-slate-200 p-5';

  return (
    <form onSubmit={submit}>
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.push('/admin/productos')}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold text-slate-800 truncate">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 bg-pink-deeper text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-pink-dark transition disabled:opacity-60 shrink-0"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-5">
          <div className={card}>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>Nombre del producto *</label>
                <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className={label}>Referencia</label>
                <input
                  className={input}
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="Ej. 015"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>Categoría</label>
              <select
                className={input}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">— Sin categoría —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className={label}>Descripción</label>
              <textarea
                className={input}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Imágenes */}
          <div className={card}>
            <label className={label}>Imágenes</label>
            <p className="text-xs text-slate-400 mb-3">
              La primera imagen es la principal (portada). Pasa el cursor para hacer principal o
              quitar.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((url, i) => (
                <div
                  key={url + i}
                  className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                >
                  <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-pink-deeper text-white text-[10px] px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => makeCover(i)}
                        title="Hacer principal"
                        className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-amber-500"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      title="Quitar"
                      className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-slate-400 cursor-pointer hover:border-pink-deeper hover:text-pink-deeper transition">
                {uploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Upload size={20} />
                    <span className="text-[11px]">Subir</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onFiles}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className={card}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Precio detal</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={priceRetail}
                  onChange={(e) => setPriceRetail(e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Precio mayorista</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={priceWholesale}
                  onChange={(e) => setPriceWholesale(e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Mayorista desde</label>
                <input
                  className={input}
                  type="number"
                  min={1}
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Stock</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={card}>
            <label className={label}>Tallas</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ADULT_SIZES.map((s) => (
                <SizeChip key={s} s={s} active={sizes.includes(s)} onClick={() => toggleSize(s)} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {KIDS_SIZES.map((s) => (
                <SizeChip key={s} s={s} active={sizes.includes(s)} onClick={() => toggleSize(s)} />
              ))}
            </div>

            <label className={`${label} mt-4`}>Colores / estampados</label>
            <textarea
              className={input}
              rows={3}
              value={colorsText}
              onChange={(e) => setColorsText(e.target.value)}
              placeholder="Separa con comas: Rosa, Azul Marino, Verde Oliva…"
            />
          </div>

          <div className={card}>
            <Toggle label="Visible en la tienda" checked={isActive} onChange={setIsActive} />
            <Toggle label="Destacado" checked={isFeatured} onChange={setIsFeatured} />
            <Toggle label="Nuevo" checked={isNew} onChange={setIsNew} />
            <Toggle label="Disponible (en stock)" checked={inStock} onChange={setInStock} />
          </div>
        </div>
      </div>
    </form>
  );
}

function SizeChip({ s, active, onClick }: { s: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs border transition ${
        active
          ? 'bg-pink-deeper text-white border-pink-deeper'
          : 'bg-white text-slate-600 border-slate-300 hover:border-pink-deeper'
      }`}
    >
      {s}
    </button>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition ${
          checked ? 'bg-pink-deeper' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
    </label>
  );
}
