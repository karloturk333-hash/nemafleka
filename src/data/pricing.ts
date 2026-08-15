// Calculator constants, ONE place. Drives the engine, the coverage copy, and the JSON-LD.
export const VRBOVEC = { lat: 45.8833, lng: 16.4167 } as const;

/** Približan radijus besplatnog dolaska (vizual na karti). Imenovane zone su izvor istine. */
export const FREE_KM = 25;

export const MIN_ORDER = 80;
export const MIN_ORDER_ZAGREB_EAST = 120;
export const SURCHARGE_BJEL_KOP = 25;
export const SURCHARGE_ZAGREB_EAST = 20;

export const LIVING_ROOM_PACKAGE = {
  id: 'package',
  name: 'Paket Dnevni boravak',
  price: 160,
  // Kutna 70 + fotelja 15 + tepih 6 m² (30) = 115. Not a discount at 160.
  wasPrice: 115,
  includes: 'Kutna garnitura + fotelja + tepih do 6 m²',
} as const;

export type TravelQuote = {
  fee: number;
  minOrder: number;
  note: string;
  known: boolean;
};

function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const FREE_NAMES = [
  'vrbovec',
  'dugo selo',
  'krizevci',
  'sveti ivan zelina',
  'sv ivan zelina',
  'ivanic grad',
  'klostar ivanic',
  'cazma',
];

const BJEL_KOP_NAMES = ['bjelovar', 'koprivnica'];

const PLUS20_NAMES = ['sesvetski kraljevec', 'sesvete', 'gornja dubrava', 'donja dubrava'];

function includesName(haystack: string, name: string): boolean {
  return (` ${haystack} `).includes(` ${name} `) || haystack.startsWith(name + ' ') || haystack.endsWith(' ' + name) || haystack === name;
}

/** Named travel zones from the cjenik. Unknown places: fee 0, confirm on WhatsApp. */
export function resolveTravel(query: string | null | undefined): TravelQuote {
  const n = fold(query ?? '');
  if (!n) {
    return { fee: 0, minOrder: MIN_ORDER, note: '', known: false };
  }
  if (PLUS20_NAMES.some((name) => includesName(n, name))) {
    return {
      fee: SURCHARGE_ZAGREB_EAST,
      minOrder: MIN_ORDER_ZAGREB_EAST,
      note: `Putni trošak +${SURCHARGE_ZAGREB_EAST} €, minimalni izlazak ${MIN_ORDER_ZAGREB_EAST} €.`,
      known: true,
    };
  }
  if (BJEL_KOP_NAMES.some((name) => includesName(n, name))) {
    return {
      fee: SURCHARGE_BJEL_KOP,
      minOrder: MIN_ORDER,
      note: `Putni trošak +${SURCHARGE_BJEL_KOP} €.`,
      known: true,
    };
  }
  if (FREE_NAMES.some((name) => includesName(n, name))) {
    return { fee: 0, minOrder: MIN_ORDER, note: 'Besplatan dolazak.', known: true };
  }
  return { fee: 0, minOrder: MIN_ORDER, note: '', known: false };
}
