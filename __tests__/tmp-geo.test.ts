import fs from 'node:fs';
import { catalogue } from './catalogue';
import { foldPlace } from '../src/domain/gazetteer';

const SP = 'C:/Users/morea/AppData/Local/Temp/claude/C--Users-morea-Documents-Golf-2026-Member-Member-Analysis/ea6eaf9f-854a-4f18-a360-a8925ec97a2e/scratchpad';
const lines = (f: string) => fs.readFileSync(`${SP}/${f}`, 'utf8').split('\n').filter((l) => l && !l.startsWith('#'));

it('cities gain', () => {
  const iso = new Map<string, string>();
  for (const l of lines('countryInfo.txt')) { const c = l.split('\t'); if (c[0] && c[4]) iso.set(foldPlace(c[4]), c[0]); }
  const known = new Set<string>();
  for (const f of ['admin1CodesASCII.txt', 'admin2Codes.txt']) for (const l of lines(f)) {
    const c = l.split('\t'); known.add(foldPlace(c[1])); known.add(foldPlace(c[2] ?? ''));
  }
  // cities15000: name(1) asciiname(2) ... country(8) admin1(10) admin2(11) population(14)
  const cityByName = new Map<string, { cc: string; a1: string; a2: string; name: string }[]>();
  for (const l of lines('cities15000.txt')) {
    const c = l.split('\t');
    const e = { cc: c[8], a1: c[10], a2: c[11], name: c[1] };
    for (const k of new Set([foldPlace(c[1]), foldPlace(c[2])])) if (k) cityByName.set(k, [...(cityByName.get(k) ?? []), e]);
  }
  console.log(`cities15000: ${cityByName.size} distinct names`);

  let newlyResolved = 0, withA2 = 0, withA1 = 0;
  const sample: string[] = [];
  for (const d of catalogue.filter((x) => x.loc.region.trim())) {
    const key = foldPlace(d.loc.region);
    if (known.has(key)) continue;                    // already handled by admin1/admin2
    const cc = iso.get(foldPlace(d.loc.country));
    const hit = cityByName.get(key)?.find((c) => c.cc === cc);
    if (!hit) continue;
    newlyResolved++;
    if (hit.a1) withA1++;
    if (hit.a2) withA2++;
    if (sample.length < 10) sample.push(`${d.loc.country} › ${d.loc.region}  (a1=${hit.a1} a2=${hit.a2})`);
  }
  console.log(`regions that are a city, not an admin area: ${newlyResolved}`);
  console.log(`   with a state code:    ${withA1}`);
  console.log(`   with a district code: ${withA2}`);
  sample.forEach((s) => console.log('   ' + s));
  expect(1).toBe(1);
});
