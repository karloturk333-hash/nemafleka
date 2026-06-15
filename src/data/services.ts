// SINGLE source of truth for services + sizes + prices.
// ServiceCard, PriceCard, and the CalculatorWizard ALL read this, prices can never drift again.
// Prices from Karlo's competitive market research (cjenik_dubinsko_ciscenje, 2026-06-15):
// positioned between the lower (Pro-plus) and higher (Sjajni tim) operators in the region.

export interface SizeOption {
  id: string;
  label: string;
  price: number; // EUR
}

export type ServiceId =
  | 'couch' | 'armchair' | 'chair' | 'ottoman' | 'carpet' | 'mattress' | 'car';

export interface Service {
  id: ServiceId;
  name: string;
  icon: ServiceId;
  cardLabel: string; // price-card row label
  sizeLabel: string; // size-group heading
  blurb: string;
  tag?: string;
  popular?: boolean;
  sizes: SizeOption[];
}

export const SERVICES: Service[] = [
  {
    id: 'couch', name: 'Kauč', icon: 'couch', cardLabel: 'Kauč / garnitura',
    sizeLabel: 'Tip garniture', popular: true, tag: 'Najtraženije',
    blurb: 'Dubinsko pranje tapeciranog namještaja. Fleke od kave, blata, djece ili ljubimaca? Sve odlazi.',
    sizes: [
      { id: 'dvosjed', label: 'Dvosjed', price: 40 },
      { id: 'trosjed', label: 'Trosjed / kauč', price: 45 },
      { id: 'kutna', label: 'Kutna garnitura', price: 60 },
      { id: 'velika', label: 'Velika kutna', price: 80 },
      { id: 'u', label: 'U garnitura', price: 85 },
    ],
  },
  {
    id: 'armchair', name: 'Fotelja', icon: 'armchair', cardLabel: 'Fotelja',
    sizeLabel: 'Količina fotelja',
    blurb: 'Fotelje kao nove, dubinski očišćene i osvježene.',
    sizes: [
      { id: '1', label: '1 kom', price: 22 },
      { id: '2', label: '2 kom', price: 44 },
      { id: '3', label: '3 kom', price: 66 },
    ],
  },
  {
    id: 'chair', name: 'Stolica', icon: 'chair', cardLabel: 'Stolice',
    sizeLabel: 'Količina stolica',
    blurb: 'Tapecirane stolice, sjedalo i naslon kao novi.',
    sizes: [
      { id: '2', label: '2 kom', price: 12 },
      { id: '4', label: '4 kom', price: 24 },
      { id: '6', label: '6 kom', price: 36 },
    ],
  },
  {
    id: 'ottoman', name: 'Tabure', icon: 'ottoman', cardLabel: 'Tabure',
    sizeLabel: 'Veličina taburea',
    blurb: 'Taburei, podnožnici i lazy bag, čisti do dna.',
    sizes: [
      { id: 'mali', label: 'Mali', price: 10 },
      { id: 'veliki', label: 'Veliki', price: 20 },
      { id: 'lazybag', label: 'Lazy bag', price: 20 },
    ],
  },
  {
    id: 'carpet', name: 'Tepih', icon: 'carpet', cardLabel: 'Tepih',
    sizeLabel: 'Površina tepiha',
    blurb: 'Ekstrakcijsko čišćenje koje izvlači prljavštinu iz dubine. Suho za 2-4 sata.',
    tag: 'Suho za 2-4 h',
    sizes: [
      { id: 's', label: 'do 10 m²', price: 55 },
      { id: 'm', label: '10-20 m²', price: 85 },
      { id: 'l', label: '20+ m²', price: 130 },
    ],
  },
  {
    id: 'mattress', name: 'Madrac', icon: 'mattress', cardLabel: 'Madrac',
    sizeLabel: 'Veličina madraca',
    blurb: 'UV + ekstrakcija uklanjaju grinje, bakterije i alergene. Sigurno za djecu i ljubimce.',
    tag: 'Sigurno za djecu',
    sizes: [
      { id: 'djecji', label: 'Dječji', price: 18 },
      { id: '90', label: 'Jednoosobni (90)', price: 25 },
      { id: '140', label: 'Francuski (140)', price: 35 },
      { id: 'bracni', label: 'Bračni (160+)', price: 40 },
    ],
  },
  {
    id: 'car', name: 'Auto', icon: 'car', cardLabel: 'Auto (interijer)',
    sizeLabel: 'Opseg čišćenja',
    blurb: 'Dubinsko čišćenje sjedala, podnica i prtljažnika. Auto kao iz salona.',
    tag: 'Interijer',
    sizes: [
      { id: 'sjedala', label: 'Osobni - sjedala', price: 70 },
      { id: 'komplet', label: 'Osobni - komplet', price: 100 },
      { id: 'suv', label: 'SUV / kombi - komplet', price: 120 },
    ],
  },
];

/** Lowest price for a service, used for "od X€" labels everywhere. */
export const fromOf = (s: Service): number => Math.min(...s.sizes.map((o) => o.price));

export const getService = (id: ServiceId): Service =>
  SERVICES.find((s) => s.id === id)!;

// Decorative emoji (aria-hidden in UI; the heading carries the meaning).
export const SERVICE_EMOJI: Record<ServiceId, string> = {
  couch: '🛋️', armchair: '💺', chair: '🪑', ottoman: '🟫',
  carpet: '🧹', mattress: '🛏️', car: '🚗',
};
