export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  group?: string;
  group_label?: string;
  image?: string | null;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface AdminProduct {
  id: string;
  ref: string | null;
  slug: string;
  name: string;
  category_id: string | null;
  category?: { id: string; slug: string; name: string } | null;
  description: string | null;
  price_retail: number;
  price_wholesale: number;
  wholesale_min_qty: number;
  colors: string[];
  sizes: string[];
  images: string[];
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  in_stock: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface AdminCategoryInput {
  id?: string;
  name: string;
  slug?: string;
  group_label: string;
  image: string | null;
  description: string;
  is_active: boolean;
}

export interface AdminProductInput {
  id?: string;
  ref: string | null;
  name: string;
  category_id: string | null;
  description: string;
  price_retail: number;
  price_wholesale: number;
  wholesale_min_qty: number;
  colors: string[];
  sizes: string[];
  images: string[];
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  in_stock: boolean;
  is_active: boolean;
}
