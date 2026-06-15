// Structured data built from the single source of truth, WITHOUT aggregateRating
// (the business is launching; fabricated review schema was a Google manual-action + legal risk).
import { BUSINESS } from '../data/business';
import { FAQ } from '../data/faq';

const DAYMAP: Record<string, string> = {
  Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday',
  Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
};

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    description:
      'Profesionalno dubinsko čišćenje kauča, tepiha, madraca i automobila u Vrbovcu i okolici.',
    url: BUSINESS.url,
    telephone: BUSINESS.phones.map((p) => p.tel),
    email: BUSINESS.email,
    image: BUSINESS.url + BUSINESS.ogImage,
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS.baseTown,
      addressCountry: 'HR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS.geo.lat,
        longitude: BUSINESS.geo.lng,
      },
      geoRadius: String(BUSINESS.geoRadiusKm * 1000),
    },
    openingHoursSpecification: BUSINESS.hours
      .filter((h) => h.opens)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.dow.map((d) => DAYMAP[d]),
        opens: h.opens,
        closes: h.closes,
      })),
    priceRange: '€€',
  };
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
