/**
 * Where one sentence ends and the next begins, in every script the atlas is written in.
 *
 * Two places split text into sentences — the record page, so a video card does not repeat
 * what the card above it said, and the page check, so it can tell when a sentence is
 * printed twice. Each had its own copy of the same regex, and both copies knew `.` and `。`
 * and not `।`, the danda that ends a Hindi sentence. So in Hindi the captions sentence
 * still printed under every video, and the check built to catch exactly that could not
 * see it. One rule, here, so the next script added is added once.
 *
 * Latin and Cyrillic end with `. ! ?`; Chinese and Japanese with `。！？`; Hindi with `।`.
 */
const SENTENCE_END = /(?<=[.!?。！？।])\s*/u;

export const sentencesOf = (text: string): string[] =>
  text
    .split(SENTENCE_END)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
