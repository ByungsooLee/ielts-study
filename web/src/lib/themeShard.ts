import { ensureEnglishVocabTheme, type ThemeShardData } from "./staticContent";

export type ThemeShard = ThemeShardData;

export async function fetchThemeShard(themeNum: number): Promise<ThemeShard | null> {
  return ensureEnglishVocabTheme(themeNum);
}

export function clearThemeShardCache(): void {
  /* shardDataCache は staticContent 内で管理 */
}
