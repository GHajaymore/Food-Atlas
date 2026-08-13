/**
 * Web-only style shims.
 *
 * Two Nocturne behaviours have no react-native-web style equivalent, so they are
 * injected as real CSS on web and expressed as native style props elsewhere:
 *
 *   - `mix-blend-mode: lighten` on photographs (the `.lighten` treatment). RNW's
 *     style resolver drops `mixBlendMode`, so the Image carries `data-lighten` and
 *     the rule below does the work. It blends against whatever the page paints
 *     behind it — the card surface, or the page ground — exactly as the design does.
 *   - The document ground. The app's screens paint `--color-bg`, but the page behind
 *     them is transparent by default, which shows through as white around the app
 *     and, more importantly, is the backdrop the blend above composites against.
 */

import { Platform } from 'react-native';
import { color } from './tokens';

const CSS = `
html, body, #root { background-color: ${color.bg}; }
body { margin: 0; overscroll-behavior: none; }
[data-lighten="true"] { mix-blend-mode: lighten; }
/* The design hides scrollbars; the rails scroll by drag and by wheel. */
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }
`;

let injected = false;

export function installWebStyles(): void {
  if (Platform.OS !== 'web' || injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-nocturne', 'true');
  style.textContent = CSS;
  document.head.appendChild(style);
  injected = true;
}
