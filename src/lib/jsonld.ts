// Structured data built from the single source of truth, WITHOUT aggregateRating
// (the business is launching; fabricated review schema was a Google manual-action + legal risk).
import { BUSINESS } from '../data/business';
import { FAQ } from '../data/faq';
import { SERVICES } from '../data/services';

const AREA_SERVED = {
  '@type': 'GeoCircle',
  geoMidpoint: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.geo.lat,
    longitude: BUSINESS.geo.lng,
  },
  geoRadius: String(BUSINESS.geoRadiusKm * 1000),
};

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
    areaServed: AREA_SERVED,
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

export function breadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Početna', item: BUSINESS.url },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Područje pokrivenosti',
        item: new URL('/podrucje-pokrivenosti/', BUSINESS.url).href,
      },
    ],
  };
}

// One Service node per offering, with real Offer prices from the single source of truth
// (src/data/services.ts). No reviews/ratings — those stay banned.
export function serviceJsonLd() {
  return SERVICES.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Dubinsko čišćenje — ${s.name}`,
    serviceType: s.name,
    provider: { '@type': 'LocalBusiness', name: BUSINESS.name, url: BUSINESS.url },
    areaServed: AREA_SERVED,
    offers: s.sizes.map((o) => ({
      '@type': 'Offer',
      name: o.label,
      price: String(o.price),
      priceCurrency: 'EUR',
    })),
  }));
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
