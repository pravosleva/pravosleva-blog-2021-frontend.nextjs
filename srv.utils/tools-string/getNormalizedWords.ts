export const getNormalizedWords = (words: string[]): string =>
  words.join(' ').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
