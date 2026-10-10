/**
 * The photograph a list may show for a record — which is not always the record's own.
 *
 * 1,681 photographs were found by searching Wikimedia Commons for the dish's name, and
 * the record page says so beside each one ("the subject is not confirmed"). A card has
 * no room for that warning, so on a card the photograph stands as a plain claim that
 * this is the dish. Sampled on 9 October, about one in four of those guesses is not
 * food at all: Brazil's page opened on a portrait for a cocktail called "Alexander",
 * "Doré" carried a Gustave Doré engraving, "Bonda" a photograph of the Bonda people,
 * "Agsechi Vayingim" a tray of seedlings.
 *
 * So a list shows only a photograph someone chose for this dish — its own article's,
 * its own Wikidata item's, its own recipe page's — and a guessed one is left to the
 * record page, where it is shown with its warning. A card without a picture is a
 * smaller card; a card with the wrong picture is a wrong fact.
 */

import { EN } from '../i18n/copy';
import type { Dish } from './types';

export const guessedPhoto = (dish: Pick<Dish, 'photoOrigin'>): boolean => dish.photoOrigin === EN.photoFromSearch;

export const listPhoto = (dish: Pick<Dish, 'photo' | 'photoOrigin'>): string => (guessedPhoto(dish) ? '' : dish.photo ?? '');
