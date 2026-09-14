/* Slovník CZ → SK pro generátor slovenských skriptů (build-sk.mjs).

   Formát: pole dvojic [přesný úsek českého zdroje, slovenská náhrada].
   Náhrada se hledá jako DOSLOVNÝ text ve zdrojovém souboru, takže se dá
   vyměnit i celý blok kódu (pole, regulárka), ne jen holý řetězec.
   Když se náhrada nikde netrefí, build-sk.mjs to ohlásí jako chybu —
   po úpravě češtiny se tedy hned pozná, co je potřeba doladit.

   Co se NEPŘEKLÁDÁ: komentáře (jsou to interní poznámky pro nás) a slova,
   která mají čeština i slovenština stejná („Košík“, „Veselé ponožky“,
   „Popis“, „materiál“).

   ⚠️ Ceny: slovenský shop jede v eurech, ale ceník dopravy zatím není —
   na jeho místě jsou placeholdery {{SK_…}}, viz reference/sk-mapa-id.md. */

import { SK_ECOMAIL } from "./sk-ids.mjs";
import { DETAIL } from "./sk-texty-detail.mjs";
import { DETAIL_FAQ } from "./sk-texty-faq.mjs";

/* Podezřelá čeština BEZ ě/ř/ů — detektor v build-sk.mjs ji podle písmen
   nepozná, a přesně tudy se do slovenského shopu dostalo „10 Kč“ místo
   „9.99 €“ v přeškrtnuté ceně a „Velikost 35-38“ v popupu košíku. */
export const PODEZRELE = /Kč|korun|Velikost|[Zz]darma|ZDARMA|Souhlas/;

/* Výjimka z kontroly PODEZRELE — platí jen na PŘESNOU shodu celého řetězce,
   aby „Kč“ jako symbol měny prošla, ale „ Kč“ nalepená na cenu ne. */
export const POVOLENE_PRESNE = [
  // 50-checkout.js: currencySymbol() vrací měnu přečtenou z názvu dopravní
  // metody. Na slovenském shopu tam pořád stojí „ZDARMA NAD 999 Kč“, a tu
  // korunu musíme zobrazit tak, jak ji admin napsal — přepsat ji na euro
  // by zákazníkovi tvrdilo jiný limit, než platí v pokladně.
  "Kč"
];

/* Řetězce, které česky ZŮSTAT MAJÍ — kontrola v build-sk.mjs je přeskočí.
   Slovenský shop pořád prodává produkty s českými názvy (nejsou přeložené),
   takže prefixy k odřezávání i regulárky musí české tvary poznat dál. */
export const POVOLENE = [
  "Dětské ponožky",
  "Dárková krabička",
  "Dárkový set",
  "Alžběta Dixová",
  // Třeboň je zeměpisné jméno — ve slovenštině se píše se stejným „ř“.
  "Třeboni"
];

/* Náhrady zkoušené ve všech souborech; když se netrefí, nic se neděje. */
export const SDILENE = [
  ["Zobrazit vše", "Zobraziť všetko"],
  ["Nejprve vyberte velikost", "Najprv vyberte veľkosť"],
  ["Ověřený zákazník", "Overený zákazník"],
  ["97 % zákazníků doporučuje — Ověřeno zákazníky Heureka",
   "97 % zákazníkov odporúča — Overené zákazníkmi Heureka"],
  ["Hodnocení 5 z 5", "Hodnotenie 5 z 5"],
  ["Hodnocení 4,9 z 5", "Hodnotenie 4,9 z 5"]
];

export const TEXTY = {
  "30-product-cards.js": [
    // Prefixy názvů produktů, které se z karet odřezávají. Slovenské názvy
    // produktů zatím nejsou přeložené, proto zůstávají i české tvary.
    [`  var NAME_PREFIXES = [`, `  var NAME_PREFIXES = [\n    "Veselé ponožky",\n    "Detské ponožky",\n    "Darčeková krabička",\n    "Darčekový set",`],
  ],

  "35-listing-sort.js": [
    ["Řazení", "Zoradenie"],
    // Výprodej — jediná kategorie, kde se řadí od nejlevnějšího.
    [`var PRICE_FIRST = ["1243142"];`, `var PRICE_FIRST = ["1254445"];`]
  ],

  "36-filter.js": [
    ["'Zobrazit všechny<span", "'Zobraziť všetky<span"]
  ],

  "45-cart-popup.js": [
    // Platforma na SK píše „5.79 €“ — tečka, ne čárka.
    [`var CURRENCY = " Kč";`, `var CURRENCY = " €";`],
    [`var DECIMAL_SEP = ",";`, `var DECIMAL_SEP = ".";`],
    [`var SIZE_LABEL = "Velikost ";`, `var SIZE_LABEL = "Veľkosť ";`]
  ],

  "50-checkout.js": [
    // Eura mají halíře, koruny v košíku nikdy — proto DECIMALS 0 → 2.
    // Bez toho se z „9.99 €“ stane v přeškrtnuté ceně „10 €“.
    [`var CURRENCY = ' Kč';`, `var CURRENCY = ' €';`],
    [`var DECIMALS = 0;`, `var DECIMALS = 2;`],
    [`var DECIMAL_SEP = ',';`, `var DECIMAL_SEP = '.';`],
    // Poznámka u dopravy: „Zdarma nad 999 Kč“ → „Zadarmo nad 999 Kč“.
    // Měnu skript přebírá z názvu metody, tady se mění jen slovo —
    // FREE_RE i FREE_PRICE_RE umí oba jazyky a zůstávají beze změny.
    [`var FREE_WORD = 'Zdarma nad';`, `var FREE_WORD = 'Zadarmo nad';`]
    // Popisek souhlasu se NEPŘEKLÁDÁ: skript lepí „Ne“ před slovo, které
    // v popisku opravdu našel, takže zvládne „Souhlasím“ i „Súhlasím“.
  ],

  "countdown-bar.js": [
    [`var ENDED_FALLBACK = "Akce byla ukončena.";`, `var ENDED_FALLBACK = "Akcia bola ukončená.";`],
    [`"[vp] Odpočet v liště: konec akce se nepodařilo načíst " +`,
     `"[vp] Odpočet v lište: koniec akcie sa nepodarilo načítať " +`],
    [`"z administrace — %countdown% není ani na této stránce, ani na homepage."`,
     `"z administrácie — %countdown% nie je ani na tejto stránke, ani na homepage."`]
  ],

  "header.js": [
    // Čtyři barevné kategorie v mobilním menu. České kategorie 1243445/60/63/
    // 1243517 na slovenském shopu neexistují (duplikace je nepřenesla), proto
    // míříme na hlavní slovenské kategorie — viz i18n/sk-ids.mjs.
    // Náhrady musí zůstat uvnitř jednoho řádku kódu — generátor komentáře
    // nepřepisuje, takže blok přesahující přes „// červená“ by se netrefil.
    [`{ id: "1243445", color: "c1", name: "MultiPACK" },`,
     `{ id: "1254433", color: "c1", name: "Pánske Veselé ponožky" },`],
    [`{ id: "1243460", color: "c2", name: "Zdravotnictví" },`,
     `{ id: "1254436", color: "c2", name: "Dámske Veselé ponožky" },`],
    [`{ id: "1243463", color: "c3", name: "Káva" },`,
     `{ id: "1254439", color: "c3", name: "Detské Veselé ponožky" },`],
    [`{ id: "1243517", color: "c4", name: "Adventní kalendáře" }`,
     `{ id: "1254442", color: "c4", name: "Darčekové sety" }`],
    [`var CMS_EXTRA = [{ id: "60969", name: "Kontakty" }];`,
     `var CMS_EXTRA = [{ id: "61624", name: "Kontakty" }];`]
  ],

  // Detail produktu nese víc textu než všechny ostatní skripty dohromady,
  // proto je jeho slovník ve dvou samostatných souborech.
  "40-product-detail.js": [...DETAIL, ...DETAIL_FAQ],

  "footer.js": [
    // Ecomail: slovenský seznam se přepíná jediným ID v i18n/sk-ids.mjs.
    // Když tam ID není, náhrada se vůbec nepřidá a v SK footeru zůstane české.
    ...(SK_ECOMAIL.formId
      ? [[`formId: "4-f67e22c6c3dacfc9b77b6b40399abc16",`,
          `formId: "${SK_ECOMAIL.formId}",`]]
      : []),
    ...(SK_ECOMAIL.code ? [[`code: "VESELE15",`, `code: "${SK_ECOMAIL.code}",`]] : []),
    [`'NEZMEŠKEJTE<br>ŽÁDNÉ NOVINKY<br><span class="vp-nl__accent">A ZÍSKEJTE SLEVU 15%!</span>'`,
     `'NEZMEŠKAJTE<br>ŽIADNE NOVINKY<br><span class="vp-nl__accent">A ZÍSKAJTE ZĽAVU 15%!</span>'`],
    [`"Přihlaste se k odběru našeho newsletteru a získejte <br class=\\"vp-nl__br\\">slevu 15 % na váš první nákup veselých ponožek."`,
     `"Prihláste sa na odber nášho newslettera a získajte <br class=\\"vp-nl__br\\">zľavu 15 % na váš prvý nákup veselých ponožiek."`],
    [`"Přihlásit se"`, `"Prihlásiť sa"`],
    [`"Váš slevový kód na 15 %:"`, `"Váš zľavový kód na 15 %:"`],
    [`"Zkopírovat kód"`, `"Skopírovať kód"`],
    [`"Zkopírováno"`, `"Skopírované"`],
    // Recenze zákazníků — jména zůstávají, texty se překládají.
    [`"Vše v naprostém pořádku. Rychlost. Kvalita. Doporučuji."`,
     `"Všetko v úplnom poriadku. Rýchlosť. Kvalita. Odporúčam."`],
    [`"Rychlé dodání, skvělá komunikace, ochota a vstřícnost."`,
     `"Rýchle dodanie, skvelá komunikácia, ochota a ústretovosť."`],
    [`"Kvalitní pěkné ponožky."`, `"Kvalitné pekné ponožky."`],
    [`"Nakupuji pravidelně, kvalitní materiál, rychlost dodání, spokojenost."`,
     `"Nakupujem pravidelne, kvalitný materiál, rýchlosť dodania, spokojnosť."`],
    [`"Rychle doručeno. Doma fakt radost, když jsme ponožky rozbalili :)"`,
     `"Rýchlo doručené. Doma bola fakt radosť, keď sme ponožky rozbalili :)"`],
    [`"Velký výběr, rychlé dodání, skvělá komunikace."`,
     `"Veľký výber, rýchle dodanie, skvelá komunikácia."`],
    [`"Objednala jsem poprvé a velice jsem spokojená, děkuji."`,
     `"Objednala som prvýkrát a veľmi som spokojná, ďakujem."`],
    [`"Kvalitní a krásné s úžasnými motivy."`, `"Kvalitné a krásne s úžasnými motívmi."`],
    [`"Ponožky z tohoto obchodu jsou opravdu velmi kvalitní, pružné a dobře „sedí\\". Dodání zboží bylo velmi rychlé, za 2 dny od objednávky."`,
     `"Ponožky z tohto obchodu sú naozaj veľmi kvalitné, pružné a dobre „sedia\\". Dodanie tovaru bolo veľmi rýchle, za 2 dni od objednávky."`],
    [`"Spokojených zákazníků"`, `"Spokojných zákazníkov"`],
    [`"Průměrné hodnocení"`, `"Priemerné hodnotenie"`],
    [`"Doporučuje naše ponožky"`, `"Odporúča naše ponožky"`],
    [`"(Po–Pá 9:00–16:00 hod.)"`, `"(Po–Pi 9:00–16:00 hod.)"`],
    [`'<h2 class="vp-foot__reviews-title">CO ŘÍKAJÍ NAŠI <span class="vp-foot__hl">ZÁKAZNÍCI</span>?</h2>'`,
     `'<h2 class="vp-foot__reviews-title">ČO HOVORIA NAŠI <span class="vp-foot__hl">ZÁKAZNÍCI</span>?</h2>'`],
    [`'<p class="vp-foot__reviews-sub">Vaše spokojenost je pro nás na prvním místě.</p>'`,
     `'<p class="vp-foot__reviews-sub">Vaša spokojnosť je pre nás na prvom mieste.</p>'`],
    [`'<span class="vp-foot__pay-label">Zabezpečené platby zajišťuje</span>'`,
     `'<span class="vp-foot__pay-label">Zabezpečené platby zaisťuje</span>'`],
    [`aria-label="Platební brána Comgate"`, `aria-label="Platobná brána Comgate"`],

    [`alt="Veseléponožky.cz"`, `alt="Veseléponožky.sk"`],
    // Comgate má slovenskou jazykovou verzi stránky o platební bráně.
    [`var PAY_URL = "https://www.comgate.eu/cs/platebni-brana";`,
     `var PAY_URL = "https://www.comgate.eu/sk/platobna-brana";`]
  ]
};
