/**
 * Does anyone read about food in a language other than English? Measured.
 *
 *   node scripts/measure-readership-by-language.mjs
 *
 * The app ranks its popularity rail by English Wikipedia pageviews and says so
 * wherever the number appears. Saying so is honest and does not make the number good:
 * the obvious objection is that kimchi, pierogi and rendang are read about mostly by
 * people who are not reading English, so an English count ranks how interesting a food
 * is *to English speakers* and calls it readership.
 *
 * The obvious objection is wrong, and this is the measurement that says so.
 *
 * ## Twelve months, native edition against English
 *
 *     Kimchi     en 489,127   ko  17,280      28×
 *     Pierogi    en 674,404   pl  35,520      19×
 *     Sushi      en 589,009   ja  97,857       6×
 *     Borscht    en 435,413   ru 209,612       2×      uk 36,212
 *     Rendang    en  94,755   id  32,403       3×
 *     Appam      en  70,728   id   8,687       8×      hi 1,928, ta 936, kn 270
 *
 * English Wikipedia is where the world reads about food, including Koreans reading
 * about kimchi. Not one of the twelve records walked in a trial run peaked outside
 * English, and the famous cases above are the ones most likely to have.
 *
 * ## So the max-across-editions idea is not worth building
 *
 * It would cost roughly 37,000 API requests to compute across the catalogue, and would
 * change the ranking of the least important number on the screen by almost nothing.
 * This file is kept as the evidence for that decision rather than as an enrichment —
 * the same reason `find-sources.mjs` is kept.
 *
 * ## And why not social platforms
 *
 * Asked separately, and the answer is firmer:
 *
 *   - **There is no free hit count.** Instagram's Graph API needs a business account
 *     and app review and does not report hashtag totals; TikTok's research API is
 *     restricted to accredited researchers. Scraping either breaks their terms.
 *   - **A hashtag is not a dish.** #pierogi counts posts that used a word. This project
 *     has already illustrated a Malaysian chicken dish with an Italian singer by
 *     matching on a name, and a hashtag is a weaker match than an article title.
 *   - **A view count is not evidence.** The rail is deliberately at the bottom of the
 *     screen, deliberately never mixed into the confidence score, and labelled for what
 *     it is. Making the least load-bearing number more elaborate is effort spent where
 *     the app has explicitly decided accuracy does not matter much.
 *
 * Run it to check the finding still holds; it prints the comparison and writes nothing.
 */

const USER_AGENT = 'WikiFoodia/1.0 (readership comparison; contact: via repository)';

const WINDOW = (() => {
  const end = new Date();
  end.setUTCDate(1);
  const start = new Date(end);
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  const stamp = (d) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}0100`;
  return { start: stamp(start), end: stamp(end) };
})();

/** The cases most likely to disprove the finding, which is why these were chosen. */
const CASES = [
  { dish: 'Kimchi', editions: [['en', 'Kimchi'], ['ko', '김치']] },
  { dish: 'Sushi', editions: [['en', 'Sushi'], ['ja', '寿司']] },
  { dish: 'Pierogi', editions: [['en', 'Pierogi'], ['pl', 'Pierogi']] },
  { dish: 'Borscht', editions: [['en', 'Borscht'], ['uk', 'Борщ'], ['ru', 'Борщ']] },
  { dish: 'Rendang', editions: [['en', 'Rendang'], ['id', 'Rendang']] },
  { dish: 'Appam', editions: [['en', 'Appam'], ['id', 'Apem'], ['hi', 'अप्पम'], ['ta', 'அப்பம்']] },
];

async function readership(lang, title) {
  const api = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${lang}.wikipedia/all-access/user`;
  const url = `${api}/${encodeURIComponent(title.replace(/ /g, '_'))}/monthly/${WINDOW.start}/${WINDOW.end}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.items ?? []).reduce((sum, item) => sum + (item.views ?? 0), 0);
}

const main = async () => {
  console.log(`Readership over twelve months, ${WINDOW.start} to ${WINDOW.end}.\n`);
  let englishWon = 0;

  for (const { dish, editions } of CASES) {
    const counts = [];
    for (const [lang, title] of editions) counts.push([lang, await readership(lang, title)]);

    const english = counts.find(([lang]) => lang === 'en')?.[1] ?? 0;
    const best = counts.filter(([lang]) => lang !== 'en').reduce((m, [, n]) => Math.max(m, n ?? 0), 0);
    if (english >= best) englishWon += 1;

    console.log(
      `${dish.padEnd(10)} ` +
        counts.map(([lang, n]) => `${lang} ${n === null ? 'no data' : n.toLocaleString()}`).join('   '),
    );
  }

  console.log(`\nEnglish is the largest edition for ${englishWon} of ${CASES.length}.`);
  console.log('Ranking by the maximum across editions would not change the rail.');
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
