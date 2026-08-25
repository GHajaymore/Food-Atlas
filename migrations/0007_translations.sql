-- Translations, cached, and the meter that stops them costing money.
--
-- ## Why a cache is not an optimisation here
--
-- This is the only part of the project that spends anything. Everything else — the
-- catalogue, the photographs, the whole 14 MB of records — is static files on a CDN with
-- no runtime and no bill. A translation is different: it is a model call, and a model
-- call has a price.
--
-- Without a cache the cost is unbounded in the wrong variable. It would scale with
-- *readers*: the thousandth person to open the same Kozhikode record in Spanish would
-- pay for the same sentences the first one already paid for. With a cache it scales with
-- *content*, and content is finite — 17,774 records times twelve languages is a ceiling
-- that exists whether anybody visits or not, and in practice almost none of it will ever
-- be asked for.
--
-- So the row here is (record, language), written once and read for ever.
--
-- ## Why there is also a meter
--
-- A cache bounds the total. It does not bound the *rate*, and the endpoint is public: a
-- script asking for every record in every language would work through the whole ceiling
-- in an afternoon and bill for it.
--
-- `translation_day` is a counter with one row per day. The endpoint refuses past a
-- configured limit and says so plainly. That is a worse experience for whoever asks the
-- 501st translation of the day, and it is the correct trade for a project that collects
-- no money: the app must not be able to run up a bill Ajay did not agree to, and a limit
-- that lives in the database cannot be forgotten the way a note in a README can.

CREATE TABLE IF NOT EXISTS translation (
  -- The record this belongs to. Not a foreign key: the catalogue lives in files, not in
  -- this database, so there is nothing here to reference.
  dish_id INTEGER NOT NULL,
  -- BCP-47, as the app's language picker uses.
  lang TEXT NOT NULL,
  -- The serialised DishTranslation. Stored whole rather than split into columns because
  -- this layer never reads inside it — the app parses it and the app owns its shape.
  body TEXT NOT NULL,
  -- Which model produced it. Shown to the reader beside the translation, so a record
  -- translated by one model does not silently look like one translated by another.
  translator TEXT NOT NULL,
  -- Date only, for the same reason `event_day` has no finer stamp: this table must not
  -- become a record of when somebody read something.
  made_on TEXT NOT NULL,
  PRIMARY KEY (dish_id, lang)
);

-- One row per day. `spent` counts model calls that actually happened; a cache hit is not
-- a call and does not count.
CREATE TABLE IF NOT EXISTS translation_day (
  day TEXT PRIMARY KEY,
  spent INTEGER NOT NULL DEFAULT 0
);
