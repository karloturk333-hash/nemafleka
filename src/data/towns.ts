// Coverage data, drives the coverage hub, the map markers, optional future [town] pages,
// and the old-URL redirects. Distances/free flags are [POTVRDITI] with Karlo.
export interface Town {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number; // ~approx from Vrbovec [POTVRDITI]
  free: boolean; // besplatan dolazak? [POTVRDITI granicu]
  oldUrl?: string; // legacy city page → redirect target
  note?: string; // unique local note (anti-doorway); only if genuinely true/local
}

// Towns that had standalone city pages → must 301-redirect so they never 404.
export const TOWNS: Town[] = [
  { slug: 'dugo-selo', name: 'Dugo Selo', lat: 45.7925, lng: 16.1839, distanceKm: 20, free: true, oldUrl: '/dubinsko-ciscenje-dugo-selo' },
  { slug: 'ivanic-grad', name: 'Ivanić-Grad', lat: 45.7081, lng: 16.3922, distanceKm: 20, free: true, oldUrl: '/dubinsko-ciscenje-ivanic-grad' },
  { slug: 'krizevci', name: 'Križevci', lat: 46.0214, lng: 16.5425, distanceKm: 22, free: true, oldUrl: '/dubinsko-ciscenje-krizevci' },
  { slug: 'bjelovar', name: 'Bjelovar', lat: 45.8989, lng: 16.8484, distanceKm: 33, free: false, oldUrl: '/dubinsko-ciscenje-bjelovar' },
  { slug: 'koprivnica', name: 'Koprivnica', lat: 46.1639, lng: 16.8278, distanceKm: 42, free: false, oldUrl: '/dubinsko-ciscenje-koprivnica' },
  // map-only / mentioned in copy (no standalone page yet)
  { slug: 'sv-ivan-zelina', name: 'Sv. Ivan Zelina', lat: 45.9606, lng: 16.2447, distanceKm: 16, free: true },
  { slug: 'cazma', name: 'Čazma', lat: 45.7497, lng: 16.6167, distanceKm: 22, free: true },
  { slug: 'klostar-ivanic', name: 'Kloštar Ivanić', lat: 45.7411, lng: 16.4536, distanceKm: 18, free: true },
];

export const REDIRECT_TOWNS = TOWNS.filter((t) => t.oldUrl);
