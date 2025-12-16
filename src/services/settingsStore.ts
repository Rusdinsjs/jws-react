import { LazyStore } from '@tauri-apps/plugin-store';
import { LayoutPosition } from '../types/layout';
import { MosqueData } from '../types/mosque';
import { Slide } from '../types/slide';
import { ThemeName } from '../types/theme';
import { FontThemeName } from '../types/fonts';
import { PrayerAudioSettings } from '../types/audio';

export interface AppSettings {
    layoutPosition: LayoutPosition;
    mosqueData: MosqueData;
    slides: Slide[];
    themeName: ThemeName;
    fontTheme: FontThemeName;
    audio: PrayerAudioSettings;
    prayerTimeOffsets: Record<string, number>; // Minutes offset for each prayer
}

const STORE_FILE = 'settings.json';

// Using LazyStore - better for React as it doesn't require async initialization
const store = new LazyStore(STORE_FILE);

export async function loadSettings(): Promise<AppSettings | null> {
    try {
        console.log('[Settings] Loading settings from store...');
        const settings = await store.get<AppSettings>('appSettings');
        console.log('[Settings] Loaded:', settings);
        return settings ?? null;
    } catch (error) {
        console.error('[Settings] Failed to load:', error);
        return null;
    }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
    try {
        console.log('[Settings] Saving settings...');
        await store.set('appSettings', settings);
        await store.save();
        console.log('[Settings] Settings saved successfully');
    } catch (error) {
        console.error('[Settings] Failed to save:', error);
        throw error;
    }
}
