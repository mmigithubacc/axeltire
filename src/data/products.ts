/**
 * Product / inventory data.
 *
 * In production this would be sourced from the live inventory system. For the
 * static marketing site it is a typed list so the shop grid and featured
 * section render real sizes, prices and stock levels.
 */

export type Product = {
  id: string;
  brand: string;
  model: string;
  name: string;
  size: string;
  season: 'Winter' | 'All-Season' | 'Summer' | 'All-Weather';
  price: number; // all-in price in CAD
  stock: number; // units on the floor
  bestSeller?: boolean;
};

/** Stock levels display as "12+" once they hit this threshold. */
export const STOCK_CAP = 12;

export const products: Product[] = [
  { id: 'hd617-225-60r17', brand: 'HAIDA', model: 'HD617', name: 'Winter HD617', size: '225/60R17', season: 'Winter', price: 114, stock: 14, bestSeller: true },
  { id: 'hd617-205-55r16', brand: 'HAIDA', model: 'HD617', name: 'Winter HD617', size: '205/55R16', season: 'Winter', price: 88, stock: 18 },
  { id: 'hd617-215-60r16', brand: 'HAIDA', model: 'HD617', name: 'Winter HD617', size: '215/60R16', season: 'Winter', price: 101, stock: 16 },
  { id: 'hd617-215-55r17', brand: 'HAIDA', model: 'HD617', name: 'Winter HD617', size: '215/55R17', season: 'Winter', price: 102, stock: 13 },
  { id: 'hd617-235-65r17', brand: 'HAIDA', model: 'HD617', name: 'Winter HD617', size: '235/65R17', season: 'Winter', price: 126, stock: 12 },
  { id: 'hd617-225-55r17', brand: 'HAIDA', model: 'HD617', name: 'Winter HD617', size: '225/55R17', season: 'Winter', price: 101, stock: 15 },
  { id: 'hd617-225-65r17', brand: 'HAIDA', model: 'HD617', name: 'Winter HD617', size: '225/65R17', season: 'Winter', price: 114, stock: 20 },
  { id: 'hd617-235-55r17', brand: 'HAIDA', model: 'HD617', name: 'Winter HD617', size: '235/55R17', season: 'Winter', price: 114, stock: 12 },
];

/** Format a unit count for display ("12+" once capped). */
export const formatStock = (n: number): string =>
  n >= STOCK_CAP ? `${STOCK_CAP}+` : String(n);
