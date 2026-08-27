/**
 * One address for one site, without paying a Function to say so.
 *
 * Run as a build step, after the export.
 *
 * The atlas answers on two hosts — `wikifoodia.pages.dev`, which Cloudflare gives every
 * Pages project and cannot be switched off, and `wikifoodia.ajailabs.app`, which is the
 * one to share. Identical content on two URLs splits inbound links and leaves a search
 * engine to pick a winner on its own.
 *
 * ## Two things that did not work, both tested rather than assumed
 *
 * A `_redirects` rule with the hostname in the source is the obvious answer and Cloudflare
 * Pages ignores it. The syntax is Netlify-compatible and hostname support is precisely
 * where the two differ; deployed and measured, `pages.dev` still answered 200 with the
 * page rather than a 301. `public/_redirects` carries that finding.
 *
 * A Pages Function would work. It would also put every request through the Worker — the
 * 2.3 MB catalogue included — against a 100,000-a-day free allowance, to perform a
 * redirect. Scoping it with `_routes.json` would keep that to page views, but it is a
 * running cost and a moving part for something with no server in it.
 *
 * ## So: the client does it, and it costs nothing
 *
 * Two lines of inline script in the head, before the bundle:
 *
 *   1. On `pages.dev`, replace the location with the same path on the canonical host.
 *      `replace` rather than `assign`, so the back button does not bounce.
 *   2. Always write `<link rel="canonical">` for the *current path*, which is the part a
 *      static tag gets wrong on a single-page app: one canonical pointing at the root
 *      would tell a crawler that every dish page is the home page.
 *
 * The redirect needs JavaScript, which the bundle needs anyway — this app renders nothing
 * without it, so there is no reader who would have been served by an HTTP redirect and is
 * not served by this one. A crawler that runs no JavaScript still gets the canonical tag
 * only if it renders; that is the honest limit of this approach, and the reason the tag is
 * written as early as possible rather than by the app itself.
 */

import { readFile, writeFile } from 'node:fs/promises';

const CANONICAL_HOST = 'wikifoodia.ajailabs.app';
const ALTERNATE_HOST = 'wikifoodia.pages.dev';

const script = `<script>(function(){try{
var canon=${JSON.stringify(CANONICAL_HOST)},alt=${JSON.stringify(ALTERNATE_HOST)};
if(location.hostname===alt){location.replace('https://'+canon+location.pathname+location.search+location.hash);return;}
var l=document.createElement('link');l.rel='canonical';
l.href='https://'+canon+location.pathname;
document.head.appendChild(l);
}catch(e){}})();</script>`;

const path = 'dist/index.html';
const html = await readFile(path, 'utf8');

if (html.includes("l.rel='canonical'")) {
  console.log('inject-canonical: already present, nothing to do.');
} else {
  const at = html.indexOf('</head>');
  if (at < 0) throw new Error('inject-canonical: no </head> in dist/index.html');
  await writeFile(path, html.slice(0, at) + script + html.slice(at), 'utf8');
  console.log(`inject-canonical: ${CANONICAL_HOST} is canonical; ${ALTERNATE_HOST} redirects.`);
}
