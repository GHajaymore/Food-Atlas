/**
 * What order the front page is in, which is different on a phone rather than narrower.
 *
 * Measured before anything changed: on a 375×812 screen the first photograph sat at
 * **1,167px** — 1.44 screens of chrome — on a page 3,254px tall. A reader opened an atlas
 * of eighteen thousand photographs and met a wall of text. That is the whole of what Ajay
 * meant by *"remove that initial HTML static page behaviour"*, and it was a question of
 * order rather than of content: nothing on the way down was wrong, there was simply too
 * much of it before the thing the app is for.
 *
 * ## Nothing is deleted, and the argument survives in order
 *
 * The pitch still comes first, because a first-time reader should be told what this is
 * before being shown a grid — that was a deliberate decision recorded on the old feed and
 * it still holds. What moves is everything *after* the figures: the ask, the promise and
 * the disclosure now sit below the first shelf, where a reader who is interested reaches
 * them on the first scroll gesture rather than having to get past them to see any food.
 *
 * So the order becomes: say what this is, show what it holds, then make the case.
 *
 * ## Why the ordering lives here and not in the screen
 *
 * `RecordColumns` and `SearchColumns` established the rule and its header states the
 * reason: every `wide ? a : b` inside a component is a layout decision made in the wrong
 * place, and the interactions between a dozen of them are what nobody can hold in their
 * head. A dropdown rendering behind the page was that debt coming due.
 *
 * So this takes finished pieces and decides only where they go. No piece knows the window
 * width. The wide branch returns today's sequence literally, which is what makes it
 * reviewable against the previous file and what stops the desktop drifting.
 */

import { Fragment } from 'react';
import { useLayout } from '../theme/layout';

export interface FeedParts {
  /**
   * The pitch as one composed block, for wide screens.
   *
   * Not assembled here from the parts below, and the difference is not cosmetic: on a
   * desktop `Mission` nests the pitch and figures inside a flex row alongside the ask, so
   * rendering the same pieces as siblings silently flattens the two-column hero. It did
   * exactly that on the first attempt — the callout dropped from y=79 to y=308 — which is
   * why the wide branch takes the finished composition and the phone branch takes parts.
   */
  mission: React.ReactNode;
  /** Wordmark, tagline, search — phone only; `TopBar` carries it on wide screens. */
  masthead: React.ReactNode;
  /** The headline and the sentence under it. */
  pitch: React.ReactNode;
  /** One large photograph. Phone only — a desktop already opens on a grid. */
  lead: React.ReactNode;
  /** The five descending figures. */
  figures: React.ReactNode;
  /** The tinted callout, the promise, and the disclosure. */
  argument: React.ReactNode;
  /** Place selector, authenticity chips, diet and occasion. */
  controls: React.ReactNode;
  /** The rails, already built. */
  shelves: React.ReactNode[];
  /** Browse-all, the popularity rail, the colophon. */
  tail: React.ReactNode;
}

export function FeedOrder({
  mission,
  masthead,
  pitch,
  lead,
  figures,
  argument,
  controls,
  shelves,
  tail,
}: FeedParts) {
  const { wide } = useLayout();

  const rails = shelves.map((shelf, i) => <Fragment key={i}>{shelf}</Fragment>);

  /*
   * Today's order, unchanged, and deliberately written as one readable block rather than
   * assembled conditionally. A desktop has room for the argument and the grid at once —
   * `Mission` puts them side by side — so none of the problem this file exists to solve
   * applies there, and the fix should not visit.
   *
   * `lead` is dropped: a wide screen already opens on six photographs in a grid, and a
   * seventh at hero size above them would be repetition rather than impact.
   */
  if (wide) {
    return (
      <>
        {mission}
        {controls}
        {rails}
        {tail}
      </>
    );
  }

  return (
    <>
      {masthead}
      {pitch}
      {/*
       * One photograph, then the first rail, then the case.
       *
       * The lead is what turns the opening screen from a paragraph into an atlas. It sits
       * after the pitch rather than before it because two lines of copy cost about 120px
       * and answer *what is this* — a reader who meets a photograph first has been shown
       * something without being told what they are looking at.
       */}
      {lead}
      {rails[0]}
      {figures}
      {argument}
      {controls}
      {rails.slice(1)}
      {tail}
    </>
  );
}
