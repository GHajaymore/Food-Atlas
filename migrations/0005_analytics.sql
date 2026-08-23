-- What the atlas is being used for.
--
-- ## Read this before adding a column
--
-- The app tells readers in four places — the front page and twice on /support — that
-- there is no advertising, no accounts and **no tracking**. `nearby.ts` already gave up
-- geolocation for the timezone to keep that sentence true when nobody was watching.
--
-- So this table counts *events*, never people. There is deliberately no visitor id, no
-- session, no IP, no user agent and no timestamp finer than a day, and each of those
-- absences is doing work: with any one of them present, two rows could be joined into a
-- trail, and a trail is exactly the thing the app promises not to keep.
--
-- The strongest statement this schema can make is "Kozhikode Halwa was opened 412 times
-- yesterday". It cannot answer "who opened it", "what else did they look at" or "how
-- many distinct people came", and it is not a limitation waiting to be lifted. If those
-- questions ever need answering, the honest route is Cloudflare Web Analytics — which
-- measures at the edge, sets no cookie, and never gives this application the data.
--
-- The identity cookie is scoped to /api/proposals for the same reason, so an event
-- request does not carry one at all. See functions/api/proposals/_middleware.ts.

create table if not exists event_day (
  -- YYYY-MM-DD. The finest resolution stored, on purpose: an exact time is most of a
  -- fingerprint when combined with anything else.
  day    text not null,
  -- 'dish' | 'search' | 'shelf' | 'screen' | 'propose' | 'confirm'
  kind   text not null,
  -- The dish id, the search term, the shelf title, the screen name. Never a person.
  target text not null default '',
  count  integer not null default 0,
  primary key (day, kind, target)
) without rowid;

create index if not exists event_by_kind on event_day (kind, day desc);

-- A daily total per kind, so "how busy was it" does not require scanning every target.
create index if not exists event_by_day on event_day (day desc);
