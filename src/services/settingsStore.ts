import { LazyStore } from '@tauri-apps/plugin-store';
import { LayoutPosition } from '../types/layout';
import { MosqueData } from '../types/mosque';
import { Slide } from '../types/slide';
import { ThemeName } from '../types/theme';
import { FontThemeName } from '../types/fonts';
import { PrayerAudioSettings } from '../types/audio';

export interface LocationSettings {
    latitude: number;
    longitude: number;
    calculationMethod: string; // e.g., "Singapore", "MuslimWorldLeague", "Egyptian", etc.
}

export interface PrayerDurations {
    adzanDuration: number; // seconds
    iqamahWaitDuration: number; // seconds
    sholatDuration: number; // seconds
}

export interface FullscreenSettings {
    // Per-prayer duration settings
    Subuh: PrayerDurations;
    Dzuhur: PrayerDurations;
    Ashar: PrayerDurations;
    Maghrib: PrayerDurations;
    Isya: PrayerDurations;

    // Global settings
    screenSaverStart: string; // "22:00"
    screenSaverEnd: string; // "03:00"
    preKhutbahDuration: number; // seconds (Friday Dzuhur)
    khutbahDuration: number; // seconds (Friday Dzuhur)

    // Tartil/Tarhim display media
    tartilMediaUrl: string;
    tarhimMediaUrl: string;
}

const DEFAULT_PRAYER_DURATIONS: PrayerDurations = {
    adzanDuration: 300, // 5 min
    iqamahWaitDuration: 600, // 10 min
    sholatDuration: 900, // 15 min
};

export const DEFAULT_FULLSCREEN_SETTINGS: FullscreenSettings = {
    Subuh: { ...DEFAULT_PRAYER_DURATIONS, iqamahWaitDuration: 900 }, // Subuh longer iqamah
    Dzuhur: { ...DEFAULT_PRAYER_DURATIONS },
    Ashar: { ...DEFAULT_PRAYER_DURATIONS },
    Maghrib: { ...DEFAULT_PRAYER_DURATIONS, iqamahWaitDuration: 420 }, // Maghrib shorter
    Isya: { ...DEFAULT_PRAYER_DURATIONS },
    screenSaverStart: "22:00",
    screenSaverEnd: "03:00",
    preKhutbahDuration: 900,
    khutbahDuration: 1800,
    tartilMediaUrl: "",
    tarhimMediaUrl: "",
};

export interface AppSettings {
    layoutPosition: LayoutPosition;
    mosqueData: MosqueData;
    slides: Slide[];
    themeName: ThemeName;
    fontTheme: FontThemeName;
    audio: PrayerAudioSettings;
    prayerTimeOffsets: Record<string, number>; // Minutes offset for each prayer
    location: LocationSettings;
    fullscreen: FullscreenSettings;
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
