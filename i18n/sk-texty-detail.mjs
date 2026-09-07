/* Slovník CZ → SK pro src/scripts/40-product-detail.js.
   Vyčleněno z i18n/sk-texty.mjs, protože samotný detail produktu nese víc
   textu než všechny ostatní skripty dohromady (recenze, materiál a péče,
   ceník dopravy, sedm okruhů FAQ).

   ⚠️ Ceník dopravy je nahrazený placeholdery {{SK_…}} — slovenské metody
   a ceny v eurech zatím nejsou. PŘED NASAZENÍM je nutné je vyplnit, jinak
   je zákazník uvidí na stránce. Viz reference/sk-mapa-id.md. */

export const DETAIL = [
  [`stars.alt = "Hodnocení 5 z 5 hvězd";`, `stars.alt = "Hodnotenie 5 z 5 hviezd";`],
  [`facade.setAttribute("aria-label", "Přehrát video");`,
   `facade.setAttribute("aria-label", "Prehrať video");`],
  [`var prev = alsoArrow("prev", "Předchozí produkty");`,
   `var prev = alsoArrow("prev", "Predchádzajúce produkty");`],
  [`var next = alsoArrow("next", "Další produkty");`,
   `var next = alsoArrow("next", "Ďalšie produkty");`],
  [`aria-label="Zavřít">`, `aria-label="Zavrieť">`],

  [`var TITLE = "Přes 130 000 spokojených zákazníků";`,
   `var TITLE = "Vyše 130 000 spokojných zákazníkov";`],

  [`    { name: "Ondra",            quote: "„Vše v naprostém pořádku. Rychlost. Kvalita. Doporučuji." },
    { name: "Blanka",           quote: "„Rychlé dodání, skvělá komunikace, ochota a vstřícnost." },
    { name: "Eliška Vostracká", quote: "„Nakupuji pravidelně, kvalitní materiál, rychlost dodání, spokojenost." }`,
   `    { name: "Ondra",            quote: "„Všetko v úplnom poriadku. Rýchlosť. Kvalita. Odporúčam." },
    { name: "Blanka",           quote: "„Rýchle dodanie, skvelá komunikácia, ochota a ústretovosť." },
    { name: "Eliška Vostracká", quote: "„Nakupujem pravidelne, kvalitný materiál, rýchlosť dodania, spokojnosť." }`],

  [`label.textContent = "Množství";`, `label.textContent = "Množstvo";`],

  /* Platforma na SK píše u data doručení „Ponožky budú u vás“; u neponožkového
     zboží to měníme na obecný tvar. Regulárka musí poznat i české názvy
     produktů — ty zatím přeložené nejsou. */
  [`var SOCK_RE = /ponožk|podkolenk/i;`, `var SOCK_RE = /ponožk|podkolienk|podkolenk/i;`],
  [`if (node.nodeValue.indexOf("Ponožky budou u vás") === -1) continue;`,
   `if (node.nodeValue.indexOf("Ponožky budú u vás") === -1) continue;`],
  [`node.nodeValue.replace("Ponožky budou u vás", "Zboží bude u vás");`,
   `node.nodeValue.replace("Ponožky budú u vás", "Tovar bude u vás");`],

  [`'<button type="button" class="pd-sticky-cta__btn">Přidat do košíku</button>';`,
   `'<button type="button" class="pd-sticky-cta__btn">Pridať do košíka</button>';`],

  /* Nativní ouška tabů. Slovenská platforma posílá „Popis“ (stejné slovo)
     a „Parametre“; české tvary necháváme v seznamu taky, kdyby se někde
     objevil obsah ještě z české mutace. */
  [`    "Popis": "Složení"`, `    "Popis": "Zloženie"`],
  [`var TAB_HIDE = ["Parametry"];`, `var TAB_HIDE = ["Parametre", "Parametry"];`],
  [`var TAB_OPEN = "Složení";`, `var TAB_OPEN = "Zloženie";`],

  [`    { name: "Balíkovna na výdejní místa", note: "Zdarma nad 999 Kč", price: "79 Kč" },
    { name: "Zásilkovna – výdejní místa a boxy", note: "Zdarma nad 999 Kč", price: "69 Kč" },
    { name: "Alzaboxy a výdejní místa PPL", note: "Zdarma nad 999 Kč", price: "79 Kč" },
    { name: "Balíkovna – doručení domů", note: "Zdarma nad 1 499 Kč", price: "119 Kč" },
    { name: "PPL – doručení domů", note: "Zdarma nad 1 499 Kč", price: "129 Kč" }`,
   `    { name: "{{SK_DOPRAVCA_1}}", note: "{{SK_ZADARMO_1}}", price: "{{SK_CENA_1}}" },
    { name: "{{SK_DOPRAVCA_2}}", note: "{{SK_ZADARMO_2}}", price: "{{SK_CENA_2}}" },
    { name: "{{SK_DOPRAVCA_3}}", note: "{{SK_ZADARMO_3}}", price: "{{SK_CENA_3}}" }`],

  [`      '<p class="pd-callout__title">Vrácení zboží do 120 dní</p>' +
      "<p>Chceme, abyste byli s nákupem 100% spokojeni. Proto u nás máte na " +
      "vrácení zboží až 120 dní od jeho převzetí. Bez starostí a zbytečných " +
      "otázek.</p>" +`,
   `      '<p class="pd-callout__title">Vrátenie tovaru do 120 dní</p>' +
      "<p>Chceme, aby ste boli s nákupom 100% spokojní. Preto u nás máte na " +
      "vrátenie tovaru až 120 dní od jeho prevzatia. Bez starostí a zbytočných " +
      "otázok.</p>" +`],

  [`      "<li><strong>Bavlna – základ pohodlí a prodyšnosti</strong>" +
      "<p>Přírodní soft luxus: bavlna je příjemně hebká na dotek, skvěle saje " +
      "vlhkost a nechává pokožku volně dýchat po celý den.</p></li>" +

      "<li><strong>Polyamid – mistr na jemné vzory</strong>" +
      "<p>Detailní a čisté motivy: polyamidová vlákna jsou tenká a mimořádně " +
      "pevná. Právě díky nim dokážeme do úpletu dostat i ty nejjemnější vzory, " +
      "drobné grafiky a přesné kontury bez ztráty kvality.</p></li>" +

      "<li><strong>Elastan – aby ponožka seděla jako ulitá</strong>" +
      "<p>Stačí jen malé procento elastanu a dějí se zázraky. Dává ponožce " +
      "pružnost a tvarovou stálost. Díky němu ponožka obepne nohu, neshrnuje " +
      "se v botě a horní lem drží bez zbytečného zařezávání.</p></li>" +`,
   `      "<li><strong>Bavlna – základ pohodlia a priedušnosti</strong>" +
      "<p>Prírodný soft luxus: bavlna je príjemne hebká na dotyk, skvele saje " +
      "vlhkosť a necháva pokožku voľne dýchať po celý deň.</p></li>" +

      "<li><strong>Polyamid – majster na jemné vzory</strong>" +
      "<p>Detailné a čisté motívy: polyamidové vlákna sú tenké a mimoriadne " +
      "pevné. Práve vďaka nim dokážeme do úpletu dostať aj tie najjemnejšie vzory, " +
      "drobné grafiky a presné kontúry bez straty kvality.</p></li>" +

      "<li><strong>Elastan – aby ponožka sedela ako uliata</strong>" +
      "<p>Stačí len malé percento elastanu a dejú sa zázraky. Dáva ponožke " +
      "pružnosť a tvarovú stálosť. Vďaka nemu ponožka obopne nohu, nezhŕňa " +
      "sa v topánke a horný lem drží bez zbytočného zarezávania.</p></li>" +`],

  [`      "<h4>Jak pečovat o ponožky, aby vydržely co nejdéle svěží a barevné? 🧦</h4>" +
      "<p>Chcete, aby vám vaše oblíbené ponožky dělaly radost při každém kroku " +
      "a udržely si skvělou formu? Stačí jim dopřát trochu jednoduché péče. " +
      "Tady je pár osvědčených tipů, díky kterým zůstanou barvy zářivé " +
      "a materiál perfektně pružný:</p>" +`,
   `      "<h4>Ako sa starať o ponožky, aby vydržali čo najdlhšie svieže a farebné? 🧦</h4>" +
      "<p>Chcete, aby vám vaše obľúbené ponožky robili radosť pri každom kroku " +
      "a udržali si skvelú formu? Stačí im dopriať trochu jednoduchej starostlivosti. " +
      "Tu je pár osvedčených tipov, vďaka ktorým zostanú farby žiarivé " +
      "a materiál perfektne pružný:</p>" +`],

  [`      "<li><strong>Perte naruby a na pohodu (30–40 °C)</strong>" +
      "<p>Otočte je naruby: ochráníte tím lícovou stranu i barvy před odíráním " +
      "v bubnu pračky a zároveň lépe vyperete část, která byla v přímém " +
      "kontaktu s chodidlem.</p>" +
      "<p>Nepřehřívejte vodu: teplota 30 °C až 40 °C bohatě stačí na perfektní " +
      "vyprání a zbytečně nenamáhá elastická vlákna.</p></li>" +`,
   `      "<li><strong>Perte naruby a na pohodu (30–40 °C)</strong>" +
      "<p>Otočte ich naruby: ochránite tým lícovú stranu aj farby pred odieraním " +
      "v bubne práčky a zároveň lepšie vyperiete časť, ktorá bola v priamom " +
      "kontakte s chodidlom.</p>" +
      "<p>Neprehrievajte vodu: teplota 30 °C až 40 °C bohato stačí na perfektné " +
      "vypranie a zbytočne nenamáha elastické vlákna.</p></li>" +`],

  [`      "<li><strong>S aviváží opatrně</strong>" +
      "<p>Elastická vlákna (jako elastan) nemají příliš v lásce nadmíru " +
      "aviváže – ta může obalit vlákna, snížit jejich prodyšnost a způsobit " +
      "ztrátu pružnosti. Běžný prací gel nebo prášek bohatě stačí.</p></li>" +`,
   `      "<li><strong>S avivážou opatrne</strong>" +
      "<p>Elastické vlákna (ako elastan) nemajú príliš v láske nadmieru " +
      "avivážе – tá môže obaliť vlákna, znížiť ich priedušnosť a spôsobiť " +
      "stratu pružnosti. Bežný prací gél alebo prášok bohato stačí.</p></li>" +`],

  [`      "<li><strong>Sušička? Raději volný vzduch</strong>" +
      "<p>Nejlepší cestou k dlouhé životnosti je přirozené schnutí na čerstvém " +
      "vzduchu. Vysoké teploty v sušičce mohou ponožky srazit nebo oslabit " +
      "pružný lem.</p></li>" +`,
   `      "<li><strong>Sušička? Radšej voľný vzduch</strong>" +
      "<p>Najlepšou cestou k dlhej životnosti je prirodzené schnutie na čerstvom " +
      "vzduchu. Vysoké teploty v sušičke môžu ponožky zraziť alebo oslabiť " +
      "pružný lem.</p></li>" +`],

  [`      "<li><strong>Žehličku nechte odpočívat</strong>" +
      "<p>Ponožky po obutí samy krásně přilnou k noze. Vysoká teplota žehličky " +
      "by navíc mohla poškodit jemná elastická složení úpletu.</p></li>" +`,
   `      "<li><strong>Žehličku nechajte odpočívať</strong>" +
      "<p>Ponožky po obutí samy krásne priľnú k nohe. Vysoká teplota žehličky " +
      "by navyše mohla poškodiť jemné elastické zloženie úpletu.</p></li>" +`],

  [`      "<li><strong>Skládejte bez zbytečného natahování</strong>" +
      "<p>Místo motání do těsných „kuliček“, které časem vytahují horní " +
      "gumičku, zkuste ponožky raději překládat napůl nebo jemně rolovat. " +
      "Lem vám za to poděkuje!</p></li>" +`,
   `      "<li><strong>Skladajte bez zbytočného naťahovania</strong>" +
      "<p>Namiesto motania do tesných „guľôčok“, ktoré časom vyťahujú hornú " +
      "gumičku, skúste ponožky radšej prekladať napoly alebo jemne rolovať. " +
      "Lem vám za to poďakuje!</p></li>" +`],

  [`var ALSO_TITLE = "Zákazníci také nakupují";`, `var ALSO_TITLE = "Zákazníci tiež nakupujú";`],
  [`var ALSO_CTA = "Přidat do košíku";`, `var ALSO_CTA = "Pridať do košíka";`],
  [`var SIZE_LINK_TEXT = "Tabulka velikostí";`, `var SIZE_LINK_TEXT = "Tabuľka veľkostí";`],
  [`var SIZE_MODAL_TITLE = "Tabulka velikostí";`, `var SIZE_MODAL_TITLE = "Tabuľka veľkostí";`],

  [`    { label: "Materiál a péče", html: careHtml() },`,
   `    { label: "Materiál a starostlivosť", html: careHtml() },`],
  [`      label: "Doprava a vrácení",`, `      label: "Doprava a vrátenie",`],
  [`    { label: "Časté dotazy", html: faqHtml() }`, `    { label: "Časté otázky", html: faqHtml() }`],
  [`    "Složení",
    "Materiál a péče",
    "Doprava a vrácení",
    "Časté dotazy"`,
   `    "Zloženie",
    "Materiál a starostlivosť",
    "Doprava a vrátenie",
    "Časté otázky"`]
];
