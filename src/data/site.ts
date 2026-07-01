/**
 * Central content file for the Axel Tires website.
 *
 * All business copy lives here so the site can be updated without touching
 * layout/component code.
 */

export const site = {
  name: 'Axel Tires',
  tagline: 'Honest tires. No upsells.',
  description:
    'Wholesale and retail tires in Edmonton. The price you see covers tire, install, balance and disposal — that’s it.',
  url: 'https://www.axeltire.ca',
  email: 'hello@axeltire.ca',
  currency: 'CAD',
  locale: 'EN',
  established: 2026,
  city: 'Edmonton',
  province: 'AB',
  country: 'Canada',
  stockCount: 750,
  // Approximate city-level geo for structured data (exact address TBC).
  geo: { lat: 53.5461, lng: -113.4938 },
} as const;

/** Tire delivery offer — min. 2-tire order, anywhere in Edmonton. */
export const delivery = {
  minTires: 2,
  area: 'Edmonton',
  short: 'Tire delivery in Edmonton — 2-tire minimum',
  blurb:
    'Order 2 or more tires and we’ll deliver to any address in Edmonton. Same all-in pricing, brought to your door.',
} as const;

/** Rotating messages shown in the announcement bar. */
export const announcements = [
  '750 tires in stock — Edmonton',
  'Delivery in Edmonton · 2-tire minimum',
  'Free install on 4',
  'Wholesale dealers welcome',
] as const;

export const hours = [
  { day: 'Mon–Fri', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
] as const;

/** Machine-readable hours for schema.org openingHoursSpecification. */
export const openingHoursSchema = [
  {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00',
  },
  { days: ['Saturday'], opens: '09:00', closes: '16:00' },
] as const;

/** Cities/areas served — used in LocalBusiness schema + local SEO copy. */
export const areaServed = [
  'Edmonton',
  'Sherwood Park',
  'St. Albert',
  'Leduc',
  'Spruce Grove',
  'Nisku',
  'Beaumont',
] as const;

/** Primary navigation. */
export const nav = [
  { label: 'Shop tires', href: '/shop' },
  { label: 'Book install', href: '/book' },
  { label: 'Dealers', href: '/dealers' },
] as const;

/** The four Axel promise value props. */
export const valueProps = [
  {
    title: 'All-in pricing',
    body:
      'Tire + install + balance + disposal in one number. No add-ons at the counter, no inspection upcharges.',
    icon: 'tag',
  },
  {
    title: 'Real-time inventory',
    body:
      'What you see is what is on our floor. Updated the moment a tire moves.',
    icon: 'gauge',
  },
  {
    title: 'Wholesale + retail',
    body:
      'Same shop, both sides. Dealers get tier pricing automatically — apply once, paid via Stripe at order.',
    icon: 'building',
  },
  {
    title: 'Edmonton-built',
    body:
      'Owner-operated. Family-run. We answer the phone. We are the people putting tires on your car.',
    icon: 'pin',
  },
] as const;

/** Brand marquee (in stock or available to order). */
export const brands = [
  'HAIDA',
  'MILEKING',
  'MICHELIN',
  'BRIDGESTONE',
  'GOODYEAR',
  'CONTINENTAL',
  'PIRELLI',
  'FALKEN',
] as const;

/** Dealer program highlights. */
export const dealerStats = [
  { value: 'Tier 1–3', label: 'Volume pricing' },
  { value: '<24h', label: 'Approval' },
  { value: '$0', label: 'Membership fee' },
  { value: 'COD', label: 'Stripe at order' },
] as const;

/** Footer link columns. */
export const footerLinks = {
  Shop: [
    { label: 'Tires', href: '/shop' },
    { label: 'Book install', href: '/book' },
    { label: 'Wheels (soon)', href: '#' },
    { label: 'Dealers', href: '/dealers' },
  ],
  Service: [
    { label: 'Track an order', href: '#' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Warranty', href: '/faq#warranty' },
    { label: 'Contact', href: '/contact' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Press', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
} as const;
