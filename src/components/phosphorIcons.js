/*
 * The seven icons this app uses, each from its own module rather than the package root.
 *
 * Importing them from 'phosphor-react-native' put the whole library in the bundle: 3,024
 * icons in six weights, 5.6 MB, 77% of the JavaScript every reader downloaded before the
 * first screen. Metro does not drop unused exports, so a named import from the root is an
 * import of everything behind it. These per-icon paths are the package's own published
 * entry points.
 *
 * Plain JavaScript on purpose, with `phosphorIcons.d.ts` beside it. The per-icon modules
 * are the package's TypeScript source, and importing them from a .tsx file made tsc
 * type-check the library itself, which does not compile against this app's
 * react-native-svg. The declaration file gives the compiler the package's public types
 * and stops it there; the bundler reads this file.
 *
 * Adding an icon is a line here and a line in the .d.ts.
 */
export { BookmarkSimple } from 'phosphor-react-native/src/icons/BookmarkSimple';
export { Camera } from 'phosphor-react-native/src/icons/Camera';
export { CaretDown } from 'phosphor-react-native/src/icons/CaretDown';
export { CaretLeft } from 'phosphor-react-native/src/icons/CaretLeft';
export { MagnifyingGlass } from 'phosphor-react-native/src/icons/MagnifyingGlass';
export { MapPin } from 'phosphor-react-native/src/icons/MapPin';
export { Play } from 'phosphor-react-native/src/icons/Play';
