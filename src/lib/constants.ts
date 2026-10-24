// ─────────────────────────────────────────────────────────────────────────────
// Design tokens & app-wide constants for The Vinyl Crate
// ─────────────────────────────────────────────────────────────────────────────

/** App metadata */
export const APP_NAME = 'The Vinyl Crate' as const;
export const APP_DESCRIPTION =
  'Curated band merchandise for true collectors — import & in-house tees.' as const;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

// ── Colour palette (matches @theme in globals.css) ───────────────────────────

export const COLORS = {
  /** Main dark background */
  charcoal: '#121212',
  /** Slightly lighter surface */
  charcoalLight: '#1A1A1A',
  /** Warm vintage text / surface */
  vintagePaper: '#F4EBD9',
  /** Primary accent (amber) */
  amber: '#D97706',
  /** Darker amber for hover / active states */
  amberDark: '#B45309',
  /** Muted cream for borders / subtle UI */
  creamBorder: '#D5CBB2',
  /** Muted body text on dark bg */
  mutedText: '#A8A29E',
} as const;

// ── Typography (loaded via next/font in layout.tsx) ──────────────────────────

export const FONTS = {
  heading: 'Playfair Display',
  body: 'Inter',
} as const;

// ── Product helpers ──────────────────────────────────────────────────────────

export const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const ORIGIN_LABELS: Record<string, string> = {
  IMPORT: 'Import',
  IN_HOUSE: 'In-House',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pending Payment',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  CANCELLED: 'Cancelled',
} as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: 'text-yellow-500',
  PAID: 'text-green-500',
  PROCESSING: 'text-blue-500',
  SHIPPED: 'text-emerald-500',
  CANCELLED: 'text-red-500',
} as const;

// ── Pricing / formatting ─────────────────────────────────────────────────────

/** Format a bigint price (stored in the DB as whole IDR) to display string. */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// ── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12;

// ── Image placeholders ──────────────────────────────────────────────────────

export const PLACEHOLDER_PRODUCT_IMAGE = '/images/placeholder-tee.png';
export const PLACEHOLDER_AVATAR = '/images/placeholder-avatar.png';
