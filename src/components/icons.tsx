/**
 * Icons — Phosphor, regular weight.
 *
 * The design specifies Phosphor (https://phosphoricons.com) at regular weight, and
 * the handoff asks for the official package for the platform. This module is the one
 * place that imports it, so the icon set is swappable and every call site gets the
 * same defaults: regular weight, accent-or-inherited colour, and the size the design
 * names at that spot.
 */

import {
  BookmarkSimple,
  Camera,
  CaretDown,
  CaretLeft,
  MagnifyingGlass,
  MapPin,
  Play,
} from 'phosphor-react-native';
import { color } from '../theme/tokens';

export interface IconProps {
  size?: number;
  color?: string;
  /** Phosphor's filled variant, used only for the play glyph inside the badge. */
  weight?: 'regular' | 'fill';
}

const make =
  (Glyph: typeof CaretLeft) =>
  ({ size = 18, color: c = color.text, weight = 'regular' }: IconProps = {}) => (
    <Glyph size={size} color={c} weight={weight} />
  );

export const CaretLeftIcon = make(CaretLeft);
export const BookmarkIcon = make(BookmarkSimple);
export const SearchIcon = make(MagnifyingGlass);
export const MapPinIcon = make(MapPin);
export const PlayIcon = make(Play);
export const CaretDownIcon = make(CaretDown);
export const CameraIcon = make(Camera);
