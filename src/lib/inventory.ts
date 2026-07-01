/**
 * Inventory access layer.
 *
 * `getTires()` returns the catalog. When Supabase is configured it reads live
 * from the `tires_public` view (which excludes the wholesale cost); otherwise
 * it falls back to the bundled inventory.json so the site always builds.
 */
import type { Product, Season } from '../data/products';
import { products as fallbackProducts } from '../data/products';
import { getSupabase } from './supabase';

/** Map a DB row (snake_case) to the app's Product shape. */
function rowToProduct(r: Record<string, any>): Product {
  return {
    id: r.id,
    sku: r.sku,
    brand: r.brand,
    model: r.model,
    size: r.size,
    season: r.season as Season,
    loadIndex: r.load_index ?? '',
    speedRating: r.speed_rating ?? '',
    price: r.price,
    msrp: r.msrp,
    stock: r.stock,
    bestSeller: r.best_seller ?? undefined,
    onSale: r.on_sale ?? undefined,
    runFlat: r.run_flat ?? undefined,
    studdable: r.studdable ?? undefined,
    ev: r.ev ?? undefined,
    ply: r.ply ?? undefined,
  };
}

/** Fetch the full catalog (Supabase if configured, else inventory.json). */
export async function getTires(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackProducts;
  try {
    const { data, error } = await supabase
      .from('tires_public')
      .select('*')
      .order('price', { ascending: true });
    if (error || !data || data.length === 0) return fallbackProducts;
    return data.map(rowToProduct);
  } catch {
    return fallbackProducts;
  }
}

/** Distinct brands from a product set, sorted. */
export const brandsOf = (list: Product[]): string[] =>
  [...new Set(list.map((p) => p.brand))].sort();

/** Distinct seasons in a sensible display order. */
export const seasonsOf = (list: Product[]): Season[] => {
  const order: Season[] = ['Winter', 'All-Weather', 'All-Season', 'Summer'];
  return order.filter((s) => list.some((p) => p.season === s));
};
