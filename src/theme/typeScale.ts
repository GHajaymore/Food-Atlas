/**
 * Whether type is being set for a wide window, shared once.
 *
 * ## Why a context and not the layout hook
 *
 * Every text primitive needs to know this, and the front page has 442 of them. Calling
 * `useLayout()` in each would mean 442 subscriptions to window resize — on web, 442
 * listeners re-running on every frame of a drag. The information is one boolean that is
 * identical for all of them, so it is read once at the root and handed down.
 *
 * The default is `false`, which is the phone scale. A text component rendered outside the
 * provider therefore gets the sizes this design system was originally written in, rather
 * than nothing — the failure mode is "looks like the old build", not "invisible".
 */

import { createContext, useContext } from 'react';

export const WideTypeContext = createContext(false);

/** True when the window is tablet-width or larger. See `wideType` in tokens.ts. */
export const useWideType = (): boolean => useContext(WideTypeContext);
