// Canonical business identity (NAP). ONE email, ONE primary phone in schema.
export const WHATSAPP_PHONE = '385953765343';

export const BUSINESS = {
  name: 'Nema Fleka',
  tagline: 'Profesionalno dubinsko čišćenje koje vraća sjaj vašem domu.',
  url: 'https://nemafleka.com',
  email: 'hello@nemafleka.com', // [POTVRDITI] mailbox / forward s gmaila
  whatsapp: WHATSAPP_PHONE,
  baseTown: 'Vrbovec',
  geo: { lat: 45.8833, lng: 16.4167 },
  geoRadiusKm: 35,
  ogImage: '/images/og-image.webp',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  logo: '/images/logo.webp',
  phones: [
    { name: 'Karlo', tel: '+385953765343', display: '095 376 5343', primary: true },
    { name: 'Ivan', tel: '+385916184796', display: '091 618 4796', primary: false },
  ],
  hours: [
    { days: 'Pon-Pet', time: '08:00-20:00', dow: ['Mo', 'Tu', 'We', 'Th', 'Fr'], opens: '08:00', closes: '20:00' },
    { days: 'Subota', time: '09:00-18:00', dow: ['Sa'], opens: '09:00', closes: '18:00' },
    { days: 'Nedjelja', time: 'Po dogovoru', dow: [], opens: '', closes: '' },
  ],
  servedCities: [
    'Vrbovec', 'Dugo Selo', 'Križevci', 'Sveti Ivan Zelina',
    'Ivanić-Grad', 'Kloštar Ivanić', 'Čazma', 'Bjelovar', 'Koprivnica',
  ] as const,
  // Empty until Google Business Profile is live (TASK-05 / TASK-13).
  googleBusinessUrl: (import.meta.env.PUBLIC_GOOGLE_BUSINESS_URL as string | undefined) || '',
  legal: {
    registered: false,
    disclaimer: 'Lokalni obrt u osnivanju — radimo transparentno, cijena dogovorena unaprijed; račun izdajemo po registraciji', // [POTVRDITI točan status/naziv]
    legalName: null as string | null,
    oib: null as string | null,
  },
} as const;

export const PRIMARY_PHONE = BUSINESS.phones[0];
