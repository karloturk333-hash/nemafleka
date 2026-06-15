// SINGLE source of truth for services + sizes + prices.
// ServiceCard, PriceCard, and the CalculatorWizard ALL read this, prices can never drift again.
// Prices ported from the original calculator; treat as [POTVRDITI] until Karlo confirms one cjenik.

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
  icon: ServiceId; // sprite id (see components/primitives/Icon.astro)
  cardLabel: string; // price-card row label
  sizeLabel: string; // size-group heading
  blurb: string;
  tag?: string;
  popular?: boolean;
  sizes: SizeOption[];
}

export const SERVICES: Service[] = [
  {
    id: 'couch', name: 'Kauč', icon: 'couch', cardLabel: 'Kauč (2-sjed)',
    sizeLabel: 'Tip kauča', popular: true, tag: 'Najtraženije',
    blurb: 'Dubinsko pranje tapeciranog namještaja. Fleke od kave, blata, djece ili ljubimaca? Sve odlazi.',
    sizes: [
      { id: '2', label: '2-sjed', price: 45 },
      { id: '3', label: '3-sjed', price: 55 },
      { id: 'l', label: 'L garnitura', price: 65 },
      { id: 'u', label: 'U garnitura', price: 95 },
    ],
  },
  {
    id: 'armchair', name: 'Fotelja', icon: 'armchair', cardLabel: 'Fotelja',
    sizeLabel: 'Količina fotelja',
    blurb: 'Fotelje kao nove, dubinski očišćene i osvježene.',
    sizes: [
      { id: '1', label: '1 kom', price: 25 },
      { id: '2', label: '2 kom', price: 50 },
      { id: '3', label: '3 kom', price: 75 },
    ],
  },
  {
    id: 'chair', name: 'Stolica', icon: 'chair', cardLabel: 'Stolica',
    sizeLabel: 'Količina stolica',
    blurb: 'Tapecirane stolice, pojedinačno ili cijeli set.',
    sizes: [
      { id: '1', label: '1 kom', price: 8 },
      { id: '2', label: '2 kom', price: 16 },
      { id: '4', label: '4 kom', price: 30 },
      { id: '6', label: '6 kom', price: 42 },
    ],
  },
  {
    id: 'ottoman', name: 'Tabure', icon: 'ottoman', cardLabel: 'Tabure',
    sizeLabel: 'Količina tabura',
    blurb: 'Taburei i podnožnici, čisti do dna.',
    sizes: [
      { id: '1', label: '1 kom', price: 15 },
      { id: '2', label: '2 kom', price: 28 },
      { id: '3', label: '3+ kom', price: 40 },
    ],
  },
  {
    id: 'carpet', name: 'Tepih', icon: 'carpet', cardLabel: 'Tepih (do 10 m²)',
    sizeLabel: 'Površina tepiha',
    blurb: 'Ekstrakcijsko čišćenje koje izvlači prljavštinu iz dubine. Suho za 2-4 sata.',
    tag: 'Suho za 2-4 h',
    sizes: [
      { id: 's', label: 'do 10 m²', price: 70 },
      { id: 'm', label: '10-20 m²', price: 105 },
      { id: 'l', label: '20+ m²', price: 150 },
    ],
  },
  {
    id: 'mattress', name: 'Madrac', icon: 'mattress', cardLabel: 'Madrac (140×200)',
    sizeLabel: 'Veličina madraca',
    blurb: 'UV + ekstrakcija uklanjaju grinje, bakterije i alergene. Sigurno za djecu i ljubimce.',
    tag: 'Sigurno za djecu',
    sizes: [
      { id: '90', label: '90×200', price: 30 },
      { id: '140', label: '140×200', price: 40 },
      { id: '160', label: '160×200', price: 50 },
      { id: '180', label: '180×200', price: 50 },
    ],
  },
  {
    id: 'car', name: 'Auto', icon: 'car', cardLabel: 'Auto (interijer)',
    sizeLabel: 'Tip auta',
    blurb: 'Dubinsko čišćenje sjedala, tepiha i prtljažnika + ručno pranje. Auto kao iz salona.',
    tag: 'Interijer + eksterijer',
    sizes: [
      { id: 's', label: 'Mali auto', price: 95 },
      { id: 'm', label: 'Srednji', price: 110 },
      { id: 'l', label: 'SUV / Kombi', price: 130 },
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
