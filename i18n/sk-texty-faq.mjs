/* Slovník CZ → SK pro sekci „Časté otázky" na detailu produktu
   (var FAQ v src/scripts/40-product-detail.js).

   Odkazy uvnitř odpovědí se píšou s ČESKÝMI ID CMS stránek — build-sk.mjs je
   přemapuje na slovenská podle i18n/sk-ids.mjs. Nepiš je tu rovnou slovenské,
   přišel bys o kontrolu, že mapa sedí.

   Věcné rozdíly proti češtině (ne jen jazyk):
   • otázka „Doručujete i na Slovensko?" se obrací na „Doručujete aj do Česka?"
     a odkazuje na veseleponozky.cz,
   • hranice dopravy zdarma je placeholder {{SK_DOPRAVA_ZADARMO_OD}},
   • jména dopravců zůstávají v placeholderech, protože slovenské přepravce
     zatím neznáme. */

export const DETAIL_FAQ = [
  [`      title: "Produkt a péče o ponožky",`, `      title: "Produkt a starostlivosť o ponožky",`],
  [`          "Z jakého materiálu jsou ponožky vyrobené?",
          "Základem našich ponožek je kvalitní česaná bavlna (zpravidla 80 %), která " +
          "zajišťuje měkkost, prodyšnost a celodenní pohodlí. Aby ponožky perfektně " +
          "držely tvar, neškrtily a vydržely nespočet vyprání, doplňujeme ji o odolný " +
          "polyamid a pružný elastan."`,
   `          "Z akého materiálu sú ponožky vyrobené?",
          "Základom našich ponožiek je kvalitná česaná bavlna (spravidla 80 %), ktorá " +
          "zaisťuje mäkkosť, priedušnosť a celodenné pohodlie. Aby ponožky perfektne " +
          "držali tvar, neškrtili a vydržali nespočet praní, dopĺňame ju o odolný " +
          "polyamid a pružný elastan."`],
  [`          "Jak správně vybrat velikost?",
          "Ponožky nabízíme ve standardních rozmezích (např. 35–38, 39–42, 43–46). Díky " +
          "elastanu se noze skvěle přizpůsobí. Pokud jste rozměrově přesně na pomezí " +
          "(např. máte velikost 42,5), doporučujeme sáhnout po větší variantě pro " +
          "maximální pohodlí."`,
   `          "Ako správne vybrať veľkosť?",
          "Ponožky ponúkame v štandardných rozmedziach (napr. 35–38, 39–42, 43–46). Vďaka " +
          "elastanu sa nohe skvele prispôsobia. Ak ste rozmerovo presne na pomedzí " +
          "(napr. máte veľkosť 42,5), odporúčame siahnuť po väčšej variante pre " +
          "maximálne pohodlie."`],
  [`          "Jak se o veselé ponožky starat, aby barvy nevypadaly?",
          "Aby vám ponožky dělaly radost co nejdéle, perte je naruby na max. 30–40 °C a " +
          "vyhněte se bělidlům či chemickému čištění. Sušičku doporučujeme vynechat – " +
          "vysoká teplota poškozuje elastická vlákna."`,
   `          "Ako sa o veselé ponožky starať, aby farby nevybledli?",
          "Aby vám ponožky robili radosť čo najdlhšie, perte ich naruby na max. 30–40 °C a " +
          "vyhnite sa bieliacim prostriedkom či chemickému čisteniu. Sušičku odporúčame vynechať – " +
          "vysoká teplota poškodzuje elastické vlákna."`],

  [`      title: "Rychlost doručení a expedice",`, `      title: "Rýchlosť doručenia a expedície",`],
  [`          "Jak rychle balíček odesíláte?",
          "Všechno zboží máme skladem. Objednávky přijaté v pracovní den do 12:00 " +
          "balíme a předáváme dopravci ještě týž den. Pozdější objednávky odesíláme " +
          "hned následující pracovní den."`,
   `          "Ako rýchlo balík odosielate?",
          "Všetok tovar máme skladom. Objednávky prijaté v pracovný deň do 12:00 " +
          "balíme a odovzdávame dopravcovi ešte v ten istý deň. Neskoršie objednávky odosielame " +
          "hneď nasledujúci pracovný deň."`],
  [`          "Za jak dlouho budou ponožky u mě?",
          "<p>Standardní doba doručení po ČR je 1 až 2 pracovní dny od " +
          "odeslání.</p><ul><li><strong>Zásilkovna, Balíkovna a boxy PPL:</strong> " +
          "obvykle k vyzvednutí druhý den od podání.</li><li><strong>Kurýr na " +
          "adresu:</strong> doručuje zpravidla do 24–48 hodin od převzetí " +
          "balíčku.</li></ul>"`,
   `          "Za ako dlho budú ponožky u mňa?",
          "<p>Štandardná doba doručenia po SR je 1 až 2 pracovné dni od " +
          "odoslania.</p><ul><li><strong>Výdajné miesta a boxy:</strong> " +
          "zvyčajne na vyzdvihnutie druhý deň od podania.</li><li><strong>Kuriér na " +
          "adresu:</strong> doručuje spravidla do 24–48 hodín od prevzatia " +
          "balíka.</li></ul>"`],
  [`          "Potřebuji ponožky zítra jako dárek – stihne to dorazit?",
          "Pokud objednáte v pracovní den do 12:00 a zvolíte platbu kartou online " +
          "(případně dobírku), v 95 % případů máte balíček druhý den u sebe nebo v " +
          "boxu."`,
   `          "Potrebujem ponožky zajtra ako darček – stihne to doraziť?",
          "Ak objednáte v pracovný deň do 12:00 a zvolíte platbu kartou online " +
          "(prípadne dobierku), v 95 % prípadov máte balík druhý deň u seba alebo v " +
          "boxe."`],
  [`          "Doručujete i o víkendu?",
          "Expedice z našeho skladu probíhá od pondělí do pátku, ve vánoční sezóně " +
          "odesíláme i o víkendu. Pokud si ale necháte balíček poslat do samoobslužného " +
          "boxu (např. Z-BOX, AlzaBox), můžete si ho vyzvednout kdykoliv i během " +
          "víkendu, jakmile ho tam dopravce uloží."`,
   `          "Doručujete aj cez víkend?",
          "Expedícia z nášho skladu prebieha od pondelka do piatku, vo vianočnej sezóne " +
          "odosielame aj cez víkend. Ak si však necháte balík poslať do samoobslužného " +
          "boxu, môžete si ho vyzdvihnúť kedykoľvek aj počas " +
          "víkendu, hneď ako ho tam dopravca uloží."`],
  [`          "Doručujete i na Slovensko?",
          "Ano — máme slovenskou mutaci e-shopu <a href=\\"https://www.veseleponozky.sk\\" " +
          "target=\\"_blank\\" rel=\\"noopener\\">veseleponozky.sk</a>, nakupte prosím tam."`,
   `          "Doručujete aj do Česka?",
          "Áno — máme českú mutáciu e-shopu <a href=\\"https://www.veseleponozky.cz\\" " +
          "target=\\"_blank\\" rel=\\"noopener\\">veseleponozky.cz</a>, nakúpte prosím tam."`],
  [`          "Jak poznám, kde se můj balíček právě nachází?",
          "Jakmile předáme zásilku dopravci, pošleme vám e-mail s odkazem pro sledování " +
          "zásilky. Přesné informace o pohybu balíčku vám bude posílat i samotný " +
          "dopravce v SMS a e-mailu."`,
   `          "Ako zistím, kde sa môj balík práve nachádza?",
          "Hneď ako odovzdáme zásielku dopravcovi, pošleme vám e-mail s odkazom na sledovanie " +
          "zásielky. Presné informácie o pohybe balíka vám bude posielať aj samotný " +
          "dopravca v SMS a e-maile."`],

  [`      title: "Doprava a platba",`, `      title: "Doprava a platba",`],
  [`          "Jaké nabízíte možnosti dopravy a jak rychle balíček dorazí?",
          "Odesíláme bleskově! Zásilky předáváme dopravci zpravidla do 24 hodin. Využít " +
          "můžete Zásilkovnu, Balíkovnu, boxy PPL i doručení kurýrem přímo na adresu. " +
          "Běžná doba doručení je 1–2 pracovní dny."`,
   `          "Aké ponúkate možnosti dopravy a ako rýchlo balík dorazí?",
          "Odosielame bleskovo! Zásielky odovzdávame dopravcovi spravidla do 24 hodín. Využiť " +
          "môžete výdajné miesta, samoobslužné boxy aj doručenie kuriérom priamo na adresu. " +
          "Bežná doba doručenia je 1–2 pracovné dni."`],
  [`          "Od jaké částky mám dopravu zdarma?",
          "Dopravu zadarmo od nás získáte při nákupu nad 999 Kč."`,
   `          "Od akej sumy mám dopravu zadarmo?",
          "Dopravu zadarmo od nás získate pri nákupe nad {{SK_DOPRAVA_ZADARMO_OD}}."`],
  [`          "Jaké způsoby platby podporujete?",
          "Zaplatit můžete pohodlně kartou online, rychlým bankovním převodem, přes " +
          "Apple Pay / Google Pay nebo na dobírku při převzetí."`,
   `          "Aké spôsoby platby podporujete?",
          "Zaplatiť môžete pohodlne kartou online, rýchlym bankovým prevodom, cez " +
          "Apple Pay / Google Pay alebo na dobierku pri prevzatí."`],

  [`      title: "Výměna, vrácení a reklamace",`, `      title: "Výmena, vrátenie a reklamácie",`],
  [`          "Co když netrefím velikost nebo ponožky jako dárek nesednou?",
          "Žádný strach. Nenošené a nepoužité ponožky v původním obalu a s cedulkou " +
          "můžete snadno vyměnit nebo vrátit do 120 dnů od převzetí."`,
   `          "Čo ak netrafím veľkosť alebo ponožky ako darček nesadnú?",
          "Žiadny strach. Nenosené a nepoužité ponožky v pôvodnom obale a s visačkou " +
          "môžete jednoducho vymeniť alebo vrátiť do 120 dní od prevzatia."`],
  [`          "Jak postupovat při vrácení nebo výměně zboží?",
          "Stačí vyplnit náš jednoduchý <a href=\\"/cms/60957-vraceni-zbozi\\">online " +
          "formulář</a>, ponožky zabalit a poslat nám je zpět. Jakmile balíček dorazí, " +
          "obratem vám pošleme novou velikost nebo vrátíme peníze na účet."`,
   `          "Ako postupovať pri vrátení alebo výmene tovaru?",
          "Stačí vyplniť náš jednoduchý <a href=\\"/cms/60957-vraceni-zbozi\\">online " +
          "formulár</a>, ponožky zabaliť a poslať nám ich späť. Hneď ako balík dorazí, " +
          "obratom vám pošleme novú veľkosť alebo vrátime peniaze na účet."`],

  [`      title: "Původ zboží a certifikace",`, `      title: "Pôvod tovaru a certifikácie",`],
  [`          "Kde se vaše ponožky vyrábějí?",
          "90 % produktů vyrábíme přímo my v naší pletárně v Třeboni, zbytek se vyrábí " +
          "také v ČR."`,
   `          "Kde sa vaše ponožky vyrábajú?",
          "90 % produktov vyrábame priamo my v našej pletiarni v Třeboni, zvyšok sa vyrába " +
          "tiež v Českej republike."`],
  [`          "Jsou použité materiály bezpečné a certifikované?",
          "Určitě. Všechny používané bavlněné příze i doplňková vlákna splňují přísné " +
          "normy (např. OEKO-TEX Standard 100). Ponožky jsou tak zcela zdravotně " +
          "nezávadné a příjemné i pro citlivou pokožku."`,
   `          "Sú použité materiály bezpečné a certifikované?",
          "Určite. Všetky používané bavlnené priadze aj doplnkové vlákna spĺňajú prísne " +
          "normy (napr. OEKO-TEX Standard 100). Ponožky sú tak úplne zdravotne " +
          "nezávadné a príjemné aj pre citlivú pokožku."`],

  [`      title: "Slevy a newsletter",`, `      title: "Zľavy a newsletter",`],
  [`          "Jak mohu získat slevu na první nákup?",
          "Stačí se přihlásit k odběru našeho newsletteru dole v patičce webu. Do " +
          "e-mailu vám ihned pošleme slevový kód a navíc budete vědět o všech novinkách " +
          "a tajných akcích jako první."`,
   `          "Ako môžem získať zľavu na prvý nákup?",
          "Stačí sa prihlásiť na odber nášho newslettera dole v pätičke webu. Do " +
          "e-mailu vám ihneď pošleme zľavový kód a navyše budete vedieť o všetkých novinkách " +
          "a tajných akciách ako prví."`],

  [`      title: "Velkoobchod a zakázková výroba (B2B)",`, `      title: "Veľkoobchod a zákazková výroba (B2B)",`],
  [`          "Jak se stát vaším velkoobchodním partnerem a získat VO ceník?",
          "Stačí vyplnit náš <a href=\\"/cms/60945-velkoobchodni-spoluprace\\">B2B " +
          "formulář</a> nebo nám poslat poptávku na <a " +
          "href=\\"mailto:david@modacapek.cz\\">david@modacapek.cz</a> s vaším IČO. Po " +
          "krátkém ověření vám obratem zpřístupníme velkoobchodní ceník a nákupní " +
          "podmínky."`,
   `          "Ako sa stať vaším veľkoobchodným partnerom a získať VO cenník?",
          "Stačí vyplniť náš <a href=\\"/cms/60945-velkoobchodni-spoluprace\\">B2B " +
          "formulár</a> alebo nám poslať dopyt na <a " +
          "href=\\"mailto:david@modacapek.cz\\">david@modacapek.cz</a> s vaším IČO. Po " +
          "krátkom overení vám obratom sprístupníme veľkoobchodný cenník a nákupné " +
          "podmienky."`],
  [`          "Jaké je minimální množství pro velkoobchodní odběr z e-shopu (MOQ)?",
          "Minimální množství nemáme stanoveno."`,
   `          "Aké je minimálne množstvo pre veľkoobchodný odber z e-shopu (MOQ)?",
          "Minimálne množstvo nemáme stanovené."`],
  [`          "Vyrábíte ponožky přímo na zakázku (s vlastním logem nebo designem)?",
          "Ano! <a href=\\"/cms/56958-vyroba-na-zakazku\\">Zakázková výroba</a> na míru je " +
          "naše specialita. Vyrobíme pro vás originální ponožky jako firemní dárek pro " +
          "zaměstnance a obchodní partnery, nebo jako merch pro váš klub či značku."`,
   `          "Vyrábate ponožky priamo na zákazku (s vlastným logom alebo dizajnom)?",
          "Áno! <a href=\\"/cms/56958-vyroba-na-zakazku\\">Zákazková výroba</a> na mieru je " +
          "naša špecialita. Vyrobíme pre vás originálne ponožky ako firemný darček pre " +
          "zamestnancov a obchodných partnerov, alebo ako merch pre váš klub či značku."`],
  [`          "Od kolika párů realizujete zakázkovou výrobu?",
          "Vlastní designy vyplétáme už od 50 párů od jednoho vzoru. Při vyšších " +
          "objemech pak nabízíme výrazné množstevní slevy."`,
   `          "Od koľkých párov realizujete zákazkovú výrobu?",
          "Vlastné dizajny pletieme už od 50 párov od jedného vzoru. Pri vyšších " +
          "objemoch potom ponúkame výrazné množstevné zľavy."`],
  [`          "Pomůžete nám s grafickým návrhem zakázkových ponožek?",
          "Rádi! Nemusíte mít hotové podklady od grafika. Stačí nám poslat logo, " +
          "firemní barvy nebo hrubý nápad a náš tým pro vás zdarma připraví vizuální " +
          "návrhy ke schválení."`,
   `          "Pomôžete nám s grafickým návrhom zákazkových ponožiek?",
          "Radi! Nemusíte mať hotové podklady od grafika. Stačí nám poslať logo, " +
          "firemné farby alebo hrubý nápad a náš tím pre vás zadarmo pripraví vizuálne " +
          "návrhy na schválenie."`],
  [`          "Je možné získat vzorky před spuštěním větší výroby?",
          "Samozřejmě. Před finální zakázkou vám rádi zašleme vzorky, abyste si mohli " +
          "osahat materiál, pružnost lemu a prověřit kvalitu úpletu."`,
   `          "Je možné získať vzorky pred spustením väčšej výroby?",
          "Samozrejme. Pred finálnou zákazkou vám radi zašleme vzorky, aby ste si mohli " +
          "osahať materiál, pružnosť lemu a preveriť kvalitu úpletu."`],
  [`          "Zajišťujete i vlastní etikety a balení (private label)?",
          "Ano, kompletace je součástí našich služeb. Ponožky opatříme vaší vlastní " +
          "papírovou etiketou, čárovým kódem nebo je zabalíme do stylových dárkových " +
          "krabiček."`,
   `          "Zaisťujete aj vlastné etikety a balenie (private label)?",
          "Áno, kompletizácia je súčasťou našich služieb. Ponožky opatríme vašou vlastnou " +
          "papierovou etiketou, čiarovým kódom alebo ich zabalíme do štýlových darčekových " +
          "krabičiek."`],
  [`          "Jaká je dodací lhůta u velkoobchodních a zakázkových objednávek?",
          "Zboží ze skladu odesíláme do 1–2 pracovních dnů. Zakázková výroba od " +
          "schválení grafického návrhu trvá obvykle 3–6 týdnů v závislosti na velikosti " +
          "zakázky a sezóně."`,
   `          "Aká je dodacia lehota pri veľkoobchodných a zákazkových objednávkach?",
          "Tovar zo skladu odosielame do 1–2 pracovných dní. Zákazková výroba od " +
          "schválenia grafického návrhu trvá zvyčajne 3–6 týždňov v závislosti od veľkosti " +
          "zákazky a sezóny."`]
];
