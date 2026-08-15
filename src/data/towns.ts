// Coverage data, drives the coverage hub, the map markers, and city landing pages.
export interface Town {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  free: boolean;
  travelFee: number;
  page: boolean;
}

export const TOWNS: Town[] = [
  { slug: 'vrbovec', name: 'Vrbovec', lat: 45.8833, lng: 16.4167, distanceKm: 0, free: true, travelFee: 0, page: true },
  { slug: 'dugo-selo', name: 'Dugo Selo', lat: 45.7925, lng: 16.1839, distanceKm: 20, free: true, travelFee: 0, page: true },
  { slug: 'krizevci', name: 'Križevci', lat: 46.0214, lng: 16.5425, distanceKm: 22, free: true, travelFee: 0, page: true },
  { slug: 'sveti-ivan-zelina', name: 'Sv. Ivan Zelina', lat: 45.9606, lng: 16.2447, distanceKm: 16, free: true, travelFee: 0, page: true },
  { slug: 'ivanic-grad', name: 'Ivanić-Grad', lat: 45.7081, lng: 16.3922, distanceKm: 20, free: true, travelFee: 0, page: true },
  { slug: 'klostar-ivanic', name: 'Kloštar Ivanić', lat: 45.7411, lng: 16.4536, distanceKm: 18, free: true, travelFee: 0, page: true },
  { slug: 'cazma', name: 'Čazma', lat: 45.7497, lng: 16.6167, distanceKm: 22, free: true, travelFee: 0, page: true },
  { slug: 'bjelovar', name: 'Bjelovar', lat: 45.8989, lng: 16.8484, distanceKm: 33, free: false, travelFee: 25, page: true },
  { slug: 'koprivnica', name: 'Koprivnica', lat: 46.1639, lng: 16.8278, distanceKm: 42, free: false, travelFee: 25, page: true },
];

export const cityPath = (slug: string) => `/dubinsko-ciscenje-${slug}`;
