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
} as const;

/** Rotating messages shown in the announcement bar. */
export const announcements = [
  'Edmonton warehouse · 750 in stock',
  'Free install on 4',
  'Mon–Sat',
  'Wholesale dealers welcome',
] as const;

export const hours = [
  { day: 'Mon–Fri', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
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
