/**
 * A video, on the detail screen.
 *
 * The whole still is a link that opens the video at its source — we do not embed a
 * player, proxy the stream or autoplay. The rank badge is the cook's closeness to
 * the tradition, not a popularity position, and engagement figures are deliberately
 * absent throughout.
 *
 * Where the creator published no ingredient list, we say so rather than inventing
 * one, and offer the capture action instead.
 */

import { useCopy } from '../i18n';
import { StyleSheet, View } from 'react-native';
import { planTranslation, withLanguage } from '../domain/language';
import type { Video } from '../domain/types';
import { openAtSource, thumbnailUrl, watchUrl } from '../domain/video';
import { useTranslations } from '../state/translations';
import { color, radius, space, TAP_TARGET } from '../theme/tokens';
import { Button } from './Button';
import { PlayIcon } from './icons';
import { Photo } from './Photo';
import { Pressable } from './Pressable';
import { H6, Muted, T } from './Text';
import { Tag } from './Tag';

export function VideoCard({ video }: { video: Video }) {
  const copy = useCopy();
  const hasIngredients = !!video.ingredients?.length;
  const language = useTranslations((s) => s.language);

  // What the viewer will actually get in their language, and the sentence that says
  // so. We ask the provider for its own translated track or captions — we never dub
  // over the cook, and we never claim a translation that does not exist.
  const plan = planTranslation(video, language);
  const url = withLanguage(watchUrl(video), language, plan);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={copy.watchAtSourceCreator.replace('{creator}', video.creator)}
        tint="none"
        onPress={() => openAtSource(url)}
        style={styles.stillPress}
      >
        <Photo
          uri={thumbnailUrl(video)}
          label={copy.stillFromCreator.replace('{creator}', video.creator)}
          style={styles.still}
        />
        <View style={styles.playOverlay} pointerEvents="none">
          <View style={styles.playBadge}>
            <PlayIcon size={16} color={color.accent} weight="fill" />
          </View>
        </View>
        <Tag label={copy.watchAtSource} variant="neutral" fontSize={10} style={styles.watchChip} noWrap />
      </Pressable>

      <View style={styles.meta}>
        <View style={styles.rank}>
          <T style={styles.rankText}>{video.rank}</T>
        </View>
        <View style={styles.metaText}>
          <T style={styles.creator}>{video.creator}</T>
          <Muted style={styles.role}>{video.role}</Muted>
        </View>
      </View>

      {/* What language you will hear, and who did the translating. Stated every
          time, because "auto-dubbed" and "the cook's own voice" are not the same
          thing and the viewer is entitled to know which one they are getting. */}
      <View style={styles.languageRow}>
        <Tag
          label={
            plan.route === 'original'
              ? copy.originalAudio
              : plan.route === 'creator-audio'
                ? copy.creatorsOwnTranslation
                : plan.route === 'provider-captions'
                  ? copy.translatedCaptions
                  : copy.languageUnknown
          }
          variant={plan.route === 'creator-audio' || plan.route === 'original' ? 'outline' : 'neutral'}
          fontSize={10}
          noWrap
        />
        <Muted style={styles.languageNote}>{plan.note}</Muted>
      </View>

      {hasIngredients ? (
        <View style={styles.panel}>
          <H6 style={styles.panelHeading}>{copy.ingredientsInThisVideo}</H6>
          <View style={styles.chips}>
            {video.ingredients!.map((ingredient) => (
              <Tag key={ingredient} label={ingredient} variant="neutral" />
            ))}
          </View>
          {video.ingredientsSource ? <Muted style={styles.panelNote}>{video.ingredientsSource}</Muted> : null}
        </View>
      ) : (
        <View style={styles.panel}>
          <Muted style={styles.panelNote}>
            {copy.weDontInventOne}
          </Muted>
          <Button
            label={copy.captureFromVideo}
            variant="ghost"
            fontSize={12}
            onPress={() => openAtSource(url)}
            style={styles.captureButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: color.divider, borderRadius: radius.md, overflow: 'hidden' },
  stillPress: { position: 'relative' },
  still: { width: '100%', aspectRatio: 16 / 9 },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    // color-mix(in srgb, var(--color-bg) 78%, transparent)
    backgroundColor: 'rgba(22, 24, 38, 0.78)',
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  watchChip: { position: 'absolute', bottom: 8, right: 8 },

  meta: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 10 },
  rank: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { fontSize: 11, color: color.accent },
  metaText: { flex: 1 },
  creator: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  role: { fontSize: 12, lineHeight: 12 * 1.4 },

  languageRow: { paddingHorizontal: 10, paddingBottom: 10, gap: 6 },
  languageNote: { fontSize: 11, lineHeight: 11 * 1.5 },

  panel: { paddingHorizontal: 10, paddingBottom: 12 },
  panelHeading: { marginBottom: space[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: space[2] },
  panelNote: { fontSize: 11, lineHeight: 11 * 1.5 },
  // TAP_TARGET, not 36. This is the control that turns a viewer into a contributor,
  // and it sat below the size a finger reliably hits on the phone the app is built for.
  captureButton: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 0, minHeight: TAP_TARGET },
});
