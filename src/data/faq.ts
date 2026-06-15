// FAQ entries, drive both the FaqList UI and the FAQPage JSON-LD. Honest, no fake promises.
export interface FaqEntry {
  q: string;
  a: string;
}

export const FAQ: FaqEntry[] = [
  {
    q: 'Koliko traje dubinsko čišćenje?',
    a: 'Ovisi o veličini i prljavštini: kauč 45-90 min, tepih 30-60 min po m², auto 60-120 min, madrac 45-75 min. Točnu procjenu dajemo pri dogovoru, bez iznenađenja.',
  },
  {
    q: 'Dolazite li na kućnu adresu?',
    a: 'Da, dolazimo k vama, ne morate ništa voziti ni nositi. Pokrivamo Vrbovec i okolicu (Dugo Selo, Križevci, Bjelovar, Koprivnica…). Treba nam samo termin i pristup prostoriji.',
  },
  {
    q: 'Jesu li sredstva sigurna za djecu i ljubimce?',
    a: 'Da. Koristimo ekološka sredstva sigurna za djecu, ljubimce i alergičare. Bez agresivnih kemikalija i jakih mirisa.',
  },
  {
    q: 'Kad mogu koristiti kauč/tepih/auto nakon čišćenja?',
    a: 'Sušenje traje 2-6 sati, ovisno o ventilaciji i veličini. Auto se obično osuši za 1-3 sata. Ljeti sve ide brže. Preporučujemo prozračivanje prostorije.',
  },
  {
    q: 'Što ako fleka ne izađe u potpunosti?',
    a: 'Vrijedi naša garancija zadovoljstva: ako niste zadovoljni, dolazimo ponovno besplatno ili vraćamo novac. Bez sitnih slova.',
  },
  {
    q: 'Kako rezervirati termin?',
    a: 'Najbrže preko WhatsAppa, javljamo se u roku 30 minuta (u radno vrijeme). Možete i nazvati direktno.',
  },
  {
    q: 'Tek ste počeli, zašto da vas odaberem?',
    a: 'Da, novi smo i ponosni na to. Zato dajemo punu garanciju, poštenu cijenu i uvodni popust prvim klijentima, jer želimo da nas preporučite. Manje klijenata znači više pažnje za vaš.',
  },
];
