// SINGLE source of truth for services + sizes + prices.
// ServiceCard and PriceCard ALL read this.

export interface SizeOption {
  id: string;
  label: string;
  price: number; // EUR
}

export type ServiceId =
  | 'couch' | 'armchair' | 'chair' | 'ottoman' | 'carpet' | 'mattress' | 'car' | 'package';

export interface Service {
  id: ServiceId;
  name: string;
  icon: ServiceId;
  cardLabel: string;
  sizeLabel: string;
  blurb: string;
  tag?: string;
  popular?: boolean;
  /** Cannot be booked as the only service (stolica, tabure). */
  addonOnly?: boolean;
  /** Hide from the "Što sve čistimo" grid (package lives in the cjenik). */
  featured?: boolean;
  pickerPrice: string;
  sizes: SizeOption[];
}

export const CARPET_PER_M2 = 10;
export const CARPET_MINIMUM = 50;

export const SERVICES: Service[] = [
  {
    id: 'couch', name: 'Kauč', icon: 'couch', cardLabel: 'Kauč / garnitura',
    sizeLabel: 'Tip garniture', popular: true, tag: 'Najtraženije', featured: true,
    pickerPrice: '55 / 70 / 90 €',
    blurb: 'Dubinsko pranje tapeciranog namještaja. Fleke od kave, blata, djece ili ljubimaca? Sve odlazi.',
    sizes: [
      { id: 'dvosjed', label: 'Dvosjed', price: 55 },
      { id: 'trosjed', label: 'Trosjed', price: 70 },
      { id: 'kutna', label: 'Kutna garnitura', price: 90 },
    ],
  },
  {
    id: 'armchair', name: 'Fotelja', icon: 'armchair', cardLabel: 'Fotelja',
    sizeLabel: 'Količina fotelja', featured: false,
    pickerPrice: '30 €',
    blurb: 'Fotelje kao nove, dubinski očišćene i osvježene.',
    sizes: [
      { id: '1', label: '1 fotelja', price: 30 },
      { id: '2', label: '2 fotelje', price: 60 },
      { id: '3', label: '3 fotelje', price: 90 },
    ],
  },
  {
    id: 'chair', name: 'Stolica', icon: 'chair', cardLabel: 'Stolica',
    sizeLabel: 'Količina stolica', addonOnly: true, featured: false,
    pickerPrice: '15 €',
    blurb: 'Tapecirane stolice, sjedalo i naslon kao novi. Samo uz drugu uslugu.',
    sizes: [
      { id: '1', label: '1 stolica', price: 15 },
      { id: '2', label: '2 stolice', price: 30 },
      { id: '4', label: '4 stolice', price: 60 },
      { id: '6', label: '6 stolica', price: 90 },
    ],
  },
  {
    id: 'ottoman', name: 'Tabure', icon: 'ottoman', cardLabel: 'Tabure',
    sizeLabel: 'Količina taburea', addonOnly: true, featured: false,
    pickerPrice: '15 €',
    blurb: 'Taburei i podnožnici, čisti do dna. Samo uz drugu uslugu.',
    sizes: [
      { id: '1', label: '1 tabure', price: 15 },
      { id: '2', label: '2 taburea', price: 30 },
    ],
  },
  {
    id: 'carpet', name: 'Tepih', icon: 'carpet', cardLabel: 'Tepih',
    sizeLabel: 'Površina tepiha', featured: true,
    pickerPrice: '10 €/m²',
    blurb: 'Ekstrakcijsko čišćenje koje izvlači prljavštinu iz dubine. Suho za 2-4 sata.',
    tag: 'Suho za 2-4 h',
    sizes: [
      { id: '5', label: 'Tepih 5 m²', price: 50 },
      { id: '6', label: 'Tepih do 6 m²', price: 60 },
      { id: '8', label: 'Tepih 8 m²', price: 80 },
      { id: '10', label: 'Tepih 10 m²', price: 100 },
      { id: '12', label: 'Tepih 12 m²', price: 120 },
      { id: '15', label: 'Tepih 15 m²', price: 150 },
    ],
  },
  {
    id: 'mattress', name: 'Madrac', icon: 'mattress', cardLabel: 'Madrac',
    sizeLabel: 'Veličina madraca', featured: true,
    pickerPrice: '35 / 50 €',
    blurb: 'UV + ekstrakcija uklanjaju grinje, bakterije i alergene. Sigurno za djecu i ljubimce.',
    tag: 'Sigurno za djecu',
    sizes: [
      { id: 'jednokrevetni', label: 'Madrac jednokrevetni', price: 35 },
      { id: 'bracni', label: 'Madrac bračni', price: 50 },
    ],
  },
  {
    id: 'car', name: 'Auto', icon: 'car', cardLabel: 'Auto (interijer)',
    sizeLabel: 'Veličina vozila', featured: true,
    pickerPrice: '85 / 115 / 135 €',
    blurb: 'Dubinsko čišćenje sjedala, podnica i prtljažnika. Auto kao iz salona.',
    tag: 'Interijer',
    sizes: [
      { id: 'mali', label: 'Mali auto', price: 85 },
      { id: 'limuzina', label: 'Limuzina / karavan', price: 115 },
      { id: 'suv', label: 'SUV / kombi', price: 135 },
    ],
  },
  {
    id: 'package', name: 'Dnevni boravak', icon: 'package', cardLabel: 'Paket Dnevni boravak',
    sizeLabel: 'Sadržaj paketa', popular: true, tag: 'Ušteda 30 €', featured: false,
    pickerPrice: '150 €',
    blurb: 'Kutna garnitura + fotelja + tepih do 6 m². Zasebno 180 €, u paketu 150 €.',
    sizes: [
      { id: 'dnevni', label: 'Kutna garnitura + fotelja + tepih do 6 m²', price: 150 },
    ],
  },
];

export const ADDON_ONLY_IDS: ReadonlySet<ServiceId> = new Set(['chair', 'ottoman']);

export const fromOf = (s: Service): number => Math.min(...s.sizes.map((o) => o.price));

export const SERVICE_EMOJI: Record<ServiceId, string> = {
  couch: '🛋️', armchair: '💺', chair: '🪑', ottoman: '🟫',
  carpet: '🧹', mattress: '🛏️', car: '🚗', package: '🏠',
};

export interface PriceRow {
  name: string;
  price: string;
  featured?: boolean;
  note?: string;
  was?: string;
}

export interface PriceGroup {
  title: string;
  rows: PriceRow[];
}

/** Itemized cjenik (no "od X €"). */
export const PRICE_GROUPS: PriceGroup[] = [
  {
    title: 'Tapecirano',
    rows: [
      { name: 'Dvosjed', price: '55 €' },
      { name: 'Trosjed', price: '70 €' },
      { name: 'Kutna garnitura', price: '90 €', featured: true },
      { name: 'Fotelja', price: '30 €' },
      { name: 'Stolica', price: '15 €', note: 'samo uz drugu uslugu' },
      { name: 'Tabure', price: '15 €', note: 'samo uz drugu uslugu' },
    ],
  },
  {
    title: 'Madrac',
    rows: [
      { name: 'Madrac jednokrevetni', price: '35 €' },
      { name: 'Madrac bračni', price: '50 €' },
    ],
  },
  {
    title: 'Tepih',
    rows: [
      { name: 'Tepih', price: '10 €/m²', note: 'minimum 50 €' },
    ],
  },
  {
    title: 'Auto',
    rows: [
      { name: 'Mali auto', price: '85 €' },
      { name: 'Limuzina / karavan', price: '115 €' },
      { name: 'SUV / kombi', price: '135 €' },
    ],
  },
];
