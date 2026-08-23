/**
 * `GET /api/analytics` — what the atlas is being used for. Administrator only.
 *
 * Reads what `events.ts` counted. Everything here is a fact about a *dish*, a *search
 * term* or a *day* — never about a person, because `event_day` holds nothing that could
 * be. See the header of `migrations/0005_analytics.sql` for why that is a schema
 * decision rather than a habit.
 *
 * Administrator-gated even though it identifies nobody, for a reason that has nothing to
 * do with privacy: the top-searched terms are a live map of what readers cannot find,
 * which is competitive information about a project that is trying to be the place people
 * look. It costs nothing to keep it to one person.
 *
 * `?days=` bounds every query. Without it the first slow month turns the admin screen
 * into a table scan of every event the atlas has ever recorded.
 */

import { admin, type AdminEnv } from './_admin';

interface Env extends AdminEnv {
  DB: D1Database;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const who = await admin(request, env);
  if (!who.ok) return who.response;

  const asked = Number(new URL(request.url).searchParams.get('days') ?? 30);
  const days = Math.max(1, Math.min(365, Number.isFinite(asked) ? asked : 30));
  const since = `-${days} days`;

  const top = (kind: string, limit: number) =>
    env.DB.prepare(
      `select target, sum(count) as n
         from event_day
        where kind = ? and day > date('now', ?)
        group by target
        order by n desc
        limit ?`,
    )
      .bind(kind, since, limit)
      .all<{ target: string; n: number }>();

  const [dishes, searches, screens, shelves, byKind, byDay] = await Promise.all([
    top('dish', 25),
    top('search', 25),
    top('screen', 15),
    top('shelf', 15),
    /* Totals per kind — the "how much of anything happened" line. */
    env.DB.prepare(
      `select kind, sum(count) as n
         from event_day
        where day > date('now', ?)
        group by kind
        order by n desc`,
    )
      .bind(since)
      .all<{ kind: string; n: number }>(),
    /*
     * A day-by-day series, so a trend is visible rather than only a total. Capped at 60
     * points because nothing readable is drawn from more than that on a phone.
     */
    env.DB.prepare(
      `select day, sum(count) as n
         from event_day
        where day > date('now', ?)
        group by day
        order by day desc
        limit 60`,
    )
      .bind(since)
      .all<{ day: string; n: number }>(),
  ]);

  const rows = <T>(r: { results?: T[] }) => r.results ?? [];

  return json({
    days,
    /*
     * Named `events`, not `visits`. The distinction is the whole point: this is a count
     * of things that happened, and the app cannot say how many people they happened to.
     */
    totals: rows(byKind),
    byDay: rows(byDay).reverse(),
    topDishes: rows(dishes),
    topSearches: rows(searches),
    topScreens: rows(screens),
    topShelves: rows(shelves),
  });
};
