/**
 * Tire inventory.
 *
 * The catalog reads from `inventory.json` — a single, machine-writable data
 * file. This is deliberately the ONE place stock lives, so a back-office
 * (git CMS, spreadsheet sync, or a database export) can regenerate it without
 * touching any page or component code.
 */
import inventoryData from './inventory.json';

export type Season = 'Winter' | 'All-Weather' | 'All-Season' | 'Summer';

export type Product = {
  id: string;
  sku: string;
  brand: string;
  model: string;
  size: string;
  season: Season;
  loadIndex: string;
  speedRating: string;
  price: number; // Axel retail price (CAD)
  msrp: number; // suggested retail, used to show savings
  stock: number; // units on hand; 0 = call for availability
  bestSeller?: boolean;
  onSale?: boolean;
  runFlat?: boolean;
  studdable?: boolean;
  ev?: boolean;
  ply?: string; // e.g. "10PR" for LT tires
  /** Supplier FOB cost (USD). Build-time only — never rendered to the page. */
  fobUsd?: number;
};

export const products = inventoryData as unknown as Product[];

/** Stock levels display as "12+" once they hit this threshold. */
export const STOCK_CAP = 12;

/** Format a unit count for the "on hand" column. */
export const formatStock = (n: number): string =>
  n <= 0 ? 'Call' : n >= STOCK_CAP ? `${STOCK_CAP}+` : String(n);

/** Digits-only size code used by the search box (205/55R16 -> "2055516"). */
export const sizeCode = (size: string): string => size.replace(/\D/g, '');

/** Distinct brands, for the manufacturer filter. */
export const brandsInStock: string[] = [
  ...new Set(products.map((p) => p.brand)),
].sort();

/** Distinct seasons present in inventory, in a sensible display order. */
const SEASON_ORDER: Season[] = ['Winter', 'All-Weather', 'All-Season', 'Summer'];
export const seasonsInStock: Season[] = SEASON_ORDER.filter((s) =>
  products.some((p) => p.season === s),
);
