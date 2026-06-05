'use client';

import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  X,
  Loader2,
  Upload,
} from 'lucide-react';
import {
  saveCategory,
  deleteCategory,
  setCategoryActive,
  reorderCategories,
} from '@/lib/admin/category-actions';
import type { AdminCategory } from '@/lib/admin/types';

type Editing = AdminCategory | null | undefined; // undefined = cerrado, null = nueva

export default function CategoriesManager({
  categories,
  counts,
}: {
  categories: AdminCategory[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [items, setItems] = useState(categories);
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<Editing>(undefined);

  useEffect(() => setItems(categories), [categories]);

  const groupLabels = Array.from(
    new Set(categories.map((c) => c.group_label).filter(Boolean) as string[])
  );

  function run(fn: () => Promise<{ error?: string; ok?: boolean }>) {
    start(async () => {
      const r = await fn();
      if (r?.error) alert(r.error);
      else router.refresh();
    });
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    run(() => reorderCategories(next.map((c) => c.id)));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Categorías</h1>
          <p className="text-sm text-slate-500">
            {items.length} categorías · usa las flechas para reordenar el menú
          </p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="inline-flex items-center gap-2 bg-pink-deeper text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-pink-dark transition"
        >
          <Plus size={16} /> Nueva
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {items.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3 px-3 sm:px-4 py-3">
            <div className="flex flex-col">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0 || pending}
                className="text-slate-400 hover:text-pink-deeper disabled:opacity-30"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1 || pending}
                className="text-slate-400 hover:text-pink-deeper disabled:opacity-30"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="relative w-10 h-12 rounded bg-slate-100 overflow-hidden shrink-0">
              {c.image && <Image src={c.image} alt="" fill className="object-cover" sizes="40px" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-700 truncate">{c.name}</p>
              <p className="text-xs text-slate-400">
                {c.group_label} · /{c.slug} · {counts[c.id] ?? 0} producto
                {(counts[c.id] ?? 0) !== 1 ? 's' : ''}
              </p>
            </div>

            {!c.is_active && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 hidden sm:inline">
                Oculta
              </span>
            )}

            <div className="flex items-center gap-1">
              <button
                title={c.is_active ? 'Ocultar' : 'Mostrar'}
                onClick={() => run(() => setCategoryActive(c.id, !c.is_active))}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              >
                {c.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                title="Editar"
                onClick={() => setEditing(c)}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              >
                <Pencil size={16} />
              </button>
              <button
                title="Eliminar"
                onClick={() => {
                  if (
                    confirm(
                      `¿Eliminar "${c.name}"? Sus ${counts[c.id] ?? 0} producto(s) quedarán sin categoría.`
                    )
                  )
                    run(() => deleteCategory(c.id));
                }}
                className="p-1.5 rounded hover:bg-red-50 text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="px-4 py-10 text-center text-slate-400 text-sm">
            Aún no hay categorías. Crea la primera.
          </p>
        )}
      </div>

      {editing !== undefined && (
        <CategoryModal
          category={editing}
          groupLabels={groupLabels}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function CategoryModal({
  category,
  groupLabels,
  onClose,
  onSaved,
}: {
  category: AdminCategory | null;
  groupLabels: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [groupLabel, setGroupLabel] = useState(category?.group_label ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [image, setImage] = useState(category?.image ?? '');
  const [isActive, setIsActive] = useState(category?.is_active ?? true);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('files', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) setError(json.error || 'Error subiendo imagen');
      else setImage(json.urls[0]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    start(async () => {
      const r = await saveCategory({
        id: category?.id,
        name,
        slug: slug || undefined,
        group_label: groupLabel,
        image: image || null,
        description,
        is_active: isActive,
      });
      if (r?.error) {
        setError(r.error);
        return;
      }
      onSaved();
    });
  }

  const input =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30 focus:border-pink-deeper';
  const label = 'block text-xs font-medium text-slate-600 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {category ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label className={label}>Nombre *</label>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Grupo del menú</label>
              <input
                className={input}
                list="grupos"
                value={groupLabel}
                onChange={(e) => setGroupLabel(e.target.value)}
                placeholder="Dama, Hombre, Niños…"
              />
              <datalist id="grupos">
                {groupLabels.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={label}>URL (slug)</label>
              <input
                className={input}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto"
              />
            </div>
          </div>

          <div>
            <label className={label}>Descripción</label>
            <textarea
              className={input}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className={label}>Imagen</label>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                {image && <Image src={image} alt="" fill className="object-cover" sizes="64px" />}
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-600 border border-slate-300 rounded-lg px-3 py-2 cursor-pointer hover:border-pink-deeper">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {image ? 'Cambiar' : 'Subir'}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
              </label>
            </div>
          </div>

          <label className="flex items-center justify-between py-1 cursor-pointer">
            <span className="text-sm text-slate-700">Visible en la tienda</span>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative w-10 h-6 rounded-full transition ${
                isActive ? 'bg-pink-deeper' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                  isActive ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2 text-sm font-medium hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-pink-deeper text-white rounded-lg py-2 text-sm font-semibold hover:bg-pink-dark disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
