import { WHATSAPP_PHONE } from '../data/business';

/** Predpopunjeni tekstovi po izvoru leada (TASK-03). */
export const WA_MSG = {
  hero: 'Bok! Zanima me dubinsko čišćenje.',
  sticky: 'Bok! Pišem s vaše web stranice.',
  faq: 'Bok! Imam pitanje o dubinskom čišćenju.',
  car: 'Bok! Zanima me čišćenje interijera auta.',
  city: (grad: string) => `Bok! Pišem s vaše stranice za ${grad}.`,
} as const;

export function waLink(poruka: string = WA_MSG.sticky): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(poruka)}`;
}
