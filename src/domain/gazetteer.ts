/**
 * Whether a place name is a place, decided by looking it up instead of guessing.
 *
 * `place.ts` answers the same question with rules — does it contain a food word, is
 * it a bare nationality, is anything in it capitalised. Those rules were written
 * because there was nothing to check against, and they work: they removed 1,144
 * category titles that were never places. What they cannot do is tell a real place
 * from a plausible-looking string. "Goan" and "Goa" both pass every one of them.
 *
 * GeoNames is the thing to check against. Two files, 51,456 administrative areas,
 * CC BY 4.0 — the same footing as the photographs and the EU register.
 *
 * ## What the lookup adds that the rules could not
 *
 *   - **3,969** regions confirmed as a real first-level unit of the country they are
 *     filed under. That is not a rule passing; that is the place existing.
 *   - **146** regions that name a real place **in a different country** — "India ›
 *     Algeria". Every rule in `place.ts` passes that string, because the fault is not
 *     in the words.
 *   - **87** records whose region is really a district, so the state above it can be
 *     filled in: "India › Hyderabad" becomes "India › Telangana › Hyderābād". That is
 *     a level of depth the record already implied and could not state.
 *
 * ## Why this does not replace `place.ts`
 *
 * A name absent from the gazetteer is not thereby not a place. Historical regions
 * (Old Hyderabad State), cross-border ones (Bengal, Kashmir) and cultural spans
 * (Western India) are all missing from a list of current administrative units, and
 * all of them are real answers to "where is this from". So absence here is not
 * evidence of a fault, and this module never rejects on it — it confirms, and it
 * contradicts. `place.ts` still refuses the shelves and the nationalities.
 */

/** One place, as GeoNames records it. */
export interface Area {
  /**
   * "IN.13" for a state, "IN.13.518" for a district beneath it, and the same shape
   * for a town — a town's code is the code of the district it sits in, which is what
   * lets the levels above it be read straight off.
   */
  code: string;
  name: string;
  /** ISO-3166-1 alpha-2, taken from the first part of the code. */
  country: string;
  /** 1 state or province, 2 district, 3 town or city. */
  level: 1 | 2 | 3;
}

export interface Gazetteer {
  /** Every area by its code, so a district can find the state above it. */
  byCode: ReadonlyMap<string, Area>;
  /** Folded name to the areas that bear it — names are not unique. */
  byName: ReadonlyMap<string, readonly Area[]>;
  /** Folded country name to ISO code. */
  countryCode: ReadonlyMap<string, string>;
}

/**
 * A place name reduced to what two spellings of it have in common.
 *
 * Brackets go first and deliberately: the imports carry "Telangana State (India)",
 * where the parenthetical is a disambiguator from the source's own index rather than
 * part of the name. Diacritics go because the two sources disagree about them —
 * GeoNames holds "Hyderābād" and the catalogue holds "Hyderabad", and they are the
 * same city.
 *
 * What survives is letters and digits. It is a blunt key and that is the point: it
 * is used to *propose* a match, and the country check below is what decides.
 */
export const foldPlace = (name: string): string =>
  (name ?? '')
    .replace(/\(.*?\)/g, ' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

/** What the gazetteer says about a name, given the country it was filed under. */
export type Finding =
  /** No area of that name anywhere. Says nothing: see the note at the top. */
  | { kind: 'unknown' }
  /**
   * A real place of that name, inside this country, with the levels above it read
   * off its own code. `where` is already in the app's own vocabulary.
   */
  | { kind: 'confirmed'; area: Area; where: Placement }
  /**
   * A real area of that name, but only in other countries.
   *
   * The interesting one. It means the string is a genuine place and the record has
   * it under the wrong flag, which no test of the words themselves can detect.
   */
  | { kind: 'elsewhere'; found: readonly Area[] }
  /**
   * Several places of that name in this country, at the same level, sitting under
   * different parents.
   *
   * India has a Bilaspur in Himachal Pradesh and a Bilaspur in Chhattisgarh. Both are
   * real, the country is right, and there is no way to tell from the name which one a
   * dish comes from. Filling in either state would be inventing a fact — so this is a
   * refusal, and the record keeps the region it already had.
   *
   * Deliberately not resolved by population, distance or any other tie-break. The
   * likeliest answer is still a guess, and a guess written into `region` reads to a
   * reader exactly like something somebody checked.
   */
  | { kind: 'ambiguous'; found: readonly Area[] };

/**
 * Where a place sits in the record's own hierarchy.
 *
 * The app's levels are country, region, province, city, village. `region` is the
 * first-level unit and `province` the district beneath it, which is exactly the shape
 * GeoNames publishes — so a match at any level can state the levels above it too.
 *
 * Only ever the fields it can fill. Nothing is cleared, and `village` is never
 * written: no administrative list knows which village a dish comes from, and the one
 * that does is somebody who cooks there.
 */
export interface Placement {
  region?: string;
  province?: string;
  city?: string;
}

/**
 * Look a place up within the country the record claims.
 *
 * Prefers the coarsest match when a name belongs to several levels, because a record
 * saying "Kerala" means the state and not the district that shares its name. That is
 * also the safe direction to be wrong in: naming the state of a dish that is really
 * from one town is imprecise, and naming a town for a dish from the whole state is
 * false.
 */
export function lookUp(region: string, country: string, gazetteer: Gazetteer): Finding {
  const key = foldPlace(region);
  if (!key) return { kind: 'unknown' };

  const found = gazetteer.byName.get(key);
  if (!found?.length) return { kind: 'unknown' };

  const code = gazetteer.countryCode.get(foldPlace(country));
  const here = code ? found.filter((area) => area.country === code) : [];
  if (!here.length) return { kind: 'elsewhere', found };

  const coarsest = Math.min(...here.map((a) => a.level));
  const tied = here.filter((a) => a.level === coarsest);

  /*
   * Two places of the same name and level are only a problem when they sit under
   * different parents. GeoNames lists a town under both its district and its state in
   * some countries, and those duplicates agree about where they are — agreeing
   * duplicates are one answer, not two.
   */
  const placements = tied.map((a) => climb(a, gazetteer));
  const distinct = new Set(placements.map((p) => `${p.region ?? ''}|${p.province ?? ''}|${p.city ?? ''}`));
  if (distinct.size > 1) return { kind: 'ambiguous', found: tied };

  return { kind: 'confirmed', area: tied[0], where: placements[0] };
}

/**
 * Read the levels above a place off its own code.
 *
 * `IN.28.332` is a district of `IN.28`, and a town carrying that code sits in both.
 * Walking the prefixes is how a town match yields a district and a state without a
 * second lookup — and it cannot drift out of step with the data, because the codes
 * *are* the hierarchy rather than a copy of it.
 */
function climb(area: Area, gazetteer: Gazetteer): Placement {
  const parts = area.code.split('.');
  const at = (depth: number) => gazetteer.byCode.get(parts.slice(0, depth).join('.'))?.name;

  if (area.level === 1) return { region: area.name };
  if (area.level === 2) {
    const region = at(2);
    return region ? { region, province: area.name } : { province: area.name };
  }

  // A town. Its own code names the district it sits in, and the state above that.
  const where: Placement = { city: area.name };
  const region = at(2);
  const province = parts.length > 2 ? at(3) : undefined;
  if (region) where.region = region;
  if (province) where.province = province;
  return where;
}

/** The placement of a confirmed finding, or nothing. */
export const placement = (finding: Finding): Placement =>
  finding.kind === 'confirmed' ? finding.where : {};
