import { WHATSAPP_PHONE } from '../data/business';

export const waLink = (
  text = 'Bok! Zanima me dubinsko čišćenje. Možete li mi dati besplatnu procjenu?',
): string => `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
