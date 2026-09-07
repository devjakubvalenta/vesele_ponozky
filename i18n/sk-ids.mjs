/* Převodní mapa identifikátorů: český shop 28056 → slovenský shop 28711.
   Zjištěno naživo 2026-09-02 čtením obou shopů (menu, CMS odkazy, dlaždice HP).

   ⚠️ MÉDIA SE NEMĚNÍ. Cesta /files/310/ je ID účtu, ne shopu — oba shopy jedou
   pod stejným účtem, takže všech 195 odkazů na obrázky funguje na SK beze
   změny a 89 souborů se nemusí znovu nahrávat. */

export const CMS = {
  "56952": "61597", // O nás
  "56955": "61600", // Doprava a platba
  "56958": "61603", // Výroba na zakázku
  "60945": "61606", // Velkoobchodní spolupráce
  "60954": "61609", // Recenze
  "60948": "61612", // Výroba
  "60957": "61618", // Vrácení zboží
  "60951": "61621", // GDPR
  "60969": "61624"  // Kontakty
};

/* Kategorie. Pozor: česká ID pod slovenským prefixem vracejí HTTP 200, ale
   bez <h1> a s výpisem všech 569 produktů — tiše spadnou na „všechno zboží“.
   Rozbitý odkaz se tedy nepozná podle stavového kódu, jen podle obsahu. */
export const KATEGORIE = {
  "1243142": "1254445", // Výprodej až -90 %
  "1243139": "1254442", // Dárkové sety
  "1196952": "1254445"  // Katalog (root) — na SK samostatný root není, míříme na Výprodej
};

/* Čtyři barevné dlaždice na HP (a stejné kategorie v mobilním menu).
   Na českém shopu jsou to samostatné kategorie 1243445/1243460/1243463/1243517,
   které na slovenském shopu NEEXISTUJÍ — duplikace je nepřenesla. Slovenský
   strom má MultiPACK/Zdravotnictví/Kávu jen jako podkategorie pod Pánské,
   Dámské a Dětské, takže jedna „ta správná“ neexistuje.

   Do doby, než uživatel v SK administraci ty čtyři kategorie založí, míří
   mobilní menu na čtyři hlavní kategorie, které na SK existují a dávají smysl.
   Až vzniknou, stačí přepsat ID tady a přegenerovat. */
export const SIDE_CATEGORIES_SK = [
  { id: "1254433", color: "c1", name: "Pánske Veselé ponožky" },
  { id: "1254436", color: "c2", name: "Dámske Veselé ponožky" },
  { id: "1254439", color: "c3", name: "Detské Veselé ponožky" },
  { id: "1254442", color: "c4", name: "Darčekové sety" }
];

/* Produktové bloky (%recommend_block_<ID>%). Na SK zatím neexistují — uživatel
   je musí v administraci založit a ID sem doplnit. Do té doby zůstávají
   v obsahu placeholdery {{SK_BLOK_AKCE}} a {{SK_BLOK_SETY}}. */
export const BLOKY = {
  "3224": null, // „To nejlepší právě v akci“
  "3236": null  // „Dárkové sety“
};

/* Cesty ke kategoriím používané v kódu (SHOW_ALL, HP_ALL_PATH, PRICE_FIRST). */
export const CESTY = {
  "/c/1243142-vyprodej-az-90": "/c/1254445-vyprodej-az-90",
  "/c/1243139-darkove-sety": "/c/1254442-darkove-sety"
};
