// Canonical business identity (NAP). ONE email, ONE set of phones — fixes the
// nemafleka.info@ vs nemafleka@ mismatch. Business is not registered yet → honest disclaimer.
export const WHATSAPP_PHONE = '385953765343';

export const BUSINESS = {
  name: 'Nema Fleka',
  tagline: 'Profesionalno dubinsko čišćenje koje vraća sjaj vašem domu.',
  url: 'https://nemafleka.com',
  email: 'nemafleka@gmail.com', // [POTVRDITI canonical]
  whatsapp: WHATSAPP_PHONE,
  baseTown: 'Vrbovec',
  geo: { lat: 45.8833, lng: 16.4167 },
  geoRadiusKm: 35,
  ogImage: '/images/hero-slide-1.webp',
  phones: [
    { name: 'Karlo', tel: '+385953765343', display: '095 376 5343' },
    { name: 'Ivan', tel: '+385916184796', display: '091 618 4796' },
  ],
  hours: [
    { days: 'Pon–Pet', time: '08:00–20:00', dow: ['Mo', 'Tu', 'We', 'Th', 'Fr'], opens: '08:00', closes: '20:00' },
    { days: 'Subota', time: '09:00–18:00', dow: ['Sa'], opens: '09:00', closes: '18:00' },
    { days: 'Nedjelja', time: 'Po dogovoru', dow: [], opens: '', closes: '' },
  ],
  // Honest legal block — obrt nije još registriran.
  legal: {
    registered: false,
    disclaimer: 'Obrt u postupku registracije', // [POTVRDITI točan status/naziv]
    legalName: null as string | null, // [POTVRDITI]
    oib: null as string | null, // [POTVRDITI]
  },
} as const;
