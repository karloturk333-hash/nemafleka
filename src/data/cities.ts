import { TOWNS, cityPath, type Town } from './towns';
import type { FaqEntry } from './faq';

export interface CityPage {
  slug: string;
  town: Town;
  name: string;
  /** H1 / title: Dubinsko čišćenje {GRAD} */
  grad: string;
  /** locative: u Križevcima */
  locative: string;
  /** accusative of motion: u Križevce */
  accusative: string;
  intro: string;
  body: string[];
  howTitle: string;
  howLead: string;
  steps: { t: string; d: string }[];
  faq: FaqEntry[];
  related: string[];
  baDefault: 'couch' | 'mattress';
}

const bySlug = Object.fromEntries(TOWNS.map((t) => [t.slug, t]));

function town(slug: string): Town {
  const t = bySlug[slug];
  if (!t) throw new Error(`Unknown town ${slug}`);
  return t;
}

export const CITY_PAGES: CityPage[] = [
  {
    slug: 'vrbovec',
    town: town('vrbovec'),
    name: 'Vrbovec',
    grad: 'Vrbovec',
    locative: 'Vrbovcu',
    accusative: 'Vrbovec',
    intro:
      'Vrbovec nam je baza, ne usputna stanica. Kauč u centru, tepih u Gornjem Tkalcu ili madrac prema Lonji — dolazimo na adresu, bez putnog troška. Nismo ekipa iz Zagreba koja "može svratiti kad bude u blizini"; ovdje živimo i radimo.',
    body: [
      'Od Vrbovca do Gradeca, Rakovca, Preseke i Farkaševca vožnja je kratka. Zato možemo ponuditi termine isti ili idući dan, a ne tjedne čekanja. Ako ste u općini Dubrava pored Vrbovca (ne zagrebačkoj Dubravi), to je ista zona: dolazak je besplatan.',
      'Radimo ekstrakcijskim strojem, ne usisavačem. Kauč, tepih, madrac i interijer auta čistimo kod vas. Cijenu vidite na cjeniku i u kalkulatoru prije nego što nam pišete. Minimalni izlazak je 80 €, što u praksi znači da se isplati spojiti više stavki ili uzeti paket Dnevni boravak.',
      'Susjedi iz Dugog Sela i Križevaca nas često zovu isti dan kad i Vrbovčani. Ako ste na rubu grada, prema Žabnici ili Kućancu, i dalje smo u besplatnoj zoni. Pišite na WhatsApp, javimo se u 30 minuta u radno vrijeme.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Vrbovec',
    howLead: 'Baza je ovdje, pa nema "usput kad budemo u Zagrebu". Dogovorimo sat, parkiramo pred vratima, donesemo stroj.',
    steps: [
      { t: 'Pišete nam', d: 'Kratka poruka: što treba (kauč, tepih, madrac, auto) i adresa u Vrbovcu ili okolici. Odmah kažemo cijenu.' },
      { t: 'Dogovorimo sat', d: 'Ujutro, popodne ili subotom. U Vrbovcu često stignemo isti ili idući dan.' },
      { t: 'Očistimo na licu mjesta', d: 'Vi nam otvorite vrata. Mi donesemo ekstraktor, očistimo, pospremimo za sobom. Plaćate kad ste zadovoljni.' },
    ],
    faq: [
      { q: 'Dolazite li i u sela oko Vrbovca, Gradec i Rakovec?', a: 'Da. Gradec, Rakovec, Preseka, Farkaševac i općina Dubrava uz Vrbovec su u našoj besplatnoj zoni. Napišite naselje u poruci.' },
      { q: 'Koliko brzo možete doći u Vrbovec?', a: 'Često isti ili idući radni dan. Nismo vezani za rutu iz Zagreba, pa nam je lakše ugurati i hitan termin.' },
      { q: 'Treba li spremati namještaj prije dolaska?', a: 'Maknite sitnice s kauča i tepiha. Teške komade ne diramo. Treba nam struja i malo prostora za crijevo stroja.' },
    ],
    related: ['dugo-selo', 'krizevci', 'sveti-ivan-zelina'],
    baDefault: 'couch',
  },
  {
    slug: 'dugo-selo',
    town: town('dugo-selo'),
    name: 'Dugo Selo',
    grad: 'Dugo Selo',
    locative: 'Dugom Selu',
    accusative: 'Dugo Selo',
    intro:
      'Dugo Selo je dvadesetak kilometara zapadno od Vrbovca, uz željeznički koridor prema Zagrebu. Dolazak je besplatan. Kauče i tepihe čistimo u stanu, kući ili poslovnom prostoru, bez da vi bilo što vozite.',
    body: [
      'Iz Vrbovca do Dugog Sela stignemo za pola sata. Pokrivamo i okolna naselja: Andrilovec, Martin Breg, Puhovo, Oborovo Bistransko. Ako ste bliže Sesvetama nego centru Dugog Sela, napišite točno naselje — za Sesvete i Sesvetski Kraljevec imamo zaseban putni trošak, a Dugo Selo ostaje besplatno.',
      'Mnogi iz Dugog Sela prvo guglaju zagrebačke ekipe. Problem je čekanje i cijena dolaska iz grada. Mi smo s druge strane, iz zaleđa, pa nam je Dugo Selo prirodna ruta, ne izlet. Cijenu znate unaprijed: dvosjed 30 €, trosjed 50 €, kutna 70–90 €, tepih 5 €/m².',
      'Ako imate kutnu garnituru, fotelju i tepih u dnevnom boravku, paket Dnevni boravak je 160 €. Minimalni izlazak 80 €. Pišite s adrese u Dugom Selu, javimo se brzo.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Dugo Selo',
    howLead: 'Najavljujemo dolazak, parkiramo, donesemo stroj u stan ili kuću. Nema vožnje tepiha u perionicu.',
    steps: [
      { t: 'Pošaljete WhatsApp', d: 'Napišite Dugo Selo i što treba. Ako znate kvadraturu tepiha, još bolje — cijena je 5 €/m².' },
      { t: 'Birate termin', d: 'Radnim danom 8–20 ili subotom. U Dugom Selu se često vežemo uz poslove u Vrbovcu istog dana.' },
      { t: 'Čistimo kod vas', d: 'Ekstrakcija, ne kemijsko pranje na suho. Kauč i tepih su obično suhi za 2–4 sata uz prozračivanje.' },
    ],
    faq: [
      { q: 'Dolazite li i u Andrilovec, Martin Breg i Oborovo?', a: 'Da, to je ista zona kao Dugo Selo, dolazak je besplatan. Napišite naselje da pogodimo vožnju.' },
      { q: 'Radite li i u stanovima blizu kolodvora?', a: 'Da. Trebamo lift ili nosive staze za crijevo, i dogovor s kućnim redom ako zgrada ima. To rješavamo u poruci.' },
      { q: 'Je li Dugo Selo stvarno bez putnog troška?', a: 'Da. Dugo Selo, Ivanić-Grad i Vrbovec su u besplatnoj zoni. Sesvete nisu — tamo je +20 € i minimum 120 €.' },
    ],
    related: ['vrbovec', 'sveti-ivan-zelina', 'ivanic-grad'],
    baDefault: 'mattress',
  },
  {
    slug: 'krizevci',
    town: town('krizevci'),
    name: 'Križevci',
    grad: 'Križevci',
    locative: 'Križevcima',
    accusative: 'Križevce',
    intro:
      'Križevci su nešto više od 20 km sjeverno od Vrbovca, uz cestu prema Kalniku. Dolazak je besplatan. Čistimo kauče, tepihe, madrace i auta na vašoj adresi u gradu i okolnim selima.',
    body: [
      'Vožnja iz Vrbovca do Križevaca je kratka, pa nam je logično stati i u Carevdaru, Svetom Petru Čvrstecu ili prema Gornjoj Rijeci ako se to veže uz isti dan. Kalnik je malo dalje — napišite točno mjesto, pa kažemo je li još u besplatnoj zoni ili treba uskladiti s drugim poslom.',
      'Križevci imaju i stare kuće s debelim tepisima i novije stanove s kutnim garniturama. I jedni i drugi se čiste istim ekstraktorom; razlika je samo u vremenu sušenja. Cijene su iste kao u Vrbovcu: nema "križevačkog dodatka". Kutna garnitura 70–90 €, bračni madrac 60 €, mali auto 90 €.',
      'Ako trebate i tepih u dnevnom, spojite s kaučem. Paket Dnevni boravak je 160 €. Minimalni izlazak 80 €, zato stolice i tabure ne uzimamo kao jedinu stavku. Pišite nam s Križevaca, u poruci već piše odakle ste.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Križevce',
    howLead: 'Najava, dolazak na adresu, čišćenje, odlazak. Bez ostavljanja namještaja u radionici.',
    steps: [
      { t: 'Pošaljete poruku', d: 'Što čistimo i u kojem dijelu Križevaca (centar, Kalnik cesta, okolno selo). Odmah dobijete cijenu.' },
      { t: 'Uskladimo dan', d: 'Ako već idemo prema Bjelovaru ili Koprivnici, možemo naredati poslove. Ako ste sami, i dalje dolazimo — dolazak je besplatan.' },
      { t: 'Radimo kod vas', d: 'Stroj ostaje u kombiju dok crijevo ide unutra. Pod zaštitimo. Vi ne trebate dizati kauč osim ako želite i stražnju stranu.' },
    ],
    faq: [
      { q: 'Dolazite li i u okolna sela oko Križevaca?', a: 'Da. Carevdar, Sveti Petar Čvrstec i sela uz cestu prema Vrbovcu su u našoj zoni, dolazak je besplatan. Kalnik i dalja sela napišite pa potvrdimo.' },
      { q: 'Možete li očistiti auto ispred zgrade u Križevcima?', a: 'Da, treba parking i struja (produžni kabel nosimo). Zimi radimo i u garaži ako stane stroj.' },
      { q: 'Imate li termin vikendom?', a: 'Subota 9–18. Nedjelja po dogovoru. U Križevcima subota često odgovara ljudima koji rade u Zagrebu tjednom.' },
    ],
    related: ['vrbovec', 'koprivnica', 'bjelovar'],
    baDefault: 'mattress',
  },
  {
    slug: 'sveti-ivan-zelina',
    town: town('sveti-ivan-zelina'),
    name: 'Sv. Ivan Zelina',
    grad: 'Sv. Ivan Zelina',
    locative: 'Svetom Ivanu Zelini',
    accusative: 'Sveti Ivan Zelinu',
    intro:
      'Sveti Ivan Zelina je u prigorju, oko 16 km od Vrbovca, na pola puta prema Zagrebu ali još uvijek naša strana brda. Dolazak je besplatan. Kauče i tepihe čistimo u gradu, Donjoj Zelini i okolnim zaselcima.',
    body: [
      'Zelinsko prigorje znači kuće na nagibu, vino u podrumu i dnevni boravak s kutnom garniturom koja vidi vrt. Stroj nosimo stepenicama; recite unaprijed ako je uspon oštar ili nema prilaza kombiju. To nije problem, samo da znamo.',
      'Zelina je bliža Zagrebu nego Bjelovaru, pa ljudi često zovu zagrebačke ekipe. Nama je Zelina susjed, ne izlet: 16 km, besplatan dolazak, ista cijena kao u Vrbovcu. Tepih 5 €/m², jednokrevetni madrac 40 €, bračni 60 €.',
      'Ako ste u Bizeku, Donjoj Zelini ili prema Svetoj Heleni, i dalje ciljamo istu vožnju. Sesvete su druga priča (+20 €, min. 120 €). Zelina ostaje u besplatnoj zoni. Pišite nam, u poruci će pisati da dolazite sa stranice za Sveti Ivan Zelinu.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Sveti Ivan Zelinu',
    howLead: 'Najavimo se, nađemo prilaz, donesemo ekstraktor. U prigorju to ponekad znači uske ceste i strme dvorišta — planiramo to unaprijed.',
    steps: [
      { t: 'Pišete što i gdje', d: 'Kutna, tepih, madrac ili auto, plus naselje (Zelina, Donja Zelina, Bizek). Cijena odmah.' },
      { t: 'Dogovorimo prilaz', d: 'Ako kombij ne može do kuće, ostavimo ga dolje i nosimo opremu. To nam recite u poruci.' },
      { t: 'Čistimo i odlazimo', d: 'Rad traje od 45 minuta za fotelju do par sati za veliki dnevni. Sušenje 2–4 sata uz otvoren prozor.' },
    ],
    faq: [
      { q: 'Dolazite li i u Donju Zelinu i Bizek?', a: 'Da, to je ista besplatna zona kao Sveti Ivan Zelina. Napišite zaselak ako GPS zbuni dostavljače — nama je dovoljno ime naselja i ulica.' },
      { q: 'Možete li do kuće na brdu bez asfalta?', a: 'Obično da. Ako je prilaz mokar i strm, ostavimo kombi na čvrstom i nosimo crijevo. Bolje je reći unaprijed nego da se okrenemo.' },
      { q: 'Čistite li i vinske spavaće s madracem u podrumskoj etaži?', a: 'Da, madrac jednokrevetni 40 €, bračni 60 €. Treba prozračivanje; podrumi se suše sporije, to kažemo na licu mjesta.' },
    ],
    related: ['dugo-selo', 'vrbovec', 'krizevci'],
    baDefault: 'couch',
  },
  {
    slug: 'ivanic-grad',
    town: town('ivanic-grad'),
    name: 'Ivanić-Grad',
    grad: 'Ivanić-Grad',
    locative: 'Ivanić-Gradu',
    accusative: 'Ivanić-Grad',
    intro:
      'Ivanić-Grad je oko 20 km južno od Vrbovca, prema Posavini. Dolazak je besplatan. Čistimo tapecirani namještaj, tepihe, madrace i interijere auta u gradu, Deanovcu i susjednom Kloštru Ivaniću.',
    body: [
      'Ivanić i Kloštar su nam ista vožnja. Ako u istoj ulici ili zgradi ima više kauča, dogovorimo cijenu po komadu. To vrijedi i za manje firme i urede. Auto-saloni: javite se, radimo po komadu, ne po "od" cijenama s internela.',
      'Cesta iz Vrbovca je ravna i brza. Zato Ivanić-Grad nije "daleko da se isplati" — isplati se i za jedan trosjed (50 €) ili bračni madrac (60 €), uz minimum izlaska 80 €. Tepih mjerimo po kvadratu, 5 €/m², bez minimuma po tepihu.',
      'Ako ste bliže Zagrebu, prema Rugvici, napišite točno mjesto. Rugvica nije automatski u besplatnoj zoni. Sam Ivanić-Grad, Caginec i Deanovec jesu. Pišite s ove stranice, poruka na WhatsAppu već nosi naziv grada.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Ivanić-Grad',
    howLead: 'Dogovor, dolazak, ekstrakcija, kratko objašnjenje sušenja. U stanovima pazimo na susjede i hodnike.',
    steps: [
      { t: 'Poruka s popisom', d: 'Npr. trosjed + tepih 6 m². To je 50 + 30 = 80 €, točno na minimumu. Paket s kutnom i foteljom je 160 €.' },
      { t: 'Termin', d: 'Često isti tjedan. Ako idemo i u Kloštar ili Čazmu, naredamo rutu da ne vozimo prazni.' },
      { t: 'Rad na adresi', d: 'Ne vozimo namještaj u radionicu. Kauč ostaje kod vas, mokar pa suh. Auto čistimo na parkingu ili u dvorištu.' },
    ],
    faq: [
      { q: 'Je li Kloštar Ivanić uključen u istu vožnju?', a: 'Da. Ivanić-Grad i Kloštar Ivanić su susjedi, dolazak je besplatan u oba. Imamo i zasebnu stranicu za Kloštar.' },
      { q: 'Radite li za urede u Ivaniću?', a: 'Da. Više fotelja i stolica ide po komadu; stolice samo uz drugu uslugu. Za veći broj dogovorimo cijenu u poruci.' },
      { q: 'Može li se tepih sušiti u stanu bez balkona?', a: 'Da, uz prozor i propuh. Deblji tepih treba 4–6 sati. Ljeti brže. Ne preporučujemo hodanje dok je mokar.' },
    ],
    related: ['klostar-ivanic', 'cazma', 'dugo-selo'],
    baDefault: 'mattress',
  },
  {
    slug: 'klostar-ivanic',
    town: town('klostar-ivanic'),
    name: 'Kloštar Ivanić',
    grad: 'Kloštar Ivanić',
    locative: 'Kloštru Ivaniću',
    accusative: 'Kloštar Ivanić',
    intro:
      'Kloštar Ivanić je 18-ak km od Vrbovca, odmah uz Ivanić-Grad, ime po pavlinskom samostanu. Dolazak je besplatan. Čistimo kauče, tepihe, madrace i auta u Kloštru i okolnim zaselcima, na vašoj adresi.',
    body: [
      'Kloštar i Ivanić su nam jedna ruta. Ako ste u Kloštru, a susjed u Ivaniću treba fotelju, spojimo. Vama to ne mijenja cijenu: dolazak je i onako nula. Trosjed 50 €, kutna 70–90 €, fotelja 15 €, stolica 5 € ali samo uz nešto veće.',
      'Naselje je manje od Ivanića, prilazi su često dvorišni. Recite ako kombij treba stati na cestu a ne u dvorište. Opremu nosimo. Nismo zagrebačka firma koja u cijenu kauča ugradi dolazak — cijena koju vidite je cijena koju platite.',
      'Čazma je sljedeća na istok, isto besplatna zona. Vrbovec na sjever. Ako ste između Kloštra i Čazme, u nekom od sela uz cestu, napišite ime mjesta. Minimalni izlazak 80 €. Paket Dnevni boravak 160 € ako imate kutnu, fotelju i manji tepih.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Kloštar Ivanić',
    howLead: 'Kratka vožnja iz Vrbovca, rad kod vas, odlazak. U Kloštru često stignemo uz isti dan kad radimo Ivanić.',
    steps: [
      { t: 'WhatsApp', d: 'Napišite Kloštar Ivanić i popis. Ako imate samo tabure, dodajte još jednu uslugu ili pitajte — možda smo ionako u Ivaniću tog dana.' },
      { t: 'Satnica', d: 'Uklapamo se u rutu Ivanić–Kloštar–Čazma. Vi birate jutro ili popodne.' },
      { t: 'Čišćenje', d: 'Ekstrakcija, eko sredstva, garancija: niste zadovoljni, dolazimo ponovno ili vraćamo novac.' },
    ],
    faq: [
      { q: 'Je li Kloštar Ivanić stvarno bez putnog troška, ili se to odnosi samo na Ivanić-Grad?', a: 'I Kloštar i Ivanić su besplatni. Nema skrivenog dodatka jer ste "selo pored".' },
      { q: 'Možete li stići ako nema broja na kući?', a: 'Da. Pošaljite pin lokacije na WhatsAppu ili opišite (crkva, samostan, benzinska). U Kloštru to često brže nađemo nego po kućnom broju.' },
      { q: 'Čistite li i auto u dvorištu?', a: 'Da. Mali auto 90 €, limuzina/karavan 110 €, SUV/kombi 130 €. Treba struja i da auto nije na suncu u najvećoj vrućini ako se da maknuti u hlad.' },
    ],
    related: ['ivanic-grad', 'cazma', 'vrbovec'],
    baDefault: 'couch',
  },
  {
    slug: 'cazma',
    town: town('cazma'),
    name: 'Čazma',
    grad: 'Čazma',
    locative: 'Čazmi',
    accusative: 'Čazmu',
    intro:
      'Čazma je oko 22 km jugoistočno od Vrbovca, između Ivanića i Bjelovara, uz rijeku Česmu. Dolazak je besplatan. Kauč, tepih, madrac i auto čistimo na adresi u Čazmi i okolnim selima.',
    body: [
      'Čazma je mala, ali ruta je nama prirodna: Vrbovec–Kloštar–Čazma. Zato ne naplaćujemo dolazak, za razliku od Bjelovara koji je sljedeći na istok (+25 €). Ako ste u Gornjem Dragancu ili selu uz cestu prema Bjelovaru, napišite mjesto da ne pomiješamo zone.',
      'U Čazmi često radimo kuće s velikim tepisima i kutnim garniturama u dnevnom. Tepih ide 5 €/m², bez minimuma po tepihu. Kutna 70–90 €. Ako uz kutnu ide fotelja i tepih do 6 m², paket je 160 €.',
      'Bjelovarski timovi rijetko ciljaju Čazmu, zagrebački još rjeđe. Mi smo s one strane županijske granice iz koje se Čazma vidi kao susjed, ne kao izlet. Pišite nam, javimo se u 30 minuta u radno vrijeme.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Čazmu',
    howLead: 'Najava, dolazak iz Vrbovca, rad kod vas. Ako istog dana idemo u Kloštar, naredamo satnicu da nitko ne čeka.',
    steps: [
      { t: 'Poruka', d: 'Čazma + popis usluga. Ako je tepih veći, pošaljite okvirne mjere (dužina × širina).' },
      { t: 'Termin', d: 'Radni dan ili subota. U Čazmi subota često odgovara zbog tjednog ritma prema Bjelovaru ili Zagrebu.' },
      { t: 'Čišćenje na licu mjesta', d: 'Ne ostavljamo namještaj. Vi dobijete mokar, čist kauč i uputu koliko ne sjedati dok se suši.' },
    ],
    faq: [
      { q: 'Dolazite li i u sela oko Čazme, ne samo u centar?', a: 'Da. Napišite naselje. Sela između Čazme i Kloštra su u besplatnoj zoni. Sela koja su već bjelovarska strana mogu pasti u +25 € — to kažemo unaprijed.' },
      { q: 'Zašto je Čazma besplatna, a Bjelovar +25 €?', a: 'Čazma je ~22 km od Vrbovca, Bjelovar ~33 km i drugi smjer kad se naredaju poslovi. Cijena usluge je ista; razlika je samo putni trošak.' },
      { q: 'Možete li očistiti više kauča u istoj kući?', a: 'Da. Svaki komad ide po cjeniku. Više stavki nema postotnog popusta; ima paket Dnevni boravak ako točno to trebate.' },
    ],
    related: ['klostar-ivanic', 'bjelovar', 'ivanic-grad'],
    baDefault: 'mattress',
  },
  {
    slug: 'bjelovar',
    town: town('bjelovar'),
    name: 'Bjelovar',
    grad: 'Bjelovar',
    locative: 'Bjelovaru',
    accusative: 'Bjelovar',
    intro:
      'Bjelovar je županijsko središte, oko 33 km istočno od Vrbovca, pod Bilogorom. Dolazimo, uz putni trošak 25 €. Cijene usluga su iste kao u Vrbovcu; 25 € je samo dolazak, ne "bjelovarska marža".',
    body: [
      'Iz Vrbovca do Bjelovara idemo kroz Čazmu ili preko Gudovca, ovisno o satu. Rovišće i Veliko Trojstvo su na toj ruti — napišite naselje. Sam Bjelovar (centar, Novi Bjelovar, Trojstveni Markovac) je +25 € na ponudu. Minimalni izlazak i dalje 80 €, plus putni ako zbroj usluga nije veći.',
      'U Bjelovaru ima lokalnih ekipa. Mi nismo "najbliži", zato i naplaćujemo dolazak pošteno umjesto da ga sakrijemo u cijenu kauča. Dvosjed je 30 € i u Bjelovaru i u Vrbovcu. Na računu (kad obrt bude registriran) i u WhatsApp ponudi putni trošak vidite kao zasebnu stavku.',
      'Ako spajate kutnu, tepih i fotelju, paket Dnevni boravak je 160 € + 25 € dolaska. To je i dalje predvidivo. Koprivnica je slična priča (+25 €). Čazma, bliža nama, ostaje besplatna. Pišite s ove stranice da znamo da ste iz Bjelovara.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Bjelovar',
    howLead: 'Najavimo sat, uračunamo 25 € dolaska, radimo kod vas. Ako istog dana imamo Čazmu, satnicu slažemo u jednu rutu.',
    steps: [
      { t: 'Pošaljete popis', d: 'Kalkulator na ovoj stranici može uračunati Bjelovar ako upišete lokaciju. Ili odmah pišite na WhatsApp.' },
      { t: 'Potvrdimo ukupno', d: 'Usluge + 25 €. Nema iznenađenja na vratima. Ako ste u predgrađu, i dalje +25 €, ne rastući "po kilometru".' },
      { t: 'Dolazak i rad', d: 'Parkiramo, donesemo stroj, očistimo, odemo. Garancija vrijedi i u Bjelovaru: ponovni dolazak ili novac natrag.' },
    ],
    faq: [
      { q: 'Je li +25 € po adresi ili po komadu?', a: 'Po dolasku, jednom. Pet kauča u istoj kući i dalje imaju jedan putni trošak 25 €.' },
      { q: 'Dolazite li u Rovišće i Veliko Trojstvo?', a: 'Obično da, uz isti putni trošak kao Bjelovar. Napišite mjesto da potvrdimo prije nego krenemo.' },
      { q: 'Zašto ne ostanem na bjelovarskoj ekipi?', a: 'Možete. Mi dolazimo ako vam odgovara cijena unaprijed, ekstrakcija i garancija. Ne pretvaramo se da smo lokalni Bjelovarčani.' },
    ],
    related: ['cazma', 'koprivnica', 'krizevci'],
    baDefault: 'couch',
  },
  {
    slug: 'koprivnica',
    town: town('koprivnica'),
    name: 'Koprivnica',
    grad: 'Koprivnica',
    locative: 'Koprivnici',
    accusative: 'Koprivnicu',
    intro:
      'Koprivnica je oko 42 km sjeveroistočno od Vrbovca, u Podravini. Dolazimo uz 25 € putnog troška. Kauč, tepih, madrac i auto čistimo na vašoj adresi; cijene usluga su iste kao kod kuće u Vrbovcu.',
    body: [
      'Ruta je Vrbovec–Križevci–Koprivnica. Zato Križevci ostaju besplatni, a Koprivnica ima ravnih 25 € dolaska, ne obračun po kilometru. Ako ste u predgrađu prema Đurđevcu ili Legradu, napišite mjesto: to već može biti izvan ove ponude, ne želimo obećati vožnju koju ne možemo držati.',
      'Koprivnica ima i stanove u novogradnji i starije kuće. Kutna garnitura 70–90 €, tepih 5 €/m², SUV 130 €. Putni trošak je jednom po adresi. Paket Dnevni boravak 160 € + 25 € dolaska ako točno to trebate.',
      'Ne pretvaramo se da smo koprivnička firma. Dolazimo jer ruta preko Križevaca ima smisla i jer cijenu kažemo prije polaska. Ako trebate račun odmah, javite se: obrt je u osnivanju, račun ide po registraciji. Pišite s ove stranice, poruka već nosi Koprivnicu.',
    ],
    howTitle: 'Kako to izgleda kad dolazimo u Koprivnicu',
    howLead: 'Dogovorimo dan kad nam se ruta Križevci–Koprivnica složi, ili dođemo samo zbog vas uz istih 25 €. Bez skrivenih stavki.',
    steps: [
      { t: 'Poruka s Koprivnice', d: 'Popis usluga i kvart (centar, herešinec, industrija…). Odgovorimo s ukupnim iznosom uključujući 25 €.' },
      { t: 'Dan i sat', d: 'Radni dan 8–20 ili subota 9–18. Ako spajamo s Križevcima, predložimo satnicu koja štedi vaše čekanje.' },
      { t: 'Rad kod vas', d: 'Ekstrakcija, eko sredstva, sušenje 2–4 sata. Garancija vrijedi: ponovo ili novac natrag.' },
    ],
    faq: [
      { q: 'Je li +25 € i za predgrađe Koprivnice?', a: 'Za samu Koprivnicu da, jednom po adresi. Sela prema Đurđevcu ili Dravi napišite pa kažemo možemo li i po kojoj cijeni. Ne obećavamo unaprijed cijelu Podravinu.' },
      { q: 'Možete li raditi u auto-salonu u Koprivnici?', a: 'Da, po komadu. Javite broj vozila i tip (mali / limuzina / SUV). Račun po registraciji obrta; do tada dogovorimo kako vam treba za knjigovodstvo.' },
      { q: 'Zašto ne naplaćujete po kilometru?', a: 'Jer 0,50 €/km u Koprivnici zvuči jeftino pa naraste. 25 € je jasno. Usluga ostaje 30/50/70–90 za kauč, kao i svima drugima.' },
    ],
    related: ['krizevci', 'bjelovar', 'vrbovec'],
    baDefault: 'mattress',
  },
];

export const cityBySlug = Object.fromEntries(CITY_PAGES.map((c) => [c.slug, c])) as Record<string, CityPage>;

export function cityHref(slug: string): string {
  return cityPath(slug);
}
