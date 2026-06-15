import { WHATSAPP_PHONE, BUSINESS } from '../data/business';

export const waLink = (
  text = 'Bok! Zanima me dubinsko čišćenje. Možete li mi dati besplatnu procjenu?',
): string => `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;

export const telLink = (i = 0): string => `tel:${BUSINESS.phones[i]?.tel ?? ''}`;
