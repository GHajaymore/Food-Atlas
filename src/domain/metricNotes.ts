/**
 * What each number on the atlas page actually means.
 *
 * A number on a screen is a claim, and a claim without its method is a claim the
 * reader has to take on trust. This app asks its readers not to take a dish's
 * authenticity on trust — it shows the evidence and names the gaps — so it cannot
 * then put "13,855 traditions" in large type and decline to say what was counted.
 *
 * Three parts to every entry, and the third is the one that matters:
 *
 *   `counts`  — what a single unit is. Almost every misreading starts here.
 *   `method`  — how the figure is derived, in enough detail to be checked.
 *   `caveat`  — what the number does **not** mean. Written to disappoint: if a
 *               figure flatters the atlas, this line is where it stops.
 *
 * These are deliberately data rather than prose in a component, so that the same
 * words appear wherever a figure does and cannot drift apart from each other.
 */

export interface MetricNote {
  /** The figure's name, as shown beside it. */
  title: string;
  counts: string;
  method: string;
  caveat: string;
}

export const METRIC_NOTES: Record<string, MetricNote> = {
  total: {
    title: 'Traditions recorded',
    counts:
      'A tradition is one way of making a food in one place. The same dish made differently in two regions is two traditions, and both are kept.',
    method:
      'Every record from the curated set and the four imported sources that has something to show — a place and a name at minimum. Rows still awaiting enrichment are held back and not counted.',
    caveat:
      'This is not a count of the world’s distinct foods, and it is not a measure of how much the atlas knows. Most of these records carry a name and a country and nothing else. The share with a written method is the number that says whether this is an atlas or a list of names.',
  },

  countries: {
    title: 'Countries',
    counts: 'Distinct countries named across all records, after the import’s place names are resolved.',
    method:
      'The country field of every record, de-duplicated, counting only origins that are countries. Historical and supra-national entries a source used — the Ottoman Empire, the Levant, Mesoamerica — are kept on their records rather than reassigned to a modern state we would have to guess at, and they are not counted here. Counting them added thirty-two to this figure and every one of them was imaginary.',
    caveat:
      'Coverage is not depth. A country appears here on the strength of a single record, so this counts where the atlas has been rather than where it is any good. Read it next to the concentration figure below, which says how lopsided the total is.',
  },

  atRisk: {
    title: 'At-risk traditions',
    counts: 'Records where a source’s own words describe the tradition as declining, disappearing or no longer practised.',
    method:
      'Detected by reading each article’s introduction and history for stated decline — "now rarely made", "the last remaining producer" — and rejecting near-misses that mean something else, such as an endangered species used as an ingredient or a closed restaurant chain. The sentence that triggered it is stored on the record as evidence and is shown with it.',
    caveat:
      'This is a floor, not a census, and it is far below the truth. It can only find decline that somebody already wrote down in a text we have read; a tradition held by four families and never documented registers as nothing at all. Slow Food’s Ark of Taste alone lists roughly six thousand endangered foods, which is a thousand times this figure.',
  },

  documented: {
    title: 'Has a recorded method',
    counts: 'Records carrying an ordered method — the steps someone would follow to make it.',
    method:
      'Curated records have a method written and checked with the community. Imported ones have it only where a published recipe exists for them; an encyclopaedia paragraph describing how a dish is generally made is stored as prose and deliberately not promoted to steps, because presenting a description as a method claims a precision it does not have.',
    caveat:
      'A method being present says nothing about whether it is the traditional one. That is what the confidence score is for, and most records with a method are classified Modern Adaptation.',
  },

  located: {
    title: 'Placed below country level',
    counts: 'Records that name a region, province, city or village, not only a country.',
    method: 'Any record whose place has a level filled in beneath the country.',
    caveat:
      'Authenticity has geographic depth, and a country is barely a start — "Kozhikode" is a record, "India" is a heading. A high total with a low share here describes an atlas that is wide and shallow.',
  },

  illustrated: {
    title: 'Has a photograph',
    counts: 'Records with an image the app has the right to display.',
    method:
      'From Wikidata, from the dish’s own Wikipedia article, or contributed by a cook through Wikimedia Commons. Every one is stored with its photographer and licence, and none is marked verified: an image found by name or chosen by an editor is good evidence that it shows the dish, not this app’s confirmation of it.',
    caveat:
      'A photograph is not evidence of authenticity. It shows a plate somebody cooked, which may or may not be the tradition the record describes.',
  },

  filmed: {
    title: 'Has a ranked video',
    counts: 'Records with at least one video, ordered by how close the cook is to the tradition.',
    method:
      'Ranked by locality — where the cook is, what language they speak in, whether the ingredients and equipment match the record. Never by views, likes or subscribers.',
    caveat:
      'The ranking is about proximity to the tradition, not quality of filming, and the top video is often the least polished one.',
  },

  assessed: {
    title: 'Classified as authentic',
    counts: 'Records that reached Authentic — Local or Authentic — Regional through the evidence checks.',
    method:
      'Seven checks, each answered or left open, with open checks lowering confidence rather than being filled in by assumption. Technique and community validation are never inferred from an import, which caps what an imported record can reach on its own.',
    caveat:
      'A low share here is honest rather than a failure. Most of the catalogue is imported and unassessed, and calling those records authentic because they came from a reputable source is exactly the shortcut this scale exists to refuse.',
  },

  concentration: {
    title: 'Concentration',
    counts: 'The share of the whole catalogue held by its single largest country.',
    method: 'Records in the most-represented country, over the total.',
    caveat:
      'This reflects which countries keep open food registries, not where the world’s food is. Italy alone publishes roughly 4,400 registered traditional products; most countries publish none, and their absence here is an absence of paperwork rather than of cooking.',
  },

  confidence: {
    title: 'Confidence',
    counts: 'How the catalogue is distributed across the 0–100 evidence score.',
    method:
      'Curated records are scored by the evidence checks. Imported records are scored only where enrichment found evidence to score, and are otherwise left unscored rather than given a default.',
    caveat:
      '"Not scored" is by far the largest band and will stay that way. It means nobody has assessed the record yet — not that it scored badly, and not that the food is doubtful.',
  },

  byContinent: {
    title: 'Where the records are',
    counts:
      'Records per continent, counting every record once. A tradition sits on the continent of the country it is recorded in, not the one it may have travelled from.',
    method:
      'From each record’s country, through a country-to-continent map that covers around 200 states including historical ones. Supra-national and disputed entries are grouped rather than forced into a continent.',
    caveat:
      'This is a map of the sources, not of the world’s cooking. Europe leads because European registries are online and open, which is a fact about archives.',
  },
};

/** The note for a figure, or undefined where none has been written. */
export const metricNote = (key: string): MetricNote | undefined => METRIC_NOTES[key];
