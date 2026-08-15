// Structured data built from the single source of truth, WITHOUT aggregateRating.
import { BUSINESS, PRIMARY_PHONE } from '../data/business';
import { FAQ, type FaqEntry } from '../data/faq';
import { SERVICES } from '../data/services';
import type { CityPage } from '../data/cities';

const AREA_SERVED = BUSINESS.servedCities.map((name) => ({
  '@type': 'City',
  name,
}));

const DAYMAP: Record<string, string> = {
  Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday',
  Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
};

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    description: 'Dubinsko čišćenje kauča, tepiha, madraca i automobila.',
    url: BUSINESS.url,
    telephone: PRIMARY_PHONE.tel,
    email: BUSINESS.email,
    image: BUSINESS.url + BUSINESS.logo,
    priceRange: '€€',
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
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, BUSINESS.url).href,
    })),
  };
}

export function serviceJsonLd(areaName?: string) {
  const area = areaName
    ? { '@type': 'City', name: areaName }
    : AREA_SERVED;
  return SERVICES.filter((s) => s.id !== 'package').map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Dubinsko čišćenje — ${s.name}`,
    serviceType: s.name,
    provider: { '@type': 'LocalBusiness', name: BUSINESS.name, url: BUSINESS.url },
    areaServed: area,
    offers: s.sizes.map((o) => ({
      '@type': 'Offer',
      name: o.label,
      price: String(o.price),
      priceCurrency: 'EUR',
    })),
  }));
}

export function cityServiceJsonLd(city: CityPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Dubinsko čišćenje ${city.grad}`,
    serviceType: 'Dubinsko čišćenje',
    description: `Dubinsko čišćenje kauča, tepiha, madraca i auta u ${city.locative}.`,
    provider: { '@type': 'LocalBusiness', name: BUSINESS.name, url: BUSINESS.url },
    areaServed: { '@type': 'City', name: city.name },
    url: new URL(`/dubinsko-ciscenje-${city.slug}`, BUSINESS.url).href,
  };
}

export function faqJsonLd(entries: FaqEntry[] = FAQ) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
