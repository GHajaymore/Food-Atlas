/**
 * The world outlines, fetched once and shared by every map on the site.
 *
 * Written by `scripts/make-world-map.mjs`: finished SVG paths on a 1000-wide Equal Earth
 * canvas, keyed by ISO alpha-2, with each country's main landmass bounds (`b`) so a
 * country page can centre on it. Loaded only by a screen that draws a map, and only
 * once per visit — the Food Atlas and every country page share the one copy.
 */

import { useEffect, useState } from 'react';
import { dataUrl } from '../data/catalogue';

export interface MapData {
  width: number;
  height: number;
  countries: { a2: string; d: string; b: [number, number, number, number] }[];
  dots: { a2: string; c: [number, number] }[];
}

/** The fill of land with nothing recorded, and of the neighbours on a country's map. */
export const EMPTY_LAND = '#23263a';

let cached: MapData | null = null;
let pending: Promise<MapData | null> | null = null;

const load = () =>
  (pending ??= fetch(dataUrl('world-map.json'))
    .then((r) => (r.ok ? (r.json() as Promise<MapData>) : null))
    .then((data) => (cached = data))
    /* No map is a smaller page, not a broken one: nothing on any page is reachable
       only through it. */
    .catch(() => null));

export function useWorldMap(): MapData | null {
  const [map, setMap] = useState<MapData | null>(cached);
  useEffect(() => {
    if (cached) return;
    let live = true;
    load().then((data) => {
      if (live && data) setMap(data);
    });
    return () => {
      live = false;
    };
  }, []);
  return map;
}
